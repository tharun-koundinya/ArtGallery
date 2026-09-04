import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate } from 'react-router-dom'
import { useApplyArtist } from '../hooks/useArtists'
import { useSession } from '../stores/authStore'
import { Input, TextArea } from '../components/ui/Input'
import { Button } from '../components/ui/Button'

const schema = z.object({
  displayName: z.string().min(2),
  biography: z.string().optional(),
  portfolioUrl: z.string().optional(),
  website: z.string().optional(),
  instagram: z.string().optional(),
  yearsExperience: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function ApplyPage() {
  const { isArtist } = useSession()
  const apply = useApplyArtist()
  const form = useForm<FormValues>({ resolver: zodResolver(schema) })

  if (isArtist) return <Navigate to="/studio" replace />

  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Representation</p>
      <h1 className="mt-2 font-display text-5xl">Apply as artist</h1>
      <p className="mt-4 text-sm leading-relaxed text-stone">
        Share a concise biography and portfolio. The gallery owner reviews every application by hand.
      </p>
      <form
        className="mt-10 space-y-7"
        onSubmit={form.handleSubmit((values) =>
          apply.mutate({
            ...values,
            yearsExperience: values.yearsExperience ? Number(values.yearsExperience) : undefined,
          }),
        )}
      >
        <Input label="Display name" {...form.register('displayName')} error={form.formState.errors.displayName?.message} />
        <TextArea label="Biography" {...form.register('biography')} />
        <Input label="Portfolio URL" {...form.register('portfolioUrl')} />
        <Input label="Website" {...form.register('website')} />
        <Input label="Instagram" {...form.register('instagram')} />
        <Input label="Years of experience" type="number" {...form.register('yearsExperience')} />
        <Input label="Country" {...form.register('country')} />
        <Input label="Phone" {...form.register('phone')} />
        <Button type="submit" disabled={apply.isPending}>
          {apply.isPending ? 'Submitting' : 'Submit application'}
        </Button>
        {apply.isSuccess ? <p className="text-sm text-muted-gold">Your application is with the salon.</p> : null}
      </form>
    </div>
  )
}
