import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useArtworks, useCategories } from '../hooks/useArtworks'
import { ArtworkCard } from '../components/artwork/ArtworkCard'
import { ArtworkGridSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'

const MEDIUMS = ['Oil on canvas', 'Acrylic', 'Watercolor', 'Mixed media', 'Charcoal & pastel', 'Bronze', 'Oil']

export function ExplorePage() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const category = params.get('category') ?? ''
  const medium = params.get('medium') ?? ''
  const minPrice = params.get('minPrice') ? Number(params.get('minPrice')) : undefined
  const maxPrice = params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined
  const page = Number(params.get('page') ?? 0)

  const query = useMemo(
    () => ({ q: q || undefined, category: category || undefined, medium: medium || undefined, minPrice, maxPrice, page, size: 12 }),
    [q, category, medium, minPrice, maxPrice, page],
  )

  const artworks = useArtworks(query)
  const categories = useCategories()

  function patch(next: Record<string, string | undefined>) {
    const copy = new URLSearchParams(params)
    Object.entries(next).forEach(([k, v]) => {
      if (!v) copy.delete(k)
      else copy.set(k, v)
    })
    if (!('page' in next)) copy.set('page', '0')
    setParams(copy)
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">The collection</p>
      <h1 className="mt-2 font-display text-6xl">Explore</h1>
      <p className="mt-4 max-w-xl text-sm text-stone">Search by title, filter by category and medium, or set a price range.</p>

      <form
        className="mt-10 grid gap-6 border-y border-charcoal/10 py-8 md:grid-cols-5"
        onSubmit={(e) => {
          e.preventDefault()
          const fd = new FormData(e.currentTarget)
          patch({
            q: String(fd.get('q') || '') || undefined,
            minPrice: String(fd.get('minPrice') || '') || undefined,
            maxPrice: String(fd.get('maxPrice') || '') || undefined,
          })
        }}
      >
        <Input name="q" defaultValue={q} placeholder="Search works" label="Search" />
        <Select label="Category" value={category} onChange={(e) => patch({ category: e.target.value || undefined })}>
          <option value="">All</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.id} value={c.slug || c.name}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select label="Medium" value={medium} onChange={(e) => patch({ medium: e.target.value || undefined })}>
          <option value="">All</option>
          {MEDIUMS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
        <Input name="minPrice" type="number" defaultValue={minPrice ?? ''} label="Min ₹" />
        <div className="flex items-end gap-3">
          <Input name="maxPrice" type="number" defaultValue={maxPrice ?? ''} label="Max ₹" />
          <Button type="submit" variant="ghost" className="mb-1 px-4">
            Apply
          </Button>
        </div>
      </form>

      <div className="mt-12">
        {artworks.isLoading ? <ArtworkGridSkeleton count={9} /> : null}
        {artworks.isError ? (
          <EmptyState title="The collection is unavailable" body="Please confirm the API is running on port 8080." />
        ) : null}
        {artworks.data && artworks.data.content.length === 0 && !artworks.isLoading ? (
          <EmptyState title="No works match" body="Adjust filters or clear search to see the full salon." />
        ) : null}
        {artworks.data && artworks.data.content.length > 0 ? (
          <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {artworks.data.content.map((work) => (
              <ArtworkCard key={work.id} artwork={work} />
            ))}
          </div>
        ) : null}
        <Pagination
          page={artworks.data?.page ?? page}
          totalPages={artworks.data?.totalPages ?? 0}
          onChange={(p) => patch({ page: String(p) })}
        />
      </div>
    </div>
  )
}
