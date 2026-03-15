import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/vue-query'
import { userService } from '@/api/services/user.service'
import type { User } from '@/api/types/user.types'
import type { ApiError } from '@/api/types'
import type { Ref } from 'vue'

/**
 * Query keys for user queries
 * Using factory pattern for type-safe query keys
 */
export const userQueryKeys = {
  all: ['users'] as const,
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (params: { page?: number; pageSize?: number }) =>
    [...userQueryKeys.lists(), { params }] as const,
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: number) => [...userQueryKeys.details(), id] as const,
  current: () => [...userQueryKeys.all, 'current'] as const,
}

/**
 * Hook to get all users with pagination
 */
export function useUsers(
  params?: { page?: number; pageSize?: number } | Ref<{ page?: number; pageSize?: number }>,
) {
  const paramsValue = typeof params === 'object' && 'value' in params ? params.value : params

  return useQuery({
    queryKey: paramsValue ? userQueryKeys.list(paramsValue) : userQueryKeys.lists(),
    queryFn: () => userService.getUsers(paramsValue),
    staleTime: 1000 * 60 * 5, // 5 minutes
  } as UseQueryOptions)
}

/**
 * Hook to get user by ID
 */
export function useUser(userId: number | Ref<number>) {
  const userIdValue = typeof userId === 'object' && 'value' in userId ? userId.value : userId

  return useQuery({
    queryKey: userQueryKeys.detail(userIdValue),
    queryFn: () => userService.getUserById(userIdValue),
    enabled: !!userIdValue,
    staleTime: 1000 * 60 * 5, // 5 minutes
  } as UseQueryOptions)
}

/**
 * Hook to get current user profile
 */
export function useCurrentUser() {
  return useQuery({
    queryKey: userQueryKeys.current(),
    queryFn: () => userService.getCurrentUser(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new user
 */
export function useCreateUser(options?: UseMutationOptions<User, ApiError, Partial<User>>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.createUser(data),
    onSuccess: () => {
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}

/**
 * Hook to update user
 */
export function useUpdateUser(
  options?: UseMutationOptions<User, ApiError, { id: number; data: Partial<User> }>,
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Update the specific user in cache
      queryClient.setQueryData(userQueryKeys.detail(variables.id), data)
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}

/**
 * Hook to delete user
 */
export function useDeleteUser(options?: UseMutationOptions<void, ApiError, number>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(id) })
      // Invalidate users list to refetch
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() })
    },
    ...options,
  })
}
