import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, unwrap } from '../lib/api'
import type { ApiResponse, PageResponse } from '../types/api'
import type {
  Artwork,
  ArtworkCreateRequest,
  ArtworkSearchParams,
  ArtworkUpdateRequest,
  Category,
  MediaUpload,
} from '../types/artwork'
import { toast } from '../stores/toastStore'

function cleanParams(params: ArtworkSearchParams) {
  const out: Record<string, string | number> = {}
  if (params.q) out.q = params.q
  if (params.category) out.category = params.category
  if (params.medium) out.medium = params.medium
  if (params.minPrice != null) out.minPrice = params.minPrice
  if (params.maxPrice != null) out.maxPrice = params.maxPrice
  if (params.artistId) out.artistId = params.artistId
  if (params.sort) out.sort = params.sort
  out.page = params.page ?? 0
  out.size = params.size ?? 12
  return out
}

export function useArtworks(params: ArtworkSearchParams) {
  return useQuery({
    queryKey: ['artworks', params],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<PageResponse<Artwork>>>('/artworks', {
        params: cleanParams(params),
      })
      return (
        unwrap(data) ?? {
          content: [],
          page: 0,
          size: 12,
          totalElements: 0,
          totalPages: 0,
        }
      )
    },
  })
}

export function useArtwork(idOrSlug?: string) {
  return useQuery({
    queryKey: ['artwork', idOrSlug],
    enabled: Boolean(idOrSlug),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Artwork>>(`/artworks/${idOrSlug}`)
      return unwrap(data)
    },
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Category[]>>('/categories')
      return unwrap(data) ?? []
    },
  })
}

export function useCreateArtwork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: ArtworkCreateRequest) => {
      const { data } = await api.post<ApiResponse<Artwork>>('/artworks', payload)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio'] })
      toast('Artwork saved as draft')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not create artwork'), 'error'),
  })
}

export function useUpdateArtwork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: ArtworkUpdateRequest }) => {
      const { data } = await api.put<ApiResponse<Artwork>>(`/artworks/${id}`, payload)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio'] })
      toast('Artwork updated')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not update artwork'), 'error'),
  })
}

export function useSubmitArtwork() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post<ApiResponse<Artwork>>(`/artworks/${id}/submit`)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio'] })
      toast('Submitted for review')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not submit'), 'error'),
  })
}

export function useUploadMedia() {
  return useMutation({
    mutationFn: async (file: File) => {
      const form = new FormData()
      form.append('file', file)
      const { data } = await api.post<ApiResponse<MediaUpload>>('/media/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      return unwrap(data)
    },
    onError: (err) => toast(getErrorMessage(err, 'Upload failed'), 'error'),
  })
}

export function useAttachImages() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, storageKeys, primaryKey }: { id: string; storageKeys: string[]; primaryKey?: string }) => {
      const { data } = await api.post<ApiResponse<Artwork>>(`/artworks/${id}/images`, {
        storageKeys,
        primaryKey,
      })
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['studio'] })
      toast('Image attached')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not attach image'), 'error'),
  })
}
