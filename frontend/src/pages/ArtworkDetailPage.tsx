import { Link, useNavigate, useParams } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useArtwork } from '../hooks/useArtworks'
import { useWishlist, useWishlistToggle } from '../hooks/useWishlist'
import { ArtworkGridSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Price } from '../components/ui/Price'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { artworkSrc } from '../lib/media'
import { formatDimensions } from '../lib/format'

export function ArtworkDetailPage() {
  const { idOrSlug } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError } = useArtwork(idOrSlug)
  const wishlist = useWishlist()
  const toggle = useWishlistToggle()
  const inWishlist = Boolean(wishlist.data?.items?.some((item) => item.artwork?.id === data?.id))

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-16">
        <ArtworkGridSkeleton count={2} />
      </div>
    )
  }
  if (isError || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <EmptyState title="Work not found" body="This piece may be private or no longer available." />
      </div>
    )
  }

  const dims = formatDimensions(data.widthCm, data.heightCm, data.depthCm)

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="overflow-hidden border border-charcoal/10 bg-warm-white">
            <img src={artworkSrc(data)} alt={data.title} className="w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-5 lg:sticky lg:top-28">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-gold">{data.categoryName || data.medium}</p>
          <h1 className="mt-3 font-display text-5xl leading-tight">{data.title}</h1>
          {data.artistId ? (
            <Link to={`/artists/${data.artistId}`} className="mt-4 inline-block text-sm tracking-[0.12em] uppercase text-stone hover:text-charcoal">
              {data.artistName}
            </Link>
          ) : (
            <p className="mt-4 text-sm tracking-[0.12em] uppercase text-stone">{data.artistName}</p>
          )}
          <div className="mt-8">
            <Price value={data.price} currency={data.currency} className="text-4xl" />
          </div>
          <dl className="mt-8 space-y-3 border-y border-charcoal/10 py-6 text-sm">
            {data.medium ? (
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Medium</dt>
                <dd>{data.medium}</dd>
              </div>
            ) : null}
            {dims ? (
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Dimensions</dt>
                <dd>{dims}</dd>
              </div>
            ) : null}
            {data.yearCreated ? (
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Year</dt>
                <dd>{data.yearCreated}</dd>
              </div>
            ) : null}
            {data.status ? (
              <div className="flex justify-between gap-6">
                <dt className="text-stone">Status</dt>
                <dd>
                  <Badge>{data.status.replaceAll('_', ' ')}</Badge>
                </dd>
              </div>
            ) : null}
          </dl>
          <div className="mt-8 flex gap-3">
            <Button
              variant={inWishlist ? 'gold' : 'ghost'}
              onClick={() => {
                if (!toggle.token) {
                  navigate('/login', { state: { from: `/artworks/${idOrSlug}` } })
                  return
                }
                if (inWishlist) toggle.remove.mutate(data.id)
                else toggle.add.mutate(data.id)
              }}
            >
              <Heart size={16} strokeWidth={1.4} fill={inWishlist ? 'currentColor' : 'none'} />
              {inWishlist ? 'In wishlist' : 'Save to wishlist'}
            </Button>
          </div>
        </div>
      </div>

      {(data.story || data.description) && (
        <section className="mx-auto mt-20 max-w-3xl">
          <p className="text-[11px] tracking-[0.22em] uppercase text-muted-gold">Story</p>
          <p className="mt-5 font-display text-3xl leading-snug">{data.story || data.description}</p>
          {data.story && data.description ? <p className="mt-6 text-sm leading-relaxed text-stone">{data.description}</p> : null}
        </section>
      )}
    </div>
  )
}
