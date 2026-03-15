# Project Context: Vue 3 Frontend Template

## Project Overview

This is a **Vue 3 frontend template project** built with modern tooling and best practices. It serves as a starting point for developing single-page applications (SPAs) with Vue 3, TypeScript, and a robust API integration layer.

### Core Technologies

| Technology | Purpose |
|------------|---------|
| **Vue 3** | Frontend framework with Composition API and `<script setup>` |
| **TypeScript** | Type safety throughout the codebase |
| **Vite** | Build tool and dev server |
| **Pinia** | State management |
| **Vue Router** | Client-side routing |
| **TanStack Query (Vue Query)** | Server-state management and data fetching |
| **Axios** | HTTP client for API requests |

### Project Structure

```
test-git/
└── frontend/
    ├── src/
    │   ├── api/              # API integration layer
    │   │   ├── hooks/        # TanStack Query custom hooks
    │   │   ├── services/     # API service functions
    │   │   ├── types/        # TypeScript types for API
    │   │   ├── error.ts      # Error handling utilities
    │   │   ├── http.ts       # Axios instance configuration
    │   │   └── vueQuery.ts   # VueQuery plugin setup
    │   ├── assets/           # Static assets (CSS, images)
    │   ├── components/       # Reusable Vue components
    │   ├── router/           # Vue Router configuration
    │   ├── stores/           # Pinia stores
    │   ├── views/            # Page-level components
    │   ├── App.vue           # Root component
    │   └── main.ts           # Application entry point
    ├── public/               # Public static files
    ├── .husky/               # Git hooks
    ├── .vscode/              # VS Code settings
    └── [config files]
```

## Building and Running

### Prerequisites

- **Node.js**: v20.19.0+ or v22.12.0+
- **Yarn**: Managed via Corepack

### Installation

```sh
cd frontend
yarn
```

### Development

```sh
# Start dev server with hot-reload
yarn dev

# Type checking
yarn type-check
```

### Production

```sh
# Build for production (includes type-checking)
yarn build

# Preview production build
yarn preview
```

### Testing

```sh
# Run unit tests with Vitest
yarn test:unit
```

### Code Quality

```sh
# Lint with ESLint and oxlint
yarn lint

# Format with Prettier
yarn format
```

### Docker

Build and run using Docker:

```sh
docker build -f frontend/Dockerfile -t frontend ./frontend
docker run -p 80:80 frontend
```

## Development Conventions

### TypeScript

- Strict type checking enabled
- `.vue` files supported via `vue-tsc` and Volar extension
- Path alias `@` resolves to `src/`

### Code Style

- **Prettier**: Auto-formatting on save recommended
  - No semicolons
  - Single quotes
  - 100 character print width
- **ESLint**: Combined with oxlint for linting
  - Vue 3 essential rules
  - TypeScript recommended rules
  - Vitest rules for test files

### Git Hooks

Husky is configured for pre-commit hooks. Runs automatically on `postinstall`.

### Vue 3 Patterns

- Use `<script setup lang="ts">` syntax
- Composition API over Options API
- Pinia for global state (see `src/stores/counter.ts` for pattern)
- Vue Router for navigation with `<RouterLink>` and `<RouterView>`

## API Integration

The project includes a structured API layer using TanStack Query:

### Environment Variables

Create `frontend/.env` based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

### Usage Pattern

```vue
<script setup lang="ts">
import { useUsers, useCreateUser } from '@/api'

// Query
const { data: users, isLoading } = useUsers()

// Mutation
const createUser = useCreateUser({
  onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
})
</script>
```

See `API_GUIDE.md` for detailed API integration patterns.

## AI Development Setup

This project uses **Qwen Code** with specialized Vue.js skills:

| Skill | Use Case |
|-------|----------|
| `vue-best-practices` | General Vue 3 components and Composition API |
| `vue-pinia-best-practices` | Pinia store development |
| `vue-router-best-practices` | Router configuration and navigation |
| `vue-testing-best-practices` | Component and E2E testing |
| `vue-debug-guides` | Debugging runtime errors |
| `create-adaptable-composable` | Creating reusable composables |

Skills are automatically applied based on the file being edited.

## Recommended IDE Setup

- **VS Code** with:
  - [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) extension (disable Vetur)
  - ESLint and Prettier extensions

## Key Configuration Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite build configuration with Vue plugin |
| `tsconfig.json` | TypeScript project references |
| `eslint.config.ts` | ESLint flat config with Vue/TS rules |
| `.prettierrc.json` | Prettier formatting rules |
| `.oxlintrc.json` | oxlint configuration |
| `vitest.config.ts` | Vitest test runner config |
| `nginx.conf` | Production nginx configuration |
