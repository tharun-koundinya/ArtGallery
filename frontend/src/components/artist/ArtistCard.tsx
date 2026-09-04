import { Link } from 'react-router-dom'
import type { Artist } from '../../types/artist'
import { Avatar } from '../ui/Avatar'

export function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link
      to={`/artists/${artist.id}`}
      className="group flex min-w-[220px] items-center gap-4 border-b border-transparent py-3 transition-colors hover:border-charcoal/20"
    >
      <Avatar name={artist.displayName} className="h-12 w-12" />
      <div>
        <p className="font-display text-2xl leading-none group-hover:text-muted-gold">{artist.displayName}</p>
        <p className="mt-1 text-[11px] tracking-[0.16em] uppercase text-stone">
          {artist.country || 'Artist'}
          {artist.yearsExperience ? ` · ${artist.yearsExperience} yrs` : ''}
        </p>
      </div>
    </Link>
  )
}
