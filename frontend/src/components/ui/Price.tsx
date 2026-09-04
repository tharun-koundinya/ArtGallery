import { formatInr } from '../../lib/format'

export function Price({
  value,
  currency = 'INR',
  className = '',
}: {
  value?: number | string | null
  currency?: string | null
  className?: string
}) {
  return (
    <span className={`font-display text-2xl tracking-wide text-ink ${className}`}>
      {formatInr(value, currency ?? 'INR')}
    </span>
  )
}
