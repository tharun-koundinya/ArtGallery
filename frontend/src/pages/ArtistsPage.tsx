import { useArtists } from '../hooks/useArtists'
import { ArtistCard } from '../components/artist/ArtistCard'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

export function ArtistsPage() {
  const { data, isLoading, isError } = useArtists()

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">The roster</p>
      <h1 className="mt-2 font-display text-6xl">Artists</h1>
      <p className="mt-4 max-w-lg text-sm text-stone">Approved artists whose works are represented in the salon.</p>
      <div className="mt-12 divide-y divide-charcoal/10 border-y border-charcoal/10">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="my-4 h-16 w-full" />)
          : null}
        {(data ?? []).map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
      {isError ? <div className="mt-10"><EmptyState title="Unable to load artists" /></div> : null}
      {data && data.length === 0 ? <div className="mt-10"><EmptyState title="No artists yet" /></div> : null}
    </div>
  )
}
