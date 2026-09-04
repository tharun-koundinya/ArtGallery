export type RoleName = 'ROLE_USER' | 'ROLE_ARTIST' | 'ROLE_OWNER' | string

export interface User {
  id: string
  email: string
  fullName: string
  phone?: string | null
  status?: string
  roles?: RoleName[] | Set<string>
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType?: string
  user: User
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  fullName: string
}

export interface RefreshTokenRequest {
  refreshToken: string
}
