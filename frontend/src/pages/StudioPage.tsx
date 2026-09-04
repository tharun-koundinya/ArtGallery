import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMyArtworks, useMyArtistProfile, useUpdateArtistProfile } from '../hooks/useArtists'
import { useAttachImages, useCategories, useCreateArtwork, useSubmitArtwork, useUploadMedia } from '../hooks/useArtworks'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input, TextArea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { EmptyState } from '../components/ui/EmptyState'
import { Price } from '../components/ui/Price'
import { Skeleton } from '../components/ui/Skeleton'

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  story: z.string().optional(),
  medium: z.string().optional(),
  style: z.string().optional(),
  yearCreated: z.string().optional(),
  widthCm: z.string().optional(),
  heightCm: z.string().optional(),
  price: z.string().min(1),
  categoryId: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function StudioPage() {
  const mine = useMyArtworks()
  const profile = useMyArtistProfile()
  const updateProfile = useUpdateArtistProfile()
  const create = useCreateArtwork()
  const submit = useSubmitArtwork()
  const upload = useUploadMedia()
  const attach = useAttachImages()
  const categories = useCategories()
  const [file, setFile] = useState<File | null>(null)
  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { price: '' } })

  const works = mine.data ?? []
  const published = works.filter((w) => w.status === 'PUBLISHED').length
  const pending = works.filter((w) => w.status === 'PENDING_REVIEW').length
  const drafts = works.filter((w) => w.status === 'DRAFT').length

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Artist studio</p>
      <h1 className="mt-2 font-display text-6xl">{profile.data?.displayName ?? 'Studio'}</h1>

      <div className="mt-10 grid gap-6 border-y border-charcoal/10 py-8 sm:grid-cols-4">
        {[
          ['Works', works.length],
          ['Published', published],
          ['In review', pending],
          ['Drafts', drafts],
        ].map(([label, value]) => (
          <div key={String(label)}>
            <p className="text-[11px] tracking-[0.18em] uppercase text-stone">{label}</p>
            <p className="mt-2 font-display text-4xl">{value}</p>
          </div>
        ))}
      </div>

      {profile.data ? (
        <form
          className="mt-12 grid gap-6 md:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault()
            const fd = new FormData(e.currentTarget)
            updateProfile.mutate({
              displayName: String(fd.get('displayName') || ''),
              bio: String(fd.get('bio') || ''),
              website: String(fd.get('website') || ''),
              instagram: String(fd.get('instagram') || ''),
              country: String(fd.get('country') || ''),
            })
          }}
        >
          <Input name="displayName" label="Display name" defaultValue={profile.data.displayName} />
          <Input name="country" label="Country" defaultValue={profile.data.country ?? ''} />
          <Input name="website" label="Website" defaultValue={profile.data.website ?? ''} />
          <Input name="instagram" label="Instagram" defaultValue={profile.data.instagram ?? ''} />
          <div className="md:col-span-2">
            <TextArea name="bio" label="Biography" defaultValue={profile.data.bio ?? ''} />
          </div>
          <Button type="submit" variant="ghost">
            Save profile
          </Button>
        </form>
      ) : null}

      <h2 className="mt-20 font-display text-4xl">My artworks</h2>
      {mine.isLoading ? <Skeleton className="mt-6 h-40 w-full" /> : null}
      {works.length === 0 && !mine.isLoading ? (
        <div className="mt-6">
          <EmptyState title="No works yet" body="Add a piece below, then submit it for review." />
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto border border-charcoal/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-charcoal/10 text-[11px] tracking-[0.16em] uppercase text-stone">
              <tr>
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Price</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {works.map((work) => (
                <tr key={work.id} className="border-b border-charcoal/8">
                  <td className="px-4 py-4 font-display text-xl">{work.title}</td>
                  <td className="px-4 py-4">
                    <Price value={work.price} currency={work.currency} className="text-lg" />
                  </td>
                  <td className="px-4 py-4">
                    <Badge>{(work.status ?? '').replaceAll('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {work.status === 'DRAFT' || work.status === 'REJECTED' ? (
                      <Button variant="text" onClick={() => submit.mutate(work.id)}>
                        Submit for review
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-20 font-display text-4xl">Add artwork</h2>
      <form
        className="mt-8 grid gap-6 md:grid-cols-2"
        onSubmit={form.handleSubmit(async (values) => {
          const created = await create.mutateAsync({
            title: values.title,
            description: values.description,
            story: values.story,
            medium: values.medium,
            style: values.style,
            yearCreated: values.yearCreated ? Number(values.yearCreated) : undefined,
            widthCm: values.widthCm ? Number(values.widthCm) : undefined,
            heightCm: values.heightCm ? Number(values.heightCm) : undefined,
            price: Number(values.price),
            currency: 'INR',
            quantity: 1,
            categoryId: values.categoryId || undefined,
          })
          if (file && created?.id) {
            const media = await upload.mutateAsync(file)
            if (media?.storageKey) {
              await attach.mutateAsync({
                id: created.id,
                storageKeys: [media.storageKey],
                primaryKey: media.storageKey,
              })
            }
          }
          form.reset()
          setFile(null)
        })}
      >
        <Input label="Title" {...form.register('title')} error={form.formState.errors.title?.message} />
        <Input label="Price (INR)" type="number" {...form.register('price')} error={form.formState.errors.price?.message} />
        <Input label="Medium" {...form.register('medium')} />
        <Input label="Style" {...form.register('style')} />
        <Input label="Year" type="number" {...form.register('yearCreated')} />
        <Select label="Category" {...form.register('categoryId')}>
          <option value="">Select</option>
          {(categories.data ?? []).map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Input label="Width cm" type="number" step="0.1" {...form.register('widthCm')} />
        <Input label="Height cm" type="number" step="0.1" {...form.register('heightCm')} />
        <div className="md:col-span-2">
          <TextArea label="Description" {...form.register('description')} />
        </div>
        <div className="md:col-span-2">
          <TextArea label="Story" {...form.register('story')} />
        </div>
        <label className="md:col-span-2 block space-y-2">
          <span className="text-[11px] tracking-[0.2em] uppercase text-stone">Image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-stone"
          />
        </label>
        <Button type="submit" disabled={create.isPending || upload.isPending}>
          {create.isPending ? 'Saving' : 'Save draft'}
        </Button>
      </form>
    </div>
  )
}
