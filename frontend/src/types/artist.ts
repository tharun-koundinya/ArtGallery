import type { Artwork } from './artwork'

export interface Artist {
  id: string
  userId?: string
  displayName: string
  bio?: string | null
  website?: string | null
  instagram?: string | null
  country?: string | null
  yearsExperience?: number | null
  status?: string
  approvedAt?: string | null
  createdAt?: string
}

export interface ArtistApplyRequest {
  displayName: string
  biography?: string
  portfolioUrl?: string
  website?: string
  instagram?: string
  yearsExperience?: number
  country?: string
  phone?: string
}

export interface ArtistApplication {
  id: string
  userId?: string
  status?: string
  biography?: string | null
  portfolioUrl?: string | null
  website?: string | null
  instagram?: string | null
  yearsExperience?: number | null
  country?: string | null
  phone?: string | null
  rejectionReason?: string | null
  reviewedAt?: string | null
  createdAt?: string
  displayName?: string
  email?: string
}

export interface ArtistProfileUpdateRequest {
  displayName?: string
  bio?: string
  website?: string
  instagram?: string
  country?: string
  yearsExperience?: number
}

export interface WishlistItem {
  id: string
  createdAt?: string
  artwork: Artwork
}

export interface Wishlist {
  id: string
  items?: WishlistItem[]
}
