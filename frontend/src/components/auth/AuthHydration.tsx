import { useMe } from '../../hooks/useAuth'

export function AuthHydration() {
  useMe()
  return null
}
