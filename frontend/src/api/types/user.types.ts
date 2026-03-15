export interface User {
  id: number
  username: string
  email: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  message: string
  username: string
  email: string
}

export interface PromptRequest {
  prompt: string
}

export interface PromptResponse {
  id: number
  prompt: string
  response: string
  status: string
}

export interface PromptHistoryItem {
  id: number
  prompt: string
  response: string
  createdAt: string
}
