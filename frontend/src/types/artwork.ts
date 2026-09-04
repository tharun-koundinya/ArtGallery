export interface ArtworkImage {
  id?: string
  storageKey?: string
  originalUrl?: string | null
  thumbnailUrl?: string | null
  mimeType?: string
  width?: number
  height?: number
  sizeBytes?: number
  primary?: boolean
  sortOrder?: number
}

export interface Artwork {
  id: string
  artistId?: string
  artistName?: string
  title: string
  slug?: string
  description?: string | null
  story?: string | null
  medium?: string | null
  style?: string | null
  yearCreated?: number | null
  widthCm?: number | string | null
  heightCm?: number | string | null
  depthCm?: number | string | null
  price?: number | string | null
  currency?: string | null
  quantity?: number | null
  status?: string
  categoryId?: string | null
  categoryName?: string | null
  viewCount?: number
  createdAt?: string
  updatedAt?: string
  images?: ArtworkImage[]
}

export interface ArtworkCreateRequest {
  title: string
  description?: string
  story?: string
  medium?: string
  style?: string
  yearCreated?: number
  widthCm?: number
  heightCm?: number
  depthCm?: number
  price: number
  currency?: string
  quantity?: number
  categoryId?: string
}

export interface ArtworkUpdateRequest extends Partial<ArtworkCreateRequest> {}

export interface AttachImagesRequest {
  storageKeys: string[]
  primaryKey?: string
}

export interface ArtworkSearchParams {
  q?: string
  category?: string
  medium?: string
  minPrice?: number
  maxPrice?: number
  artistId?: string
  sort?: string
  page?: number
  size?: number
}

export interface Category {
  id: string
  name: string
  slug?: string
  description?: string | null
  parentId?: string | null
}

export interface MediaUpload {
  storageKey: string
  originalUrl?: string
  thumbnailUrl?: string
  mimeType?: string
  sizeBytes?: number
}
