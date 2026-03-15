import type { User } from '@/api/types/user.types'
import { http } from '../http'

/**
 * User service - API calls related to user management
 */
export const userService = {
  /**
   * Get all users with pagination
   */
  async getUsers(params?: { page?: number; pageSize?: number }) {
    const response = await http.get('/users', { params })
    return response.data
  },

  /**
   * Get user by ID
   */
  async getUserById(id: number) {
    const response = await http.get<User>(`/users/${id}`)
    return response.data
  },

  /**
   * Create new user
   */
  async createUser(data: Partial<User>) {
    const response = await http.post<User>('/users', data)
    return response.data
  },

  /**
   * Update user
   */
  async updateUser(id: number, data: Partial<User>) {
    const response = await http.put<User>(`/users/${id}`, data)
    return response.data
  },

  /**
   * Delete user
   */
  async deleteUser(id: number) {
    const response = await http.delete(`/users/${id}`)
    return response.data
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    const response = await http.get<User>('/users/me')
    return response.data
  },
}
