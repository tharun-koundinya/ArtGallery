import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useArtworks } from '../hooks/useArtworks'
import { useArtists } from '../hooks/useArtists'
import { ArtworkCard } from '../components/artwork/ArtworkCard'
import { ArtistCard } from '../components/artist/ArtistCard'
import { ArtworkGridSkeleton } from '../components/ui/Skeleton'
import { EmptyState } from '../components/ui/EmptyState'
import { Button } from '../components/ui/Button'
import { artworkSrc, FALLBACK_ARTWORK_IMAGE } from '../lib/media'

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' as const } },
}

export function HomePage() {
  const featured = useArtworks({ page: 0, size: 6, sort: 'newest' })
  const artists = useArtists()
  const heroWork = featured.data?.content?.[0]
  const heroSrc = heroWork ? artworkSrc(heroWork) : FALLBACK_ARTWORK_IMAGE

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <motion.img
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          src={heroSrc}
          alt={heroWork?.title ?? 'Featured artwork'}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/40 to-transparent" />
        <div className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col justify-end px-6 pb-20 pt-32 text-warm-white">
          <motion.div variants={fadeUp} initial="hidden" animate="show" className="max-w-3xl">
            <p className="font-display text-6xl leading-none tracking-[0.12em] sm:text-8xl">ArtGallery</p>
            <h1 className="mt-8 font-display text-3xl leading-tight sm:text-5xl">
              TIMELESS ART. ENDLESS INSPIRATION.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-warm-white/80">
              An editorial house for collectors. Original paintings and sculpture, presented with quiet ceremony.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button to="/artworks" className="border-warm-white bg-warm-white text-ink hover:bg-transparent hover:text-warm-white">
                Explore
              </Button>
              <Button to="/artists" variant="gold" className="border-warm-white/50 text-warm-white hover:border-gold-light">
                Artists
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Selected works</p>
            <h2 className="mt-2 font-display text-5xl">Featured artworks</h2>
          </div>
          <Link to="/artworks" className="text-[11px] tracking-[0.2em] uppercase text-stone hover:text-charcoal">
            View all
          </Link>
        </div>
        {featured.isLoading ? <ArtworkGridSkeleton /> : null}
        {featured.isError ? (
          <EmptyState title="Unable to load works" body="The gallery could not reach the collection. Please try again." />
        ) : null}
        {featured.data && featured.data.content.length === 0 ? (
          <EmptyState title="The salon is being prepared" body="Published works will appear here." />
        ) : null}
        {featured.data && featured.data.content.length > 0 ? (
          <div className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featured.data.content.map((work) => (
              <ArtworkCard key={work.id} artwork={work} />
            ))}
          </div>
        ) : null}
      </section>

      <section className="border-y border-charcoal/10 bg-warm-white/50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="font-display text-4xl">Featured artists</h2>
            <Link to="/artists" className="text-[11px] tracking-[0.2em] uppercase text-stone">
              The roster
            </Link>
          </div>
          <div className="flex gap-10 overflow-x-auto pb-2">
            {(artists.data ?? []).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
            {artists.isError ? <p className="text-sm text-stone">Artists could not be loaded.</p> : null}
          </div>
        </div>
      </section>
    </div>
  )
}
