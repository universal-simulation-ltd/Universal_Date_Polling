import { useCallback, useEffect, useState } from 'react'
import type { SupabaseClient } from '@supabase/supabase-js'
import { deletePolls, listMyPolls } from '../lib/api'
import { pollLink } from '../lib/appUrl'
import {
  confirmedLabel, deleteAllPrompt, deletePrompt, expiryLabel, isExpired, mergeMyPolls, pollSummary,
  responsesLabel, splitMyPolls,
} from '../lib/myPolls'
import type { MyPoll } from '../lib/types'

/** From this many active polls the panel folds itself away, and starts folded.
 *  Below it, the list is short enough to just sit there. The point is that this
 *  panel is ABOVE the create form: a host with a dozen live polls would
 *  otherwise have to scroll past all of them to make the next one, and the
 *  count in the header already says how many are waiting. */
const COLLAPSE_FROM = 3

/** The list plus, for each poll, WHICH signed-in client returned it — a delete
 *  has to go back through the session that owns the row, or RLS quietly removes
 *  nothing at all. */
interface Loaded {
  polls: MyPoll[]
  owners: Map<string, SupabaseClient>
}

/**
 * "Your polls" — the way back to a poll you already made, and the way to get
 * rid of one.
 *
 * A poll id is ten random characters, so before this the only route back to one
 * was the link the host copied at the time: close the tab and the poll was
 * effectively gone, even signed in as its host. This lists them.
 *
 * Two clients, not one, and that is not belt-and-braces. A host can hold BOTH a
 * Universal ID (suite SSO) session and this app's own email-code session at
 * once, they are different `auth.uid()`s, and polls created under each are all
 * equally "yours" — `PollPage` already has to reason about the same pair to
 * decide who the host is. Pass whichever are signed in; nulls are skipped.
 *
 * Renders NOTHING at all when there is nothing to say (still loading, or no
 * polls) — an empty "you have no polls" card on the create page would be a
 * permanent fixture for the many hosts who make exactly one poll and share it.
 */
