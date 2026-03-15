# Spring Boot Demo Application

## Запуск через Docker

### Требования
- Docker Desktop с включённой WSL интеграцией

### Команды

**Запуск приложения с PostgreSQL:**
```bash
cd demo
docker compose up -d --build
```

**Просмотр логов:**
```bash
docker compose logs -f backend
docker compose logs -f postgres
```

**Остановка:**
```bash
docker compose down
```

**Остановка с удалением данных БД:**
```bash
docker compose down -v
```

**Пересборка и перезапуск:**
```bash
docker compose up -d --build --force-recreate
```

## API Endpoints

### Регистрация пользователя
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "user1",
    "password": "password123",
    "email": "user1@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Авторизация (по email)
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'
```

### Отправка промпта (требуется авторизация)
```bash
curl -X POST http://localhost:8080/api/prompt \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic <base64_credentials>" \
  -d '{
    "prompt": "Your prompt text here"
  }'
```

### Получение истории промптов (требуется авторизация)
```bash
curl -X GET http://localhost:8080/api/prompt/history \
  -H "Authorization: Basic <base64_credentials>"
```

### Пример ответа истории промптов
```json
[
  {
    "id": 1,
    "prompt": "Your prompt text here",
    "response": "Response from external service",
    "createdAt": "2026-03-15T10:30:00"
  }
]
```

## Локальная разработка (без Docker)

```bash
cd demo
./gradlew bootRun
```

## Подключение к базе данных

**Параметры подключения (из хоста):**
- Host: `localhost`
- Port: `5432`
- Database: `demo_db`
- Username: `postgres`
- Password: `postgres`

**Параметры подключения (из контейнера backend):**
- Host: `postgres`
- Port: `5432`
- Database: `demo_db`
- Username: `postgres`
- Password: `postgres`

**VS Code PostgreSQL Extension:**
- Connection Name: `demo_db`
- Server Name: `localhost`
- Port: `5432`
- Database Name: `demo_db`
- User Name: `postgres`
- Password: `postgres`
- Authentication Type: `Password`

## Структура проекта

```
demo/
├── src/main/java/com/example/demo/
│   ├── DemoApplication.java          # Точка входа
│   ├── datasource/                   # Репозитории
│   │   ├── UserRepository.java
│   │   └── PromptHistoryRepository.java
│   ├── domain/                       # Бизнес-логика
│   │   ├── User.java
│   │   ├── Role.java
│   │   ├── UserService.java
│   │   ├── PromptHistory.java
│   │   └── PromptService.java
│   ├── di/                           # Конфигурация
│   │   ├── SecurityConfig.java
│   │   ├── RestTemplateConfig.java
│   │   └── GlobalExceptionHandler.java
│   ├── web/                          # REST контроллеры
│   │   ├── AuthController.java
│   │   └── PromptController.java
│   └── dto/                          # DTO классы
│       ├── RegisterRequest.java
│       ├── LoginRequest.java
│       ├── AuthResponse.java
│       ├── PromptRequest.java
│       ├── PromptResponse.java
│       └── PromptHistoryItem.java
├── Dockerfile
├── docker-compose.yml
└── docker-compose.dev.yml
```

## Переменные окружения

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `SPRING_DATASOURCE_URL` | JDBC URL PostgreSQL | `jdbc:postgresql://postgres:5432/demo_db` |
| `SPRING_DATASOURCE_USERNAME` | Пользователь БД | `postgres` |
| `SPRING_DATASOURCE_PASSWORD` | Пароль БД | `postgres` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Стратегия Hibernate | `update` |
| `SPRING_JPA_SHOW_SQL` | Показывать SQL запросы | `true` |
| `EXTERNAL_SERVICE_URL` | URL внешнего сервиса для обработки промптов | (пусто) |

**Пример запуска с кастомными настройками:**
```bash
docker compose up -d --build \
  -e SPRING_DATASOURCE_PASSWORD=mysecretpassword \
  -e EXTERNAL_SERVICE_URL=http://localhost:8081/api/prompt
```
