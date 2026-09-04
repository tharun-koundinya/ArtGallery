import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
}

export function Select({ label, error, className, children, ...props }: SelectProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone">{label}</span>
      ) : null}
      <select
        className={cn(
          'w-full bg-transparent border-0 border-b border-charcoal/20 px-0 py-2.5 text-[14px] text-charcoal outline-none focus:border-muted-gold',
          error && 'border-burgundy',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="block text-xs text-burgundy">{error}</span> : null}
    </label>
  )
}
