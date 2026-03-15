"""
CrewAI service: parse date/time and location from a natural language string.
Uses GigaChat API (Sber) directly for auth and chat completions.

Usage: echo "Вечер в пятницу в Москве" | python parse_request.py
       python parse_request.py  (then type your prompt and press Ctrl+D)

Required env vars (in .env):
  GIGACHAT_CREDENTIALS  — Base64("ClientID:ClientSecret") from Sber cabinet
  GIGACHAT_SCOPE        — GIGACHAT_API_PERS | GIGACHAT_API_B2B | GIGACHAT_API_CORP
"""

import sys
import json
import re
from datetime import date

import urllib3
import litellm
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process, LLM

from gigachat_token import get_token

# Suppress SSL warnings — Sber uses a custom CA not trusted by macOS
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Tell LiteLLM (used internally by CrewAI) to skip SSL verification
litellm.ssl_verify = False

load_dotenv()

TODAY = date.today().isoformat()

_GIGACHAT_BASE_URL = "https://gigachat.devices.sberbank.ru/api/v1"


def build_llm() -> LLM:
    """
    GigaChat exposes an OpenAI-compatible /chat/completions endpoint.
    CrewAI's LLM uses LiteLLM under the hood — the 'openai/' prefix tells
    LiteLLM to route to a custom OpenAI-compatible base_url.
    """
    return LLM(
        model="openai/GigaChat",
        base_url=_GIGACHAT_BASE_URL,
        api_key=get_token(),   # Bearer token from POST /api/v2/oauth
    )


def build_crew(user_prompt: str) -> Crew:
    analyst = Agent(
        role="Request Analyst",
        goal="Extract structured date/time and location data from a natural language request.",
        backstory=(
            "You are an expert at parsing informal human text and extracting "
            "structured temporal and geographic information from it."
        ),
        llm=build_llm(),
        verbose=False,
        allow_delegation=False,
    )

    task = Task(
        description=(
            f"Today's date is {TODAY}.\n"
            f"User prompt: \"{user_prompt}\"\n\n"
            "Extract the following fields from the prompt:\n"
            "- date: ISO-8601 date string (YYYY-MM-DD). Resolve relative expressions "
            "  like 'Saturday', 'next Friday', 'tomorrow' using today's date.\n"
            "- time: HH:MM in 24-hour format, or null if not specified.\n"
            "- location: city or place name as a string, or null if not specified.\n\n"
            "Respond with ONLY a valid JSON object, no markdown, no explanation:\n"
            '{"date": "...", "time": "...", "location": "..."}'
        ),
        expected_output='A JSON object with keys: date, time, location.',
        agent=analyst,
    )

    return Crew(
        agents=[analyst],
        tasks=[task],
        process=Process.sequential,
        verbose=False,
    )


def main():
    if sys.stdin.isatty():
        print("Введите запрос (Ctrl+D для завершения):")
    user_prompt = sys.stdin.read().strip()
    if not user_prompt:
        print("Error: no input provided.", file=sys.stderr)
        sys.exit(1)

    crew = build_crew(user_prompt)
    result = crew.kickoff()

    raw = str(result).strip()

    try:
        parsed = json.loads(raw)
        print(json.dumps(parsed, ensure_ascii=False, indent=2))
    except json.JSONDecodeError:
        match = re.search(r'\{.*?\}', raw, re.DOTALL)
        if match:
            parsed = json.loads(match.group())
            print(json.dumps(parsed, ensure_ascii=False, indent=2))
        else:
            print(raw)


if __name__ == "__main__":
    main()
