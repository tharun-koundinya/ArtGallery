import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse } from '../types/api'
import { useAuthStore } from '../stores/authStore'

export const API_BASE = 'http://localhost:8081/api/v1'

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
})

let refreshing: Promise<string | null> | null = null

function isAuthPath(url?: string) {
  if (!url) return false
  return /\/auth\/(login|register|refresh)/.test(url)
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined
    const status = error.response?.status

    if (status === 401 && original && !original._retry && !isAuthPath(original.url)) {
      original._retry = true
      const nextToken = await refreshAccessToken()
      if (nextToken) {
        original.headers.Authorization = `Bearer ${nextToken}`
        return api(original)
      }
      useAuthStore.getState().clear()
    }

    return Promise.reject(error)
  },
)

async function refreshAccessToken(): Promise<string | null> {
  if (!refreshing) {
    refreshing = (async () => {
      const refreshToken = useAuthStore.getState().refreshToken
      if (!refreshToken) return null
      try {
        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string; user?: unknown }>>(
          `${API_BASE}/auth/refresh`,
          { refreshToken },
        )
        const payload = data.data
        if (!payload?.accessToken) return null
        useAuthStore.getState().setTokens(payload.accessToken, payload.refreshToken ?? refreshToken)
        return payload.accessToken
      } catch {
        return null
      } finally {
        refreshing = null
      }
    })()
  }
  return refreshing
}

export function unwrap<T>(envelope: ApiResponse<T> | undefined): T {
  if (envelope && Object.prototype.hasOwnProperty.call(envelope, 'data')) {
    return envelope.data as T
  }
  throw new Error(envelope?.message || 'Empty response')
}

export function getErrorMessage(err: unknown, fallback = 'Something went wrong') {
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ApiResponse<unknown> | undefined
    if (body?.message) return body.message
    const nested = (body?.data as { message?: string } | undefined)?.message
    if (nested) return nested
    if (err.message) return err.message
  }
  if (err instanceof Error && err.message) return err.message
  return fallback
}
