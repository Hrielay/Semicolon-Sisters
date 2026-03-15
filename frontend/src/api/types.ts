/**
 * Common API response types
 */

/**
 * Standard API response wrapper for paginated data
 */
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * Standard API response wrapper for single item
 */
export interface ApiResponse<T> {
  data: T
  message?: string
}

/**
 * Error response from API
 */
export interface ApiError {
  status: number
  message: string
  errors?: Record<string, string[]>
  code?: string
}

/**
 * Query parameters for pagination
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
