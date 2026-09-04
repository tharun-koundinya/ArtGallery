import { useParams } from 'react-router-dom'
import { useArtist } from '../hooks/useArtists'
import { useArtworks } from '../hooks/useArtworks'
import { ArtworkCard } from '../components/artwork/ArtworkCard'
import { ArtworkGridSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Avatar } from '../components/ui/Avatar'

export function ArtistDetailPage() {
  const { id } = useParams()
  const artist = useArtist(id)
  const works = useArtworks({ artistId: id, size: 24 })

  if (artist.isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ArtworkGridSkeleton count={3} />
      </div>
    )
  }
  if (artist.isError || !artist.data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState title="Artist not found" />
      </div>
    )
  }

  const a = artist.data
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="flex flex-col gap-8 border-b border-charcoal/10 pb-12 md:flex-row md:items-end md:justify-between">
        <div className="flex items-start gap-6">
          <Avatar name={a.displayName} className="h-16 w-16 text-2xl" />
          <div>
            <p className="text-[11px] tracking-[0.22em] uppercase text-muted-gold">{a.country || 'Artist'}</p>
            <h1 className="mt-2 font-display text-6xl">{a.displayName}</h1>
            {a.yearsExperience ? (
              <p className="mt-3 text-sm text-stone">{a.yearsExperience} years in practice</p>
            ) : null}
          </div>
        </div>
        <div className="max-w-xl text-sm leading-relaxed text-stone">{a.bio}</div>
      </div>
      <h2 className="mt-14 font-display text-4xl">Works</h2>
      <div className="mt-8">
        {works.isLoading ? <ArtworkGridSkeleton /> : null}
        {works.data && works.data.content.length === 0 ? <EmptyState title="No published works yet" /> : null}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {(works.data?.content ?? []).map((work) => (
            <ArtworkCard key={work.id} artwork={work} />
          ))}
        </div>
      </div>
    </div>
  )
}
