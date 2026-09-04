import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api, getErrorMessage, unwrap } from '../lib/api'
import type { ApiResponse } from '../types/api'
import type { Wishlist } from '../types/artist'
import { useAuthStore } from '../stores/authStore'
import { toast } from '../stores/toastStore'

export function useWishlist() {
  const token = useAuthStore((s) => s.accessToken)
  return useQuery({
    queryKey: ['wishlist'],
    enabled: Boolean(token),
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Wishlist>>('/wishlist')
      return unwrap(data)
    },
  })
}

export function useWishlistToggle() {
  const queryClient = useQueryClient()
  const token = useAuthStore((s) => s.accessToken)

  const add = useMutation({
    mutationFn: async (artworkId: string) => {
      const { data } = await api.post<ApiResponse<Wishlist>>(`/wishlist/${artworkId}`)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast('Added to wishlist')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not add to wishlist'), 'error'),
  })

  const remove = useMutation({
    mutationFn: async (artworkId: string) => {
      const { data } = await api.delete<ApiResponse<Wishlist>>(`/wishlist/${artworkId}`)
      return unwrap(data)
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['wishlist'] })
      toast('Removed from wishlist')
    },
    onError: (err) => toast(getErrorMessage(err, 'Could not remove from wishlist'), 'error'),
  })

  return {
    token,
    add,
    remove,
    isPending: add.isPending || remove.isPending,
  }
}
