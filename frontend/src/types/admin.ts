export interface DashboardStats {
  users?: number
  artists?: number
  artworks?: number
  publishedArtworks?: number
  pendingApplications?: number
  pendingArtworks?: number
}

export interface RejectRequest {
  reason: string
}
