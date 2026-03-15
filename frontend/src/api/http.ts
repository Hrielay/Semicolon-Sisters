import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

// Configuration
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
const TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT) || 30000

// Create axios instance
export const http = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if exists
    // const token = getAuthToken()
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

// Response interceptor
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Handle unauthorized - redirect to login or refresh token
          // console.error('Unauthorized')
          break
        case 403:
          // Handle forbidden
          // console.error('Forbidden')
          break
        case 404:
          // Handle not found
          // console.error('Not found')
          break
        case 500:
          // Handle server error
          // console.error('Server error')
          break
        default:
          // Handle other errors
          // console.error('Request failed')
          break
      }
    } else if (error.request) {
      // Request made but no response
      // console.error('No response received')
    } else {
      // Something else happened
      // console.error('Request error:', error.message)
    }

    return Promise.reject(error)
  },
)
