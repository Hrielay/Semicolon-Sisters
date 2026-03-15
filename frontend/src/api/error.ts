import axios, { type AxiosError } from 'axios'
import type { ApiError } from './types'

/**
 * Extract error information from Axios error
 */
export function extractApiError(error: unknown): ApiError {
  const defaultError: ApiError = {
    status: 0,
    message: 'An unexpected error occurred',
  }

  if (!error) {
    return defaultError
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>

    // Network error
    if (!axiosError.response) {
      return {
        status: 0,
        message: 'Network error. Please check your connection.',
      }
    }

    const status = axiosError.response.status
    const responseData = axiosError.response.data

    // API returned error response
    if (responseData) {
      return {
        status,
        message: responseData.message || axiosError.message,
        errors: responseData.errors,
        code: responseData.code,
      }
    }

    // HTTP error without specific message
    return {
      status,
      message: getHttpErrorMessage(status),
    }
  }

  // Non-Axios error
  if (error instanceof Error) {
    return {
      status: 0,
      message: error.message,
    }
  }

  return defaultError
}

/**
 * Get human-readable error message for HTTP status codes
 */
function getHttpErrorMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Bad request',
    401: 'Unauthorized. Please log in.',
    403: 'Forbidden. You do not have permission.',
    404: 'Resource not found.',
    408: 'Request timeout. Please try again.',
    409: 'Conflict. The resource already exists.',
    422: 'Validation error. Please check your input.',
    429: 'Too many requests. Please try again later.',
    500: 'Internal server error. Please try again later.',
    502: 'Bad gateway. Please try again later.',
    503: 'Service unavailable. Please try again later.',
    504: 'Gateway timeout. Please try again later.',
  }

  return messages[status] || `Error ${status}. An unexpected error occurred.`
}

/**
 * Check if error is a specific HTTP status
 */
export function isHttpError(error: unknown, status: number): boolean {
  const apiError = extractApiError(error)
  return apiError.status === status
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  const apiError = extractApiError(error)
  return apiError.status === 0
}
