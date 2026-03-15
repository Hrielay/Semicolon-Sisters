/**
 * API layer
 *
 * This module provides a structured approach to API integration with:
 * - Axios instance with interceptors
 * - TanStack Query hooks for data fetching
 * - Type-safe API services
 * - Centralized error handling
 *
 * @example
 * ```ts
 * // In a Vue component
 * import { useUsers, useCreateUser } from '@/api'
 *
 * const { data: users, isLoading } = useUsers()
 * const createUser = useCreateUser()
 *
 * createUser.mutate({ name: 'John', email: 'john@example.com' })
 * ```
 */
export * from './http'
export * from './vueQuery'
export * from './types'
export * from './error'
export * from './services'
export * from './hooks'
