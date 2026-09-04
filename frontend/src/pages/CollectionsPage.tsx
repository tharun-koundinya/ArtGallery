import { ArtworkCard } from '../components/artwork/ArtworkCard'
import { useArtworks, useCategories } from '../hooks/useArtworks'
import { EmptyState } from '../components/ui/EmptyState'
import { Link } from 'react-router-dom'

export function CollectionsPage() {
  const categories = useCategories()
  const artworks = useArtworks({ size: 24, sort: 'newest' })
  const works = artworks.data?.content ?? []

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Departments</p>
      <h1 className="mt-2 font-display text-6xl">Collections</h1>
      <p className="mt-4 max-w-xl text-sm text-stone">Works grouped by salon category — landscape, abstract, portrait, and more.</p>
      {categories.isError ? <div className="mt-10"><EmptyState title="Collections unavailable" /></div> : null}
      <div className="mt-16 space-y-20">
        {(categories.data ?? []).map((cat) => {
          const subset = works.filter(
            (w) => w.categoryId === cat.id || w.categoryName === cat.name,
          )
          return (
            <section key={cat.id}>
              <div className="mb-8 flex items-end justify-between">
                <div>
                  <h2 className="font-display text-4xl">{cat.name}</h2>
                  {cat.description ? <p className="mt-2 text-sm text-stone">{cat.description}</p> : null}
                </div>
                <Link
                  to={`/artworks?category=${encodeURIComponent(cat.slug || cat.name)}`}
                  className="text-[11px] tracking-[0.18em] uppercase text-stone"
                >
                  View department
                </Link>
              </div>
              {subset.length === 0 ? (
                <p className="text-sm text-stone">No published works in this department yet.</p>
              ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {subset.slice(0, 3).map((work) => (
                    <ArtworkCard key={work.id} artwork={work} />
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
