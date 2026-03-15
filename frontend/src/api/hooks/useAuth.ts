import { useMutation, useQueryClient, type UseMutationOptions } from '@tanstack/vue-query'
import { authService } from '@/api/services/auth.service'
import { useAuthStore } from '@/stores/auth'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/api/types/user.types'
import type { ApiError } from '@/api/types'

export const authQueryKeys = {
  all: ['auth'] as const,
  current: () => [...authQueryKeys.all, 'current'] as const,
}

export function useLogin(options?: UseMutationOptions<AuthResponse, ApiError, LoginCredentials>) {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data, variables) => {
      authStore.setCredentials(variables.email, variables.password, data.username)
      queryClient.invalidateQueries({ queryKey: authQueryKeys.all })
    },
    ...options,
  })
}

export function useRegister(options?: UseMutationOptions<AuthResponse, ApiError, RegisterData>) {
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data, variables) => {
      authStore.setCredentials(variables.email, variables.password, data.username)
    },
    ...options,
  })
}

export function useLogout(options?: UseMutationOptions<void, ApiError, void>) {
  const queryClient = useQueryClient()
  const authStore = useAuthStore()

  return useMutation({
    mutationFn: async () => {
      authStore.clearCredentials()
    },
    onSuccess: () => {
      queryClient.clear()
    },
    ...options,
  })
}