export default function MyPolls({ pollBase, suiteClient, otpClient, onDeleted }: {
  pollBase: string
  suiteClient: SupabaseClient | null
  otpClient: SupabaseClient | null
  /** Called after anything is actually deleted. The create page uses it to
   *  re-read the free-token gate: a free-tier host who deletes their one active
   *  poll gets the token back immediately, and the banner above the Create
   *  button would otherwise still say it was in use. */
  onDeleted?: () => void
}) {
  const [data, setData] = useState<Loaded | null>(null)
  const [failed, setFailed] = useState(false)
  // Only consulted when the list is long enough to be collapsible (see
  // COLLAPSE_FROM) — a short list is always open.
  const [open, setOpen] = useState(false)
  const [showExpired, setShowExpired] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  // Which row (or the expired batch) is asking "are you sure?", and what is
  // mid-delete. Two-step in the page rather than `window.confirm`, which reads
  // as a browser error and cannot be styled.
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [confirmBatch, setConfirmBatch] = useState(false)
  const [busyIds, setBusyIds] = useState<string[]>([])
  const [deleteError, setDeleteError] = useState<string | null>(null)
  // Bumped by Retry; the effect keys off it so a retry is one state change
  // rather than a second copy of the fetch.
  const [attempt, setAttempt] = useState(0)

  const load = useCallback(async () => {
    const clients = [suiteClient, otpClient].filter((c): c is SupabaseClient => !!c)
    if (clients.length === 0) return { entries: [] as { client: SupabaseClient; polls: MyPoll[] }[], ok: true }
    const results = await Promise.allSettled(clients.map((c) => listMyPolls(c)))
    // One session failing must not blank out the other's polls: a host with a
    // suite session AND a stale email-code session is exactly who this panel is
    // for, and the stale one is the likelier to error.
    const entries = results.flatMap((r, i) =>
      r.status === 'fulfilled' ? [{ client: clients[i], polls: r.value }] : [])
    return { entries, ok: entries.length === results.length }
  }, [suiteClient, otpClient])

  useEffect(() => {
    let live = true
    setFailed(false)
    load()
      .then(({ entries, ok }) => {
        if (!live) return
        const owners = new Map<string, SupabaseClient>()
        for (const e of entries) {
          for (const p of e.polls) if (!owners.has(p.id)) owners.set(p.id, e.client)
        }
        setData({ polls: mergeMyPolls(...entries.map((e) => e.polls)), owners })
        if (!ok) setFailed(true)
      })
      .catch(() => { if (live) { setData({ polls: [], owners: new Map() }); setFailed(true) } })
    return () => { live = false }
  }, [load, attempt])

  async function copy(poll: MyPoll) {
    try {
      await navigator.clipboard.writeText(pollLink(pollBase, poll.id))
      setCopiedId(poll.id)
      setTimeout(() => setCopiedId((id) => (id === poll.id ? null : id)), 1800)
    } catch {
      /* clipboard blocked — the poll link is still one tap away via Open */
    }
  }

  /** Delete one poll or a whole batch, each through the session that owns it.
   *  Rows are struck off only when the server says they actually went: RLS
   *  filters rather than raises, so "deleted nothing" is not an error, and
   *  removing them optimistically would hide a poll that is still there. */
  async function remove(ids: string[]) {
    if (!data || ids.length === 0) return
    setDeleteError(null)
    setBusyIds(ids)

    const groups = new Map<SupabaseClient, string[]>()
    for (const id of ids) {
      const client = data.owners.get(id)
      if (!client) continue
      groups.set(client, [...(groups.get(client) ?? []), id])
    }
    const settled = await Promise.allSettled(
      [...groups].map(([client, group]) => deletePolls(client, group)),
    )
    const gone = new Set(settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : [])))

    if (gone.size > 0) {
      setData((d) => (d ? { polls: d.polls.filter((p) => !gone.has(p.id)), owners: d.owners } : d))
      onDeleted?.()
    }
    if (gone.size < ids.length) {
      setDeleteError(ids.length === 1
        ? "That poll couldn't be deleted — please try again."
        : `${ids.length - gone.size} of ${ids.length} polls couldn't be deleted — please try again.`)
    }
    setBusyIds([])
    setConfirmId(null)
    setConfirmBatch(false)
  }

  // Nothing loaded yet, and nothing to report: stay out of the way entirely.
  if (!data) return null

  const { active, expired } = splitMyPolls(data.polls)

  if (data.polls.length === 0) {
    // A failure and a genuinely empty account look identical from here, so the
    // failure is the only one worth a card — otherwise a host whose polls did
    // not load is quietly told they have none.
    if (!failed) return null
    return (
      <div className="mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 px-5 py-4 text-sm text-slate-600">
        Couldn't load your polls.{' '}
        <button
          type="button"
          onClick={() => setAttempt((n) => n + 1)}
          className="font-medium text-orange-700 underline underline-offset-2 hover:text-orange-800"
        >
          Try again
        </button>
      </div>
    )
  }

  const collapsible = active.length >= COLLAPSE_FROM
  const expanded = !collapsible || open
  const rowProps = (p: MyPoll) => ({
    poll: p,
    pollBase,
    copied: copiedId === p.id,
    confirming: confirmId === p.id,
    busy: busyIds.includes(p.id),
    onCopy: () => copy(p),
    onAskDelete: () => { setDeleteError(null); setConfirmBatch(false); setConfirmId(p.id) },
    onCancelDelete: () => setConfirmId(null),
    onDelete: () => remove([p.id]),
  })

  return (
    <section className="mb-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 pop-in">
      {/* The heading is the toggle when there is a toggle, and a plain heading
          otherwise — rather than a chevron that does nothing on a two-poll
          list. Same chevron as the create form's "More options", so the two
          disclosures on this page behave alike. */}
      <Heading
        title={active.length > 0 ? 'Your active polls' : 'Your polls'}
        count={active.length}
        collapsible={collapsible}
        open={expanded}
        onToggle={() => setOpen((o) => !o)}
      />

      {active.length === 0 && (
        <p className="mt-2 text-sm text-slate-600">
          Nothing active right now — your {expired.length === 1 ? 'poll has' : 'polls have'} expired.
        </p>
      )}

      {expanded && (
        <ul className="mt-1">
          {active.map((p) => <PollRow key={p.id} {...rowProps(p)} />)}
        </ul>
      )}

      {expanded && expired.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
            <button
              type="button"
              onClick={() => setShowExpired((s) => !s)}
              aria-expanded={showExpired}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 underline underline-offset-2"
            >
              {showExpired ? 'Hide' : 'Show'} {expired.length} expired
            </button>
            {/* Only offered while the list is open: a bulk delete of things the
                host cannot currently see is a button that destroys the unseen. */}
            {showExpired && !confirmBatch && (
              <button
                type="button"
                onClick={() => { setDeleteError(null); setConfirmId(null); setConfirmBatch(true) }}
                className="text-xs font-medium text-slate-500 hover:text-red-700 underline underline-offset-2"
              >
                {expired.length === 1 ? 'Delete it' : `Delete all ${expired.length}`}
              </button>
            )}
          </div>

          {confirmBatch && (
            <ConfirmStrip
              question={deleteAllPrompt(expired.length)}
              confirmLabel={expired.length === 1 ? 'Delete' : `Delete all ${expired.length}`}
              busy={busyIds.length > 0}
              onConfirm={() => remove(expired.map((p) => p.id))}
              onCancel={() => setConfirmBatch(false)}
            />
          )}

          {showExpired && (
            <ul className="mt-1">
              {expired.map((p) => <PollRow key={p.id} {...rowProps(p)} />)}
            </ul>
          )}
        </div>
      )}

      {deleteError && <p className="mt-3 text-xs text-red-600">{deleteError}</p>}

      {failed && (
        <p className="mt-3 text-xs text-amber-700">
          Some of your polls may be missing from this list —{' '}
          <button
            type="button"
            onClick={() => setAttempt((n) => n + 1)}
            className="font-medium underline underline-offset-2"
          >
            try again
          </button>
          .
        </p>
      )}
    </section>
  )
}

