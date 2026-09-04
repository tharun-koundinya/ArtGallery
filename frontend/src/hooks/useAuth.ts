import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, unwrap } from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'

export function useMe() {
  const token = useAuthStore((s) => s.accessToken)
  const setUser = useAuthStore((s) => s.setUser)
  const clear = useAuthStore((s) => s.clear)

  return useQuery({
    queryKey: ['auth', 'me'],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User>>('/auth/me')
      const user = unwrap(data)
      setUser(user)
      return user
    },
    retry: false,
    meta: { onError: () => clear() },
  })
}

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: LoginRequest) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', payload)
      return unwrap(data)
    },
    onSuccess: (auth) => {
      setAuth(auth.accessToken, auth.refreshToken, auth.user)
      void queryClient.invalidateQueries()
      toast('Welcome back')
    },
    onError: (err) => toast(getErrorMessage(err, 'Unable to sign in'), 'error'),
  })
}

export function useRegister() {
  const setAuth = useAuthStore((s) => s.setAuth)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: RegisterRequest) => {
      const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', payload)
      return unwrap(data)
    },
    onSuccess: (auth) => {
      setAuth(auth.accessToken, auth.refreshToken, auth.user)
      void queryClient.invalidateQueries()
      toast('Account created')
    },
    onError: (err) => toast(getErrorMessage(err, 'Unable to register'), 'error'),
  })
}

export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken)
  const clear = useAuthStore((s) => s.clear)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout', refreshToken ? { refreshToken } : {})
    },
    onSettled: () => {
      clear()
      queryClient.clear()
      toast('Signed out')
    },
  })
}
