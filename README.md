# Semicolon Sisters — "Ideal Weekend" AI Planner

An AI-powered weekend planner that takes a natural language prompt ("Plan my Saturday in Moscow") and returns a structured itinerary with venue suggestions, weather checks, and optional reservations.

---

## Architecture

Three decoupled microservices:

```
┌─────────────┐     REST/SSE     ┌──────────────────┐     HTTP     ┌─────────────────┐
│  Frontend   │ ◄──────────────► │  Backend         │ ◄──────────► │  AI Agent       │
│  Vue 3 +    │                  │  Java 21 +       │              │  Python 3.11 +  │
│  TypeScript │                  │  Spring Boot     │              │  CrewAI         │
└─────────────┘                  └──────────────────┘              └─────────────────┘
                                          │
                                          ▼
                                    PostgreSQL
```

See [`CLAUDE.md`](./CLAUDE.md) for full architecture, agent logic, and tech-stack details.

---

## File Structure

```
Semicolon-Sisters/
│
├── agents/                         # AI Agent Service (Python + CrewAI)
│   ├── parse_request.py            # CrewAI crew: parses date/time/location from prompt
│   ├── gigachat_token.py           # OAuth token retrieval for GigaChat API
│   ├── gigachat_api/               # GigaChat client helpers
│   ├── requirements.txt            # Python dependencies
│   ├── setup.sh                    # Environment setup script
│   ├── .env.example                # Required env vars template
│   └── .env                        # Local secrets (not committed)
│
├── backend/
│   └── demo/                       # Main Backend Service (Java 21 + Spring Boot)
│       ├── src/main/java/com/example/demo/
│       │   ├── DemoApplication.java            # Spring Boot entry point
│       │   ├── web/                            # REST controllers
│       │   │   ├── AuthController.java         # /auth endpoints (register, login)
│       │   │   └── PromptController.java       # /prompt endpoint → calls AI agent
│       │   ├── domain/                         # Business logic & JPA entities
│       │   │   ├── User.java / UserService.java
│       │   │   ├── PromptHistory.java / PromptService.java
│       │   │   └── Role.java
│       │   ├── dto/                            # Request/response payloads
│       │   │   ├── AuthResponse.java / LoginRequest.java / RegisterRequest.java
│       │   │   └── PromptRequest.java / PromptResponse.java / PromptHistoryItem.java
│       │   ├── datasource/                     # Spring Data JPA repositories
│       │   │   ├── UserRepository.java
│       │   │   └── PromptHistoryRepository.java
│       │   └── di/                             # Config & cross-cutting concerns
│       │       ├── SecurityConfig.java         # JWT + Spring Security setup
│       │       ├── RestTemplateConfig.java     # HTTP client bean
│       │       └── GlobalExceptionHandler.java
│       ├── application.properties              # DB connection, JWT secret, agent URL
│       ├── build.gradle.kts                    # Gradle build (Kotlin DSL)
│       ├── docker-compose.yml                  # Spins up PostgreSQL locally
│       ├── Dockerfile                          # Backend container image
│       └── README.md                           # Backend-specific setup guide
│
├── frontend/                       # Frontend (Vue 3 + TypeScript + Vuetify)
│   ├── src/
│   │   ├── main.ts                 # App entry point
│   │   ├── App.vue                 # Root component
│   │   ├── views/
│   │   │   ├── LandingView.vue     # Landing/home page
│   │   │   └── ChatView.vue        # Main chat interface
│   │   ├── components/
│   │   │   ├── chat/
│   │   │   │   ├── ChatInput.vue   # Message input box
│   │   │   │   ├── ChatMessage.vue # Single message bubble
│   │   │   │   └── ChatHistory.vue # Message thread
│   │   │   └── LoadingSpinner.vue
│   │   ├── stores/
│   │   │   └── chat.ts             # Pinia store: chat state & history
│   │   ├── api/
│   │   │   ├── http.ts             # Axios instance with auth interceptor
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts # login / register calls
│   │   │   │   └── user.service.ts # user profile calls
│   │   │   └── hooks/
│   │   │       ├── useAuth.ts      # TanStack Query auth hooks
│   │   │       └── useUser.ts      # TanStack Query user hooks
│   │   ├── services/
│   │   │   └── pdfExport.ts        # Export itinerary as PDF
│   │   ├── router/index.ts         # Vue Router routes
│   │   ├── plugins/vuetify.ts      # Vuetify theme & component setup
│   │   └── types/chat.ts           # Chat message TypeScript types
│   ├── vite.config.ts              # Vite bundler config
│   ├── vitest.config.ts            # Unit test config
│   ├── Dockerfile                  # Frontend container image
│   ├── API_GUIDE.md                # Frontend ↔ Backend API contract
│   └── spec.md                     # UI/feature specification
│
├── CLAUDE.md                       # Full architecture & agent design reference
├── LICENSE
└── README.md                       # This file
```

---

## Quick Start

### Prerequisites
- Java 21, Docker, Node.js 18+, Python 3.11+, Yarn

### 1. Database
```bash
cd backend/demo
docker-compose up -d   # starts PostgreSQL on port 5432
```

### 2. Backend
```bash
cd backend/demo
./gradlew bootRun
# runs on http://localhost:8080
```

### 3. AI Agent Service
```bash
cd agents
cp .env.example .env   # fill in GIGACHAT_CREDENTIALS and GIGACHAT_SCOPE
bash setup.sh
source .venv/bin/activate
# start FastAPI (see agents/README or CLAUDE.md for the server command)
```

### 4. Frontend
```bash
cd frontend
yarn install
yarn dev
# runs on http://localhost:5173
```

---

## Key Env Variables

| Service  | Variable               | Description                              |
|----------|------------------------|------------------------------------------|
| agents   | `GIGACHAT_CREDENTIALS` | Base64("ClientID:ClientSecret") from Sber |
| agents   | `GIGACHAT_SCOPE`       | `GIGACHAT_API_PERS` / `_B2B` / `_CORP`  |
| backend  | `spring.datasource.url`| PostgreSQL JDBC URL                      |
| backend  | `jwt.secret`           | Secret key for JWT signing               |
| backend  | agent service URL      | URL of the Python FastAPI service        |