function Heading({ title, count, collapsible, open, onToggle }: {
  title: string
  count: number
  collapsible: boolean
  open: boolean
  onToggle: () => void
}) {
  const badge = count > 0 && (
    <span className="ml-2 rounded-full bg-orange-50 px-2 py-0.5 text-xs font-bold text-orange-700 ring-1 ring-orange-200">
      {count}
    </span>
  )
  if (!collapsible) {
    return <h2 className="text-base font-extrabold text-slate-900">{title}{badge}</h2>
  }
  return (
    <h2>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-1.5 text-left text-base font-extrabold text-slate-900 hover:text-orange-700"
      >
        <svg viewBox="0 0 12 12" className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} aria-hidden="true">
          <path d="M4 2 L8 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {title}
        {badge}
      </button>
    </h2>
  )
}

function PollRow({ poll, pollBase, copied, confirming, busy, onCopy, onAskDelete, onCancelDelete, onDelete }: {
  poll: MyPoll
  pollBase: string
  copied: boolean
  confirming: boolean
  busy: boolean
  onCopy: () => void
  onAskDelete: () => void
  onCancelDelete: () => void
  onDelete: () => void
}) {
  // The same absolute link the created-poll panel shows, for the same reason:
  // inside the iPhone app the running origin is `capacitor://localhost`, so a
  // BASE-relative href points at nothing shareable. On the web this is a
  // same-origin URL, so it is an ordinary navigation and App routes it.
  const href = pollLink(pollBase, poll.id)
  const confirmed = confirmedLabel(poll)
  const expiry = expiryLabel(poll)
  // No Copy link on a dead poll: it still opens (the host can read the answers
  // it did get), but handing out its link would be sharing something nobody can
  // answer any more.
  const dead = isExpired(poll)
  return (
    <li className="border-t border-slate-100 py-3 first:border-t-0 last:pb-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        {/* A plain href, not a router push: App reads the route from the URL on
            load and on popstate, so a normal navigation is the whole story. */}
        <a href={href} className="min-w-0 font-semibold text-slate-900 hover:text-orange-700 underline-offset-2 hover:underline">
          {poll.title}
        </a>
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ${
            poll.response_count > 0 || (poll.booking_mode && poll.final_slot_id)
              ? 'bg-emerald-50 text-emerald-700 ring-emerald-200'
              : 'bg-slate-50 text-slate-600 ring-slate-200'
          }`}
        >
          {responsesLabel(poll)}
        </span>
      </div>

      {/* Summary and actions share a line — this panel sits ABOVE the create
          form, so every line it spends is one the form is pushed down by. It
          wraps to two on a narrow phone, which is the only place it needs to. */}
      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <p className="text-xs text-slate-500">
          {poll.booking_mode && <span className="font-medium text-slate-600">Booking page · </span>}
          {pollSummary(poll)}
          {expiry && <> · {expiry}</>}
        </p>
        {!confirming && (
          <div className="flex items-center gap-3 text-xs">
            {!dead && (
              <button
                type="button"
                onClick={onCopy}
                className="rounded-md px-2 py-1 font-medium text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            )}
            <a href={href} className="font-medium text-orange-700 hover:text-orange-800 hover:underline underline-offset-2">
              Open →
            </a>
            <button
              type="button"
              onClick={onAskDelete}
              className="font-medium text-slate-400 hover:text-red-700 underline-offset-2 hover:underline"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {confirmed && (
        <p className="mt-1.5 text-xs font-medium text-emerald-700">
          {poll.booking_mode ? 'Booked' : 'Confirmed'}: {confirmed}
        </p>
      )}

      {confirming && (
        <ConfirmStrip
          question={deletePrompt(poll)}
          confirmLabel="Delete"
          busy={busy}
          onConfirm={onDelete}
          onCancel={onCancelDelete}
        />
      )}
    </li>
  )
}

/** The "are you sure?" line, shared by one row and by the expired batch so both
 *  ask in the same voice and in the same place — under what is about to go. */
function ConfirmStrip({ question, confirmLabel, busy, onConfirm, onCancel }: {
  question: string
  confirmLabel: string
  busy: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-red-50 px-3 py-2 ring-1 ring-red-100">
      <p className="text-xs text-slate-700">{question}</p>
      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-1 text-xs font-medium text-slate-500 hover:text-slate-700"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-60"
        >
          {busy ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </div>
  )
}
