export function EmptyState({
  title,
  body,
}: {
  title: string
  body?: string
}) {
  return (
    <div className="border border-dashed border-charcoal/15 px-8 py-16 text-center">
      <h3 className="font-display text-3xl">{title}</h3>
      {body ? <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-stone">{body}</p> : null}
    </div>
  )
}
