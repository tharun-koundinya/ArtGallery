import type { Artwork, ArtworkImage } from '../types/artwork'

const FALLBACK =
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=1600&q=80'

export function resolveMediaUrl(url?: string | null, storageKey?: string | null) {
  if (url && /^https?:\/\//i.test(url)) return url
  if (url && url.startsWith('/')) return url
  if (storageKey) return `/api/v1/media/${storageKey}`
  if (url) return url
  return FALLBACK
}

export function primaryImage(artwork?: Artwork | null): ArtworkImage | undefined {
  const images = artwork?.images ?? []
  return images.find((img) => img.primary) ?? images[0]
}

export function artworkSrc(artwork?: Artwork | null, preferThumb = false) {
  const img = primaryImage(artwork)
  const preferred = preferThumb ? img?.thumbnailUrl || img?.originalUrl : img?.originalUrl || img?.thumbnailUrl
  return resolveMediaUrl(preferred, img?.storageKey)
}

export { FALLBACK as FALLBACK_ARTWORK_IMAGE }
