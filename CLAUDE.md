# Project: "Ideal Weekend" AI Planner

## 🏗 System Architecture
The application follows a microservices pattern consisting of three decoupled services to ensure rapid development and scalability during the hackathon.

1.  **Frontend (Next.js 14/15):** User interface, interactive maps, and real-time chat.
2.  **Main Backend (Java 21 + Spring Boot 4):** Orchestrator, User Management (JWT), Postgres Persistence
3.  **AI Agent Service (Python 3.11+ + CrewAI):** The "Brain" that decomposes prompts, searches for data, and executes bookings.

---

## 🤖 AI Agent Logic (CrewAI)
We utilize a multi-agent system to handle complex planning tasks.

### Agents
* **Request Analyst:** Extracts structured data (date, location, intent) from natural language.
* **City Explorer:** Uses Search Tools (Maps/Web) to find high-rated venues and events.
* **Logistics Manager:** Checks weather forecasts and calculates travel times between waypoints.
* **Concierge:** Handles simulated or API-based table bookings.

### Process Flow
1.  **Input:** User prompt (e.g., "Plan my May 15th in Moscow").
2.  **Task 1 (Analysis):** Identify `date="2026-05-15"`, `city="Moscow"`.
3.  **Task 2 (Research):** Branch out to Weather API and Places API.
4.  **Task 3 (Synthesis):** Create a chronological JSON itinerary.
5.  **Output:** Structured JSON sent back to the Java Backend.

---

## 🛠 Tech Stack & Integration

### 1. Main Backend (Spring Boot)
* **Language:** Java 21 (using Records and Virtual Threads).
* **Database:** PostgreSQL (Stores User profiles and saved `Itinerary` objects).
* **Communication:** * `RestTemplate` or `WebClient` to call the Python FastAPI endpoint.
    * `SseEmitter` for streaming agent progress to the Frontend.

### 2. AI Service (FastAPI + CrewAI)
* **Core:** `crewai`, `langchain-openai`.
* **Endpoints:** `POST /api/v1/agent/plan`
* **Payload Example:**
```json
{
  "user_id": "uuid",
  "prompt": "Ideal Saturday in Moscow",
  "current_date": "2026-03-15"
}