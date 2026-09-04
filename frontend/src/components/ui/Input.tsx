import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone">{label}</span>
      ) : null}
      <input
        id={inputId}
        className={cn(
          'w-full bg-transparent border-0 border-b border-charcoal/20 px-0 py-2.5 text-[15px] text-charcoal outline-none transition-colors placeholder:text-stone/70 focus:border-muted-gold',
          error && 'border-burgundy',
          className,
        )}
        {...props}
      />
      {error ? <span className="block text-xs text-burgundy">{error}</span> : null}
    </label>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function TextArea({ label, error, className, ...props }: TextAreaProps) {
  return (
    <label className="block space-y-2">
      {label ? (
        <span className="text-[11px] tracking-[0.2em] uppercase text-stone">{label}</span>
      ) : null}
      <textarea
        className={cn(
          'w-full min-h-28 bg-transparent border border-charcoal/15 px-3 py-3 text-[15px] text-charcoal outline-none transition-colors placeholder:text-stone/70 focus:border-muted-gold',
          error && 'border-burgundy',
          className,
        )}
        {...props}
      />
      {error ? <span className="block text-xs text-burgundy">{error}</span> : null}
    </label>
  )
}
