import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-ink/45"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-lg border border-charcoal/15 bg-warm-white p-8 shadow-[0_1px_0_rgba(26,26,26,0.04)]"
      >
        <div className="mb-6 flex items-start justify-between gap-6">
          <h3 className="font-display text-3xl">{title}</h3>
          <button type="button" onClick={onClose} className="text-[11px] tracking-[0.2em] uppercase text-stone">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
