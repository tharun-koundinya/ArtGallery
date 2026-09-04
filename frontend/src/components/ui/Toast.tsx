import { AnimatePresence, motion } from 'framer-motion'
import { useToastStore } from '../../stores/toastStore'

export function Toast() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex w-[min(90vw,320px)] flex-col gap-2">
      <AnimatePresence>
        {toasts.map((item) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => dismiss(item.id)}
            className={`pointer-events-auto border px-4 py-3 text-left text-sm ${
              item.tone === 'error'
                ? 'border-burgundy/30 bg-warm-white text-burgundy'
                : 'border-charcoal/15 bg-warm-white text-charcoal'
            }`}
          >
            {item.title}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  )
}
