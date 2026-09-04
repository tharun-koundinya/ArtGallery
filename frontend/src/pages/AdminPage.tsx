import { useState } from 'react'
import {
  useAdminApplications,
  useAdminArtworks,
  useAdminStats,
  useAdminUsers,
  useApproveApplication,
  usePublishArtwork,
  useRejectApplication,
  useRejectArtwork,
} from '../hooks/useAdmin'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { TextArea } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { EmptyState } from '../components/ui/EmptyState'
import { Pagination } from '../components/ui/Pagination'
import { Skeleton } from '../components/ui/Skeleton'
import { userRoles } from '../lib/format'
import type { ArtistApplication } from '../types/artist'
import type { Artwork } from '../types/artwork'

type ConfirmState =
  | { kind: 'approve-app'; item: ArtistApplication }
  | { kind: 'reject-app'; item: ArtistApplication }
  | { kind: 'publish'; item: Artwork }
  | { kind: 'reject-art'; item: Artwork }
  | null

export function AdminPage() {
  const stats = useAdminStats()
  const [appStatus, setAppStatus] = useState('PENDING')
  const [artStatus, setArtStatus] = useState('PENDING_REVIEW')
  const [artPage, setArtPage] = useState(0)
  const [userPage, setUserPage] = useState(0)
  const applications = useAdminApplications(appStatus || undefined)
  const artworks = useAdminArtworks(artStatus || undefined, artPage)
  const users = useAdminUsers(userPage)
  const approveApp = useApproveApplication()
  const rejectApp = useRejectApplication()
  const publish = usePublishArtwork()
  const rejectArt = useRejectArtwork()
  const [confirm, setConfirm] = useState<ConfirmState>(null)
  const [reason, setReason] = useState('')

  const s = stats.data

  function runConfirm() {
    if (!confirm) return
    if (confirm.kind === 'approve-app') approveApp.mutate(confirm.item.id)
    if (confirm.kind === 'reject-app') rejectApp.mutate({ id: confirm.item.id, reason: reason || 'Not a fit for the salon' })
    if (confirm.kind === 'publish') publish.mutate(confirm.item.id)
    if (confirm.kind === 'reject-art') rejectArt.mutate({ id: confirm.item.id, reason: reason || 'Does not meet house standard' })
    setConfirm(null)
    setReason('')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-[11px] tracking-[0.24em] uppercase text-muted-gold">Owner console</p>
      <h1 className="mt-2 font-display text-6xl">Administration</h1>

      {stats.isLoading ? <Skeleton className="mt-10 h-24 w-full" /> : null}
      {stats.isError ? <div className="mt-10"><EmptyState title="Stats unavailable" /></div> : null}
      {s ? (
        <div className="mt-10 grid gap-6 border-y border-charcoal/10 py-8 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ['Users', s.users],
            ['Artists', s.artists],
            ['Artworks', s.artworks],
            ['Published', s.publishedArtworks],
            ['Pending apps', s.pendingApplications],
            ['Pending works', s.pendingArtworks],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <p className="text-[11px] tracking-[0.16em] uppercase text-stone">{label}</p>
              <p className="mt-2 font-display text-4xl">{value ?? 0}</p>
            </div>
          ))}
        </div>
      ) : null}

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Artist applications</h2>
          <Select value={appStatus} onChange={(e) => setAppStatus(e.target.value)} className="w-44">
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="">All</option>
          </Select>
        </div>
        {(applications.data ?? []).length === 0 ? <EmptyState title="No applications" /> : null}
        <div className="space-y-4">
          {(applications.data ?? []).map((app) => (
            <div key={app.id} className="border border-charcoal/10 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-2xl">{app.displayName || 'Applicant'}</p>
                  <p className="mt-1 text-sm text-stone">{app.email}</p>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed">{app.biography}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge>{(app.status ?? '').replaceAll('_', ' ')}</Badge>
                  {app.status === 'PENDING' ? (
                    <>
                      <Button variant="ghost" onClick={() => setConfirm({ kind: 'approve-app', item: app })}>
                        Approve
                      </Button>
                      <Button variant="text" className="text-burgundy" onClick={() => setConfirm({ kind: 'reject-app', item: app })}>
                        Reject
                      </Button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="font-display text-4xl">Artwork moderation</h2>
          <Select
            value={artStatus}
            onChange={(e) => {
              setArtStatus(e.target.value)
              setArtPage(0)
            }}
            className="w-52"
          >
            <option value="PENDING_REVIEW">Pending review</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
            <option value="DRAFT">Draft</option>
            <option value="">All</option>
          </Select>
        </div>
        {(artworks.data?.content ?? []).length === 0 ? <EmptyState title="No artworks in this queue" /> : null}
        <div className="overflow-x-auto border border-charcoal/10">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-charcoal/10 text-[11px] tracking-[0.16em] uppercase text-stone">
              <tr>
                <th className="px-4 py-3 font-normal">Title</th>
                <th className="px-4 py-3 font-normal">Artist</th>
                <th className="px-4 py-3 font-normal">Status</th>
                <th className="px-4 py-3 font-normal"></th>
              </tr>
            </thead>
            <tbody>
              {(artworks.data?.content ?? []).map((work) => (
                <tr key={work.id} className="border-b border-charcoal/8">
                  <td className="px-4 py-4 font-display text-xl">{work.title}</td>
                  <td className="px-4 py-4 text-stone">{work.artistName}</td>
                  <td className="px-4 py-4">
                    <Badge>{(work.status ?? '').replaceAll('_', ' ')}</Badge>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {work.status === 'PENDING_REVIEW' || work.status === 'APPROVED' ? (
                      <Button variant="text" onClick={() => setConfirm({ kind: 'publish', item: work })}>
                        Publish
                      </Button>
                    ) : null}
                    {work.status === 'PENDING_REVIEW' ? (
                      <Button variant="text" className="text-burgundy" onClick={() => setConfirm({ kind: 'reject-art', item: work })}>
                        Reject
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={artworks.data?.page ?? 0} totalPages={artworks.data?.totalPages ?? 0} onChange={setArtPage} />
      </section>

      <section className="mt-16">
        <h2 className="font-display text-4xl">Users</h2>
        <div className="mt-6 overflow-x-auto border border-charcoal/10">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-charcoal/10 text-[11px] tracking-[0.16em] uppercase text-stone">
              <tr>
                <th className="px-4 py-3 font-normal">Name</th>
                <th className="px-4 py-3 font-normal">Email</th>
                <th className="px-4 py-3 font-normal">Roles</th>
                <th className="px-4 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {(users.data?.content ?? []).map((u) => (
                <tr key={u.id} className="border-b border-charcoal/8">
                  <td className="px-4 py-4 font-display text-xl">{u.fullName}</td>
                  <td className="px-4 py-4 text-stone">{u.email}</td>
                  <td className="px-4 py-4 text-[11px] tracking-wide uppercase text-stone">
                    {userRoles(u.roles).join(' · ')}
                  </td>
                  <td className="px-4 py-4">
                    <Badge>{u.status ?? 'ACTIVE'}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination page={users.data?.page ?? 0} totalPages={users.data?.totalPages ?? 0} onChange={setUserPage} />
      </section>

      <Modal
        open={Boolean(confirm)}
        title={
          confirm?.kind === 'approve-app'
            ? 'Approve application'
            : confirm?.kind === 'publish'
              ? 'Publish artwork'
              : 'Confirm rejection'
        }
        onClose={() => {
          setConfirm(null)
          setReason('')
        }}
      >
        <p className="text-sm leading-relaxed text-stone">
          {confirm?.kind === 'approve-app' && `Grant artist representation to ${confirm.item.displayName ?? 'this applicant'}?`}
          {confirm?.kind === 'publish' && `Publish “${confirm.item.title}” to the public salon?`}
          {(confirm?.kind === 'reject-app' || confirm?.kind === 'reject-art') && 'A reason is recorded on the record.'}
        </p>
        {(confirm?.kind === 'reject-app' || confirm?.kind === 'reject-art') && (
          <div className="mt-6">
            <TextArea label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
        )}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="text" onClick={() => setConfirm(null)}>
            Cancel
          </Button>
          <Button onClick={runConfirm}>Confirm</Button>
        </div>
      </Modal>
    </div>
  )
}
