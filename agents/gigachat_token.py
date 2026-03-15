"""
GigaChat OAuth token manager.
Fetches a new access token and caches it for 29 minutes (token lives 30 min).

Required env vars:
  GIGACHAT_CREDENTIALS — Base64("ClientID:ClientSecret") from Sber cabinet
  GIGACHAT_SCOPE       — GIGACHAT_API_PERS | GIGACHAT_API_B2B | GIGACHAT_API_CORP
"""

import os
import time
import uuid
import requests

_TOKEN_URL = "https://ngw.devices.sberbank.ru:9443/api/v2/oauth"
_TOKEN_TTL = 29 * 60  # 29 min (token lives 30 min)

_cached_token: str | None = None
_token_fetched_at: float = 0.0


def get_token() -> str:
    global _cached_token, _token_fetched_at

    if _cached_token and (time.time() - _token_fetched_at) < _TOKEN_TTL:
        return _cached_token

    credentials = os.environ["GIGACHAT_CREDENTIALS"]
    scope = os.environ.get("GIGACHAT_SCOPE", "GIGACHAT_API_PERS")

    response = requests.post(
        _TOKEN_URL,
        headers={
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
            "RqUID": str(uuid.uuid4()),
            "Authorization": f"Basic {credentials}",
        },
        data={"scope": scope},
        verify=False,  # Sber uses a custom Russian CA
    )
    response.raise_for_status()

    _cached_token = response.json()["access_token"]
    _token_fetched_at = time.time()
    return _cached_token
