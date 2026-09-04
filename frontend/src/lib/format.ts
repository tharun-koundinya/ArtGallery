export function formatInr(value?: number | string | null, currency = 'INR') {
  const amount = typeof value === 'string' ? Number(value) : (value ?? 0)
  if (!Number.isFinite(amount)) return '—'
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`
  }
}

export function formatDimensions(
  width?: number | string | null,
  height?: number | string | null,
  depth?: number | string | null,
) {
  const w = width != null && width !== '' ? `${width}` : null
  const h = height != null && height !== '' ? `${height}` : null
  const d = depth != null && depth !== '' ? `${depth}` : null
  if (!w && !h) return null
  const base = [h, w].filter(Boolean).join(' × ')
  return d ? `${base} × ${d} cm` : `${base} cm`
}

export function userRoles(roles?: string[] | Set<string> | null): string[] {
  if (!roles) return []
  if (Array.isArray(roles)) return roles
  return Array.from(roles)
}

export function hasRole(roles: string[] | Set<string> | undefined, role: string) {
  const list = userRoles(roles)
  const needle = role.toUpperCase()
  return list.some((r) => {
    const v = r.toUpperCase()
    return v === needle || v === `ROLE_${needle}` || v.replace('ROLE_', '') === needle.replace('ROLE_', '')
  })
}

export function isArtist(roles?: string[] | Set<string>) {
  return hasRole(roles, 'ARTIST')
}

export function isOwner(roles?: string[] | Set<string>) {
  return hasRole(roles, 'OWNER')
}
