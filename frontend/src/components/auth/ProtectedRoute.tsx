import { useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore, useSession } from '../../stores/authStore'
import { hasRole } from '../../lib/format'

export function ProtectedRoute({
  children,
  roles,
}: {
  children: ReactNode
  roles?: string[]
}) {
  const { isAuthenticated, user } = useSession()
  const location = useLocation()
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated())

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true))
    if (useAuthStore.persist.hasHydrated()) setHydrated(true)
    return unsub
  }, [])

  if (!hydrated) {
    return <div className="px-6 py-24 text-center text-sm text-stone">Loading</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles?.length && user && !roles.some((role) => hasRole(user.roles, role))) {
    return <Navigate to="/" replace />
  }

  return children
}
