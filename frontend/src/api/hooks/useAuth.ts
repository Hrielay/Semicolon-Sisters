import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/vue-query'
import { authService } from '@/api/services/auth.service'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/api/types/user.types'
import type { ApiError } from '@/api/types'

/**
 * Query keys for auth queries
 */
export const authQueryKeys = {
  all: ['auth'] as const,
  current: () => [...authQueryKeys.all, 'current'] as const,
}

/**
 * Hook for user login
 */
export function useLogin(options?: UseMutationOptions<AuthResponse, ApiError, LoginCredentials>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Store tokens (implement your own storage logic)
      // localStorage.setItem('accessToken', data.tokens.accessToken)
      // localStorage.setItem('refreshToken', data.tokens.refreshToken)

      // Set current user in cache
      queryClient.setQueryData(authQueryKeys.current(), data.user)

      // Invalidate auth queries
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    ...options,
  })
}

/**
 * Hook for user registration
 */
export function useRegister(options?: UseMutationOptions<AuthResponse, ApiError, RegisterData>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Store tokens
      // localStorage.setItem('accessToken', data.tokens.accessToken)
      // localStorage.setItem('refreshToken', data.tokens.refreshToken)

      // Set current user in cache
      queryClient.setQueryData(authQueryKeys.current(), data.user)
    },
    ...options,
  })
}

/**
 * Hook for user logout
 */
export function useLogout(options?: UseMutationOptions<void, ApiError, void>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear tokens
      // localStorage.removeItem('accessToken')
      // localStorage.removeItem('refreshToken')

      // Clear all queries
      queryClient.clear()
    },
    ...options,
  })
}

/**
 * Hook for password reset request
 */
export function useRequestPasswordReset(options?: UseMutationOptions<void, ApiError, string>) {
  return useMutation({
    mutationFn: (email: string) => authService.requestPasswordReset(email),
    ...options,
  })
}

/**
 * Hook for password reset confirmation
 */
export function useResetPassword(
  options?: UseMutationOptions<void, ApiError, { token: string; password: string }>,
) {
  return useMutation({
    mutationFn: ({ token, password }) => authService.resetPassword(token, password),
    ...options,
  })
}
