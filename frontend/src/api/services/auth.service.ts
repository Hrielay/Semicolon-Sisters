import { http } from '../http'
import type { AuthResponse, LoginCredentials, RegisterData } from '@/api/types/user.types'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/login', credentials)
    return response.data
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await http.post<AuthResponse>('/auth/register', data)
    return response.data
  },
}
