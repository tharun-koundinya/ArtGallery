import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Menu, User, X } from 'lucide-react'
import { useSession } from '../../stores/authStore'
import { useLogout } from '../../hooks/useAuth'
import { cn } from '../../lib/cn'

const links = [
  { to: '/artworks', label: 'Explore' },
  { to: '/artists', label: 'Artists' },
  { to: '/collections', label: 'Collections' },
]

export function Navbar() {
  const { isAuthenticated, isArtist, isOwner, user } = useSession()
  const logout = useLogout()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-ivory/85 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-6">
        <Link to="/" className="font-display text-[1.85rem] tracking-[0.08em] text-ink">
          ArtGallery
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  'relative py-1 text-[11px] tracking-[0.22em] uppercase text-stone hover:text-charcoal',
                  isActive && 'text-charcoal',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute inset-x-0 -bottom-1 h-px bg-muted-gold"
                    />
                  ) : null}
                </>
              )}
            </NavLink>
          ))}
          {isArtist ? (
            <NavLink to="/studio" className="text-[11px] tracking-[0.22em] uppercase text-stone hover:text-charcoal">
              Studio
            </NavLink>
          ) : null}
          {isOwner ? (
            <NavLink to="/admin" className="text-[11px] tracking-[0.22em] uppercase text-stone hover:text-charcoal">
              Admin
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/wishlist" aria-label="Wishlist" className="text-charcoal hover:text-muted-gold">
            <Heart size={18} strokeWidth={1.4} />
          </Link>
          <div className="relative">
            <button
              type="button"
              aria-label="Account"
              onClick={() => setAccountOpen((v) => !v)}
              className="flex items-center gap-2 text-charcoal hover:text-muted-gold"
            >
              <User size={18} strokeWidth={1.4} />
              <span className="hidden text-[11px] tracking-[0.16em] uppercase sm:inline">
                {user?.fullName?.split(' ')[0] ?? 'Account'}
              </span>
            </button>
            {accountOpen ? (
              <div className="absolute right-0 mt-3 w-56 border border-charcoal/12 bg-warm-white p-4 text-sm">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <p className="font-display text-xl">{user?.fullName}</p>
                    {!isArtist ? (
                      <Link to="/apply" className="block text-[11px] tracking-[0.16em] uppercase text-stone" onClick={() => setAccountOpen(false)}>
                        Apply as artist
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="text-[11px] tracking-[0.16em] uppercase text-burgundy"
                      onClick={() => {
                        setAccountOpen(false)
                        logout.mutate(undefined, { onSettled: () => navigate('/') })
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link to="/login" className="block text-[11px] tracking-[0.16em] uppercase" onClick={() => setAccountOpen(false)}>
                      Sign in
                    </Link>
                    <Link to="/register" className="block text-[11px] tracking-[0.16em] uppercase text-stone" onClick={() => setAccountOpen(false)}>
                      Register
                    </Link>
                  </div>
                )}
              </div>
            ) : null}
          </div>
          <button type="button" className="md:hidden" aria-label="Menu" onClick={() => setOpen((v) => !v)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-charcoal/10 px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="text-[12px] tracking-[0.2em] uppercase">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  )
}
