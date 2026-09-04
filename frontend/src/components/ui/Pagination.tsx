import { Button } from './Button'

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  if (totalPages <= 1) return null
  return (
    <div className="mt-14 flex items-center justify-between border-t border-charcoal/10 pt-6">
      <Button variant="text" disabled={page <= 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <p className="text-[11px] tracking-[0.2em] uppercase text-stone">
        {page + 1} / {totalPages}
      </p>
      <Button variant="text" disabled={page + 1 >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  )
}
