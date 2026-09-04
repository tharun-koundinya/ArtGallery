export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  timestamp?: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  first?: boolean
  last?: boolean
}

export interface ApiErrorBody {
  timestamp?: string
  status?: number
  error?: string
  message?: string
  path?: string
  fieldErrors?: { field?: string; message?: string }[]
}
