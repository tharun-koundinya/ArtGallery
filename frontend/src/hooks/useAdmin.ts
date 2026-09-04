import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, unwrap } from '../lib/api'
import type { ApiResponse, PageResponse } from '../types/api'
import type { DashboardStats } from '../types/admin'
import type { ArtistApplication } from '../types/artist'
import type { Artwork } from '../types/artwork'
import type { User } from '../types/auth'
import { toast } from '../stores/toastStore'

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats')
      return unwrap(data)
    },
  })
}

export function useAdminApplications(status?: string) {
  return useQuery({
    queryKey: ['admin', 'applications', status],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<ArtistApplication[]>>('/admin/applications', {
        params: status ? { status } : undefined,
      })
      return unwrap(data) ?? []
    },
  })
}

export function useAdminArtworks(status?: string, page = 0) {
  return useQuery({
    queryKey: ['admin', 'artworks', status, page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<Artwork>>>('/admin/artworks', {
        params: { ...(status ? { status } : {}), page, size: 20 },
      })
      return unwrap(data)
    },
  })
}

export function useAdminUsers(page = 0) {
  return useQuery({
    queryKey: ['admin', 'users', page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<User>>>('/admin/users', {
        params: { page, size: 20 },
      })
      return unwrap(data)
    },
  })
}

export function useApproveApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<ArtistApplication>>(`/admin/applications/${id}/approve`)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast('Application approved')
    },
    onError: (err) => toast(getErrorMessage(err, 'Approve failed'), 'error'),
  })
}

export function useRejectApplication() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.post<ApiResponse<ArtistApplication>>(`/admin/applications/${id}/reject`, { reason })
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast('Application rejected')
    },
    onError: (err) => toast(getErrorMessage(err, 'Reject failed'), 'error'),
  })
}

export function usePublishArtwork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<Artwork>>(`/admin/artworks/${id}/publish`)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast('Artwork published')
    },
    onError: (err) => toast(getErrorMessage(err, 'Publish failed'), 'error'),
  })
}

export function useRejectArtwork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      const { data } = await api.post<ApiResponse<Artwork>>(`/admin/artworks/${id}/reject`, { reason })
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast('Artwork rejected')
    },
    onError: (err) => toast(getErrorMessage(err, 'Reject failed'), 'error'),
  })
}
