import { cn } from '../../lib/cn'

export function Badge({ children, className }: { children: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-block border border-charcoal/15 px-2 py-0.5 text-[10px] tracking-[0.18em] uppercase text-stone',
        className,
      )}
    >
      {children}
    </span>
  )
}
