/**
 * User types
 */
export interface User {
  id: number
  email: string
  name: string
  avatar?: string
  role: 'admin' | 'user' | 'guest'
  createdAt: string
  updatedAt: string
}

/**
 * User login credentials
 */
export interface LoginCredentials {
  email: string
  password: string
}

/**
 * User registration data
 */
export interface RegisterData {
  email: string
  password: string
  name: string
}

/**
 * Auth tokens
 */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
