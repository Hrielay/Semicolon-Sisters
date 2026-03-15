# API Integration Guide

This project uses **TanStack Query (Vue Query)** with **Axios** for data fetching and state management.

## 📁 Structure

```
src/api/
├── index.ts              # Main exports
├── http.ts               # Axios instance with interceptors
├── vueQuery.ts           # VueQuery plugin configuration
├── types.ts              # Common API types
├── error.ts              # Error handling utilities
├── types/                # Domain-specific types
│   ├── index.ts
│   └── user.types.ts
├── services/             # API services
│   ├── index.ts
│   ├── auth.service.ts
│   └── user.service.ts
└── hooks/                # TanStack Query hooks
    ├── index.ts
    ├── useAuth.ts
    └── useUser.ts
```

## 🚀 Quick Start

### Basic Usage in Components

```vue
<script setup lang="ts">
import { useUsers, useCreateUser } from '@/api'

// Query example
const { data: users, isLoading, error } = useUsers()

// Mutation example
const createUser = useCreateUser({
  onSuccess: () => {
    console.log('User created!')
  },
  onError: (error) => {
    console.error('Failed to create user:', error)
  },
})

const handleSubmit = () => {
  createUser.mutate({ name: 'John', email: 'john@example.com' })
}
</script>
```

## 📖 Configuration

### Environment Variables

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
```

### VueQuery Configuration

Default query options are configured in `src/api/vueQuery.ts`:

- **staleTime**: 5 minutes
- **gcTime**: 30 minutes
- **retry**: 3 times (excludes AbortError)
- **refetchOnMount**: always

## 📝 Creating New API Integrations

### 1. Create Types

Add types in `src/api/types/`:

```typescript
// src/api/types/product.types.ts
export interface Product {
  id: number
  name: string
  price: number
  createdAt: string
}

export interface CreateProductDto {
  name: string
  price: number
}
```

### 2. Create Service

Add service in `src/api/services/`:

```typescript
// src/api/services/product.service.ts
import { http } from '../http'
import type { Product, CreateProductDto } from './types'

export const productService = {
  async getProducts() {
    const response = await http.get<Product[]>('/products')
    return response.data
  },

  async getProductById(id: number) {
    const response = await http.get<Product>(`/products/${id}`)
    return response.data
  },

  async createProduct(data: CreateProductDto) {
    const response = await http.post<Product>('/products', data)
    return response.data
  },
}
```

### 3. Create Hooks

Add hooks in `src/api/hooks/`:

```typescript
// src/api/hooks/useProduct.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import { productService } from '@/api/services/product.service'
import type { Product, CreateProductDto } from '@/api/types/product.types'

export const productQueryKeys = {
  all: ['products'] as const,
  lists: () => [...productQueryKeys.all, 'list'] as const,
  details: () => [...productQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...productQueryKeys.details(), id] as const,
}

export function useProducts() {
  return useQuery({
    queryKey: productQueryKeys.lists(),
    queryFn: () => productService.getProducts(),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productQueryKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductDto) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productQueryKeys.lists() })
    },
  })
}
```

### 4. Export

Update exports in respective `index.ts` files.

## 🔑 Best Practices

### Query Keys

Use factory pattern for type-safe query keys:

```typescript
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params: { page?: number }) => [...userQueryKeys.lists(), params] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
}
```

### Error Handling

Use the built-in error handler:

```typescript
import { extractApiError } from '@/api'

try {
  await someApiCall()
} catch (error) {
  const apiError = extractApiError(error)
  console.error(apiError.message)
}
```

### Cache Invalidation

Always invalidate related queries after mutations:

```typescript
const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
  },
})
```

### Optimistic Updates

For better UX, use optimistic updates:

```typescript
const deleteUser = useMutation({
  mutationFn: (id: number) => userService.deleteUser(id),
  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: userQueryKeys.lists() })
    const previousUsers = queryClient.getQueryData(userQueryKeys.lists())
    queryClient.setQueryData(userQueryKeys.lists(), (old) =>
      old?.filter((user) => user.id !== id)
    )
    return { previousUsers }
  },
  onError: (err, id, context) => {
    queryClient.setQueryData(userQueryKeys.lists(), context?.previousUsers)
  },
})
```

## 🛠 Authentication

### Setup Token Handling

Update `src/api/http.ts` to handle auth tokens:

```typescript
// Request interceptor - add token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor - handle 401
http.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      // router.push('/login')
    }
    return Promise.reject(error)
  },
)
```

### Using Auth Hooks

```vue
<script setup lang="ts">
import { useLogin, useLogout, useCurrentUser } from '@/api'

const login = useLogin({
  onSuccess: () => {
    router.push('/dashboard')
  },
})

const logout = useLogout({
  onSuccess: () => {
    router.push('/login')
  },
})

const { data: currentUser } = useCurrentUser()
</script>
```

## 🧪 Testing

### Mocking Queries in Tests

```typescript
import { VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'

const wrapper = mount(Component, {
  global: {
    plugins: [VueQueryPlugin],
  },
})
```

## 📚 Resources

- [TanStack Query Vue Documentation](https://tanstack.com/query/v5/docs/vue/overview)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Vue Query Devtools](https://tanstack.com/query/v5/docs/vue/devtools)
