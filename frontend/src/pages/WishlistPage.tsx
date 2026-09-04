import { useWishlist, useWishlistToggle } from '../hooks/useWishlist'
import { ArtworkCard } from '../components/artwork/ArtworkCard'
import { ArtworkGridSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'

export function WishlistPage() {
  const { data, isLoading, isError } = useWishlist()
  const toggle = useWishlistToggle()
  const items = data?.items ?? []

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Private</p>
      <h1 className="mt-2 font-display text-6xl">Wishlist</h1>
      <div className="mt-12">
        {isLoading ? <ArtworkGridSkeleton /> : null}
        {isError ? <EmptyState title="Wishlist unavailable" /> : null}
        {!isLoading && items.length === 0 ? (
          <EmptyState title="Nothing saved" body="Reserve works from the collection to revisit them here." />
        ) : null}
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id}>
              <ArtworkCard artwork={item.artwork} />
              <Button variant="text" className="mt-2" onClick={() => toggle.remove.mutate(item.artwork.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
