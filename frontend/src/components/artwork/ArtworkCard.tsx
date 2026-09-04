import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Artwork } from '../../types/artwork'
import { artworkSrc } from '../../lib/media'
import { Price } from '../ui/Price'

export function ArtworkCard({ artwork }: { artwork: Artwork }) {
  const href = `/artworks/${artwork.slug || artwork.id}`
  return (
    <Link to={href} className="group block">
      <div className="overflow-hidden border border-charcoal/10 bg-warm-white">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="aspect-[3/4] overflow-hidden"
        >
          <img
            src={artworkSrc(artwork, true)}
            alt={artwork.title}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
          />
        </motion.div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-[1.45rem] leading-tight group-hover:text-muted-gold">{artwork.title}</h3>
          <p className="mt-1 text-xs tracking-[0.12em] text-stone uppercase">{artwork.artistName}</p>
        </div>
        <Price value={artwork.price} currency={artwork.currency} className="text-xl" />
      </div>
    </Link>
  )
}
