import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, unwrap } from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { Artist, ArtistApplyRequest, ArtistApplication, ArtistProfileUpdateRequest } from '../types/artist'
import type { Artwork } from '../types/artwork'
import { toast } from '../stores/toastStore'
import { useAuthStore } from '../stores/authStore'

export function useArtists() {
  return useQuery({
    queryKey: ['artists'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Artist[]>>('/artists')
      return unwrap(data) ?? []
    },
  })
}

export function useArtist(id?: string) {
  return useQuery({
    queryKey: ['artist', id],
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Artist>>(`/artists/${id}`)
      return unwrap(data)
    },
  })
}

export function useMyArtistProfile() {
  const token = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: ['artists', 'me'],
    enabled: Boolean(token),
    retry: false,
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Artist>>('/artists/me')
      return unwrap(data)
    },
  })
}

export function useMyArtworks() {
  return useQuery({
    queryKey: ['studio', 'artworks'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Artwork[]>>('/artists/me/artworks')
      return unwrap(data) ?? []
    },
  })
}

export function useApplyArtist() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ArtistApplyRequest) => {
      const { data } = await api.post<ApiResponse<ArtistApplication>>('/artists/apply', payload)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['artists'] })
      toast('Application received')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not submit application'), 'error'),
  })
}

export function useUpdateArtistProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ArtistProfileUpdateRequest) => {
      const { data } = await api.put<ApiResponse<Artist>>('/artists/me', payload)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['artists', 'me'] })
      toast('Profile updated')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not update profile'), 'error'),
  })
}
