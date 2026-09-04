import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">ArtGallery</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone">
            A private salon for collectors. Paintings, sculpture, and contemporary works presented with editorial care.
          </p>
        </div>
        <div className="text-sm text-stone">
          <p className="text-[11px] tracking-[0.2em] uppercase text-charcoal">Visit</p>
          <p className="mt-3">By appointment</p>
          <p>Mumbai · New Delhi</p>
        </div>
        <div className="flex flex-col gap-2 text-[11px] tracking-[0.18em] uppercase text-stone">
          <Link to="/artworks">Explore</Link>
          <Link to="/artists">Artists</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/apply">Apply as artist</Link>
        </div>
      </div>
      <div className="border-t border-charcoal/10 py-5 text-center text-[11px] tracking-[0.16em] uppercase text-stone">
        © {new Date().getFullYear()} ArtGallery
      </div>
    </footer>
  )
}
