import { Link } from 'react-router-dom'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type Variant = 'solid' | 'ghost' | 'text' | 'gold'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  to?: string
}

const styles: Record<Variant, string> = {
  solid:
    'bg-charcoal text-warm-white hover:bg-ink border border-charcoal',
  ghost:
    'bg-transparent text-charcoal border border-charcoal/20 hover:border-charcoal',
  text: 'bg-transparent text-charcoal border-0 px-0 hover:text-muted-gold',
  gold: 'bg-transparent text-muted-gold border border-muted-gold/50 hover:border-muted-gold hover:text-charcoal',
}

export function Button({ className, variant = 'solid', to, children, type = 'button', ...props }: ButtonProps) {
  const cls = cn(
    'inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 disabled:opacity-40',
    styles[variant],
    className,
  )
  if (to) {
    return (
      <Link to={to} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} className={cls} {...props}>
      {children}
    </button>
  )
}
