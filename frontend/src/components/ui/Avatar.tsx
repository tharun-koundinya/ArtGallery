export function Avatar({ name, className = '' }: { name?: string | null; className?: string }) {
  const initial = (name?.trim()?.[0] ?? 'A').toUpperCase()
  return (
    <span
      className={`inline-flex h-9 w-9 items-center justify-center border border-charcoal/20 bg-ivory font-display text-lg text-charcoal ${className}`}
      aria-hidden
    >
      {initial}
    </span>
  )
}
