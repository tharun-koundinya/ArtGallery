import { create } from 'zustand'

export type ToastTone = 'default' | 'error'

export interface ToastItem {
  id: string
  title: string
  tone?: ToastTone
}

interface ToastState {
  toasts: ToastItem[]
  push: (title: string, tone?: ToastTone) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push: (title, tone = 'default') => {
    const id = crypto.randomUUID()
    set((s) => ({ toasts: [...s.toasts, { id, title, tone }] }))
    window.setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 3800)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

export function toast(title: string, tone?: ToastTone) {
  useToastStore.getState().push(title, tone)
}
