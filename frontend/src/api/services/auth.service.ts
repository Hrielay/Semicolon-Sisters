import { http } from '../http'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  AuthTokens,
} from '@/api/types/user.types'

/**
 * Authentication service - API calls related to auth
 */
export const authService = {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials) {
    const response = await http.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  /**
   * Register new user
   */
  async register(data: RegisterData) {
    const response = await http.post<AuthResponse>('/auth/register', data)
    return response.data
  },

  /**
   * Logout user
   */
  async logout() {
    const response = await http.post('/auth/logout')
    return response.data
  },

  /**
   * Refresh access token
   */
  async refreshToken() {
    const response = await http.post<AuthTokens>('/auth/refresh')
    return response.data
  },

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string) {
    const response = await http.post('/auth/password-reset', { email })
    return response.data
  },

  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string) {
    const response = await http.post('/auth/password-reset/confirm', {
      token,
      password,
    })
    return response.data
  },
}
