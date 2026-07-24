import { useEffect, useMemo, useState } from 'react'
import { useUser, useUniversal } from '@unisim/sdk'
import type { Availability, Poll, PollBranding, PollResponse, Slot } from '../lib/types'
import { currentUser, getPollResilient, getResponses, notifyPollHost, setFinalSlot, submitResponse } from '../lib/api'
import { supabase } from '../lib/supabase'
import { themeAttr, themeVars } from '../lib/theme'
import {
  formatCalendarDay, formatDateHeading, formatRange, formatTime, localTimezone, needsTzNote, sameCalendarDay, slotDayKey, slotInstant, tzAbbrev,
} from '../lib/time'
import { CONTAINER_POLL } from '../lib/layout'
import AddToCalendar from './AddToCalendar'

type Load = 'loading' | 'ready' | 'notfound' | 'error'

const NAME_KEY = 'unipoll:name'

export default function PollPage({ id, pollBase }: { id: string; pollBase: string }) {
  const [state, setState] = useState<Load>('loading')
  const [poll, setPoll] = useState<Poll | null>(null)
  const [responses, setResponses] = useState<PollResponse[]>([])
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [mine, setMine] = useState<Record<string, Availability | undefined>>({})
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const viewerTz = localTimezone()

  // Host detection. A poll's host authenticated either through the suite (a
  // Universal ID session, via the SDK client) or as a guest via email OTP (the
  // app's own client). Whoever's uid matches host_user_id is the host, and
  // their client is the one RLS will accept the "confirm slot" update on.
  const { user: suiteUser } = useUser()
  const { supabase: suiteClient } = useUniversal()
  const [otpUserId, setOtpUserId] = useState<string | null>(null)
  useEffect(() => {
    currentUser().then((u) => setOtpUserId(u?.id ?? null)).catch(() => setOtpUserId(null))
  }, [])

  useEffect(() => {
    let live = true
    async function load() {
      setState('loading')
      setError(null)
      try {
        // Resilient fetch: the app's Supabase client can still be warming up on
        // the first navigation right after a poll is created, which used to
        // surface a transient error that only a manual refresh cleared. Retrying
        // the load removes the need for that refresh.
        const p = await getPollResilient(id)
        if (!live) return
        if (!p) { setState('notfound'); return }
        setPoll(p)
        setResponses(await getResponses(id))
        setState('ready')
      } catch (e) {
        if (!live) return
        setError(e instanceof Error ? e.message : 'Failed to load poll.')
        setState('error')
      }
    }
    load()
    return () => { live = false }
  }, [id, reloadKey])

  // Pre-fill the form if this browser has already responded under a known name.
  useEffect(() => {
    if (!poll || !name) return
    const existing = responses.find((r) => r.name.toLowerCase() === name.trim().toLowerCase())
    if (existing) setMine(existing.availability)
  }, [poll, responses, name])

  const expired = !!poll?.expires_at && new Date(poll.expires_at).getTime() < Date.now()

  function cycle(slotId: string, value: Availability) {
    setMine((m) => ({ ...m, [slotId]: m[slotId] === value ? undefined : value }))
  }

  async function save() {
    if (!poll) return
    setError(null)
    if (!name.trim()) { setError('Add your name so people know who you are.'); return }
    const availability: Record<string, Availability> = {}
    for (const [k, v] of Object.entries(mine)) if (v) availability[k] = v
    // A brand-new responder (not this browser editing an existing entry) — used
    // to notify the host once per new person, not on every re-save.
    const isNewResponder = !responses.some((r) => r.name.trim().toLowerCase() === name.trim().toLowerCase())
    setSaving(true)
    try {
      await submitResponse(poll.id, name, availability)
      localStorage.setItem(NAME_KEY, name.trim())
      if (isNewResponder) void notifyPollHost(poll.id, name.trim())
      setResponses(await getResponses(poll.id))
      setSavedAt(Date.now())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your response.')
    } finally {
      setSaving(false)
    }
  }

  // The client to run a host-only write on: whichever session's uid matches the
  // poll's host. null for everyone else (so non-hosts never see host controls).
  function hostClientFor(p: Poll) {
    if (suiteUser?.id === p.host_user_id) return suiteClient
    if (otpUserId && otpUserId === p.host_user_id) return supabase
    return null
  }

  async function confirmSlot(slotId: string | null) {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    setError(null)
    setConfirming(true)
    try {
      await setFinalSlot(client, poll.id, slotId)
      setPoll({ ...poll, final_slot_id: slotId })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not confirm the time.')
    } finally {
      setConfirming(false)
    }
  }

  if (state === 'loading') return <Centered>Loading poll…</Centered>
  if (state === 'notfound') return <NotFound pollBase={pollBase} />
  if (state === 'error' || !poll) return <LoadError message={error} onRetry={() => setReloadKey((k) => k + 1)} />


  const slots = [...poll.slots].sort((a, b) => a.start.localeCompare(b.start))
  const dayMode = poll.mode === 'days'
  const tzNote = needsTzNote(poll, viewerTz)
  // The page we're on IS the shareable poll link — reuse it verbatim for the
  // "view or update the poll" line stamped into each calendar event.
  const pollUrl = window.location.origin + window.location.pathname

  const isHost = !!hostClientFor(poll)
  const finalSlot = poll.final_slot_id ? slots.find((s) => s.id === poll.final_slot_id) ?? null : null

  return (
    <div data-theme={themeAttr(poll.theme)} style={themeVars(poll.theme)} className={`${CONTAINER_POLL} py-8 sm:py-10`}>
      {poll.branding && <BrandingHeader branding={poll.branding} />}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 break-words">{poll.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {responses.length === 0 ? 'Be the first to respond.' : `${responses.length} ${responses.length === 1 ? 'person has' : 'people have'} responded.`}
          {!dayMode && (
            <>
              {/* Anchor the abbreviation to the first slot's instant, not "now" —
                  a summer page-view of a winter poll would otherwise label GMT
                  times as BST (and vice versa). */}
              {' · '}Times in <span className="font-medium">{tzAbbrev(poll.timezone, slots.length ? slotInstant(slots[0].start, poll.timezone) : undefined)}</span>
              {tzNote && <span className="text-slate-500"> (your timezone: {tzAbbrev(viewerTz, slots.length ? slotInstant(slots[0].start, poll.timezone) : undefined)})</span>}
            </>
          )}
        </p>
        {poll.location && <PollLocation location={poll.location} className="mt-3 justify-center" />}
      </header>

      {finalSlot && (
        <ConfirmedBanner
          poll={poll} slot={finalSlot} pollUrl={pollUrl} viewerTz={viewerTz}
          dayMode={dayMode} isHost={isHost} confirming={confirming}
          onUnconfirm={() => confirmSlot(null)}
        />
      )}
      {isHost && !finalSlot && responses.length > 0 && (
        <p className="mt-5 text-center text-sm text-slate-500">
          You're the host — pick the final time below with <span className="font-medium text-slate-700">Confirm this time</span>, and everyone with the link will see it.
        </p>
      )}

      {expired && (
        <div className="mt-6 rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-4 py-3 text-sm">
          This poll's link has expired — it's read-only now.
        </div>
      )}

      {/* Respond */}
      {!expired && (
        <section className="mt-7 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 pop-in">
          <h2 className="text-base font-bold text-slate-900">
            {dayMode ? 'Are you free on these days?' : 'Are you free at these times?'}
          </h2>
          <label className="mt-3 block">
            <span className="text-sm font-medium text-slate-700">Your name</span>
            <input
              type="text"
              value={name}
              maxLength={120}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sam"
              className="mt-1 w-full sm:w-72 h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
            />
          </label>

          <div className="mt-4 space-y-4">
            {groupByDay(slots).map(([day, list]) => (
              <div key={day}>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {dayMode ? formatCalendarDay(day) : formatDateHeading(slotInstant(list[0].start, poll.timezone), poll.timezone)}
                </div>
                <div className="mt-2 space-y-2">
                  {list.map((s) => {
                    const inst = slotInstant(s.start, poll.timezone)
                    const v = mine[s.id]
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">{dayMode ? 'All day' : formatRange(inst, s.durationMins, poll.timezone)}</div>
                          {tzNote && <div className="text-xs text-slate-500">{viewerTimeNote(formatTime(inst, viewerTz), inst, poll.timezone, viewerTz)}</div>}
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'yes')}
                            aria-pressed={v === 'yes'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'yes' ? 'bg-[var(--accent)] text-white ring-[var(--accent)]' : 'bg-white text-slate-700 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            Yes 👍
                          </button>
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'maybe')}
                            aria-pressed={v === 'maybe'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'maybe' ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] ring-[var(--accent)]' : 'bg-white text-slate-500 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            If need be
                          </button>
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'no')}
                            aria-pressed={v === 'no'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'no' ? 'bg-rose-600 text-white ring-rose-600' : 'bg-white text-slate-500 ring-slate-300 hover:ring-rose-400'}`}
                          >
                            No 🙅‍♀️
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save my availability'}
            </button>
            {savedAt && <span className="text-sm text-green-600">Saved — thanks!</span>}
          </div>
        </section>
      )}

      {/* Results */}
      <Results
        poll={poll} slots={slots} responses={responses} viewerTz={viewerTz} pollUrl={pollUrl}
        isHost={isHost} confirming={confirming} finalSlotId={poll.final_slot_id}
        onConfirm={confirmSlot}
      />
    </div>
  )
}

function Results({ poll, slots, responses, viewerTz, pollUrl, isHost, confirming, finalSlotId, onConfirm }: {
  poll: Poll; slots: Slot[]; responses: PollResponse[]; viewerTz: string; pollUrl: string
  isHost: boolean; confirming: boolean; finalSlotId: string | null
  onConfirm: (slotId: string | null) => void
}) {
  const tally = useMemo(() => {
    return slots.map((s) => {
      const yes = responses.filter((r) => r.availability[s.id] === 'yes').map((r) => r.name)
      const maybe = responses.filter((r) => r.availability[s.id] === 'maybe').map((r) => r.name)
      const no = responses.filter((r) => r.availability[s.id] === 'no').map((r) => r.name)
      return { slot: s, yes, maybe, no }
    })
  }, [slots, responses])

  const maxYes = Math.max(0, ...tally.map((t) => t.yes.length))
  const total = responses.length
  const dayMode = poll.mode === 'days'
  const tzNote = needsTzNote(poll, viewerTz)

  return (
    <section className="mt-7">
      <h2 className="text-base font-bold text-slate-900 px-1">Results so far</h2>
      {total === 0 ? (
        <p className="mt-2 px-1 text-sm text-slate-500">No responses yet — share the link to get started.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {groupByDay(slots).map(([day, list]) => (
            <div key={day} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {dayMode ? formatCalendarDay(day) : formatDateHeading(slotInstant(list[0].start, poll.timezone), poll.timezone)}
              </div>
              <div className="divide-y divide-slate-100">
                {list.map((s) => {
                  const t = tally.find((x) => x.slot.id === s.id)!
                  const inst = slotInstant(s.start, poll.timezone)
                  const heat = total > 0 ? t.yes.length / total : 0
                  const best = t.yes.length > 0 && t.yes.length === maxYes
                  const isFinal = finalSlotId === s.id
                  return (
                    <div key={s.id} className={`px-4 py-3 ${isFinal ? 'bg-emerald-50/60' : ''}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-900">{dayMode ? 'All day' : formatRange(inst, s.durationMins, poll.timezone)}</span>
                          {tzNote && <span className="ml-2 text-xs text-slate-500">{viewerTimeNote(formatTime(inst, viewerTz), inst, poll.timezone, viewerTz)}</span>}
                          {isFinal && (
                            <span className="ml-2 inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white align-middle">✓ Confirmed</span>
                          )}
                          {best && !isFinal && (
                            <span className="ml-2 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white align-middle">Best</span>
                          )}
                        </div>
                        <div className="shrink-0 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">{t.yes.length}</span>
                          {t.maybe.length > 0 && <span className="text-slate-400"> · {t.maybe.length} maybe</span>}
                          {t.no.length > 0 && <span className="text-slate-400"> · {t.no.length} not free</span>}
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div className="heat-cell h-2 rounded-full" style={{ width: `${Math.max(heat * 100, t.yes.length ? 6 : 0)}%`, ['--heat' as string]: '1' }} />
                      </div>
                      {(t.yes.length > 0 || t.maybe.length > 0 || t.no.length > 0) && (
                        <p className="mt-1.5 text-xs text-slate-500">
                          {t.yes.length > 0 && <span className="text-[var(--accent-text)] font-medium">{t.yes.join(', ')}</span>}
                          {t.maybe.length > 0 && <span> {t.yes.length > 0 ? '· ' : ''}maybe: {t.maybe.join(', ')}</span>}
                          {t.no.length > 0 && <span> {t.yes.length > 0 || t.maybe.length > 0 ? '· ' : ''}not free: {t.no.join(', ')}</span>}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {isHost && !isFinal && (
                          <button
                            type="button"
                            onClick={() => onConfirm(s.id)}
                            disabled={confirming}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 hover:ring-emerald-400 transition disabled:opacity-60"
                          >
                            ✓ Confirm this time
                          </button>
                        )}
                        {isHost && isFinal && (
                          <button
                            type="button"
                            onClick={() => onConfirm(null)}
                            disabled={confirming}
                            className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-700 transition disabled:opacity-60"
                          >
                            Unconfirm
                          </button>
                        )}
                        <AddToCalendar poll={poll} slot={s} pollUrl={pollUrl} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/** The prominent "Confirmed" banner shown to everyone once the host has picked
 *  a final slot — the chosen date/time plus an "Add to calendar" for it. */
function ConfirmedBanner({ poll, slot, pollUrl, viewerTz, dayMode, isHost, confirming, onUnconfirm }: {
  poll: Poll; slot: Slot; pollUrl: string; viewerTz: string; dayMode: boolean
  isHost: boolean; confirming: boolean; onUnconfirm: () => void
}) {
  // Memoize the formatter chain: `inst` and the `when` label each run several
  // Intl.DateTimeFormat passes, and the banner re-renders on every poll refresh.
  const { inst, when } = useMemo(() => {
    const i = slotInstant(slot.start, poll.timezone)
    return {
      inst: i,
      when: dayMode
        ? formatCalendarDay(slot.start)
        : `${formatDateHeading(i, poll.timezone)} · ${formatRange(i, slot.durationMins, poll.timezone)} ${tzAbbrev(poll.timezone, i)}`,
    }
  }, [slot.start, slot.durationMins, poll.timezone, dayMode])
  const tzNote = needsTzNote(poll, viewerTz)
  return (
    <div className="mt-6 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">✓ Confirmed time</div>
          <div className="mt-0.5 text-lg font-bold text-slate-900 break-words">{when}</div>
          {tzNote && <div className="text-xs text-slate-500">{viewerTimeNote(formatRange(inst, slot.durationMins, viewerTz), inst, poll.timezone, viewerTz)}</div>}
          {poll.location && <PollLocation location={poll.location} className="mt-1.5" />}
        </div>
        <div className="flex items-center gap-2">
          {isHost && (
            <button
              type="button"
              onClick={onUnconfirm}
              disabled={confirming}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-white hover:text-slate-700 transition disabled:opacity-60"
            >
              Change
            </button>
          )}
          <AddToCalendar poll={poll} slot={slot} pollUrl={pollUrl} />
        </div>
      </div>
    </div>
  )
}

/** Whether a location string is a clickable http(s) link (a Teams / Zoom / Meet
 *  URL) rather than a physical place ("Meeting room 5"). */
function isUrlLike(s: string): boolean {
  return /^https?:\/\/\S+$/i.test(s.trim())
}

/** The poll's event location: a link icon + the value, rendered as an anchor for
 *  a meeting URL, or plain text for a physical place. */
function PollLocation({ location, className = '' }: { location: string; className?: string }) {
  const isLink = isUrlLike(location)
  return (
    <div className={`flex items-center gap-1.5 text-sm text-slate-600 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {isLink ? (
        <a href={location} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate font-medium text-[var(--accent-text)] hover:underline underline-offset-2">
          {location}
        </a>
      ) : (
        <span className="min-w-0 break-words font-medium text-slate-700">{location}</span>
      )}
    </div>
  )
}

function BrandingHeader({ branding }: { branding: PollBranding }) {
  const img = branding.logo_url ?? branding.icon_url
  if (!img && !branding.name) return null
  return (
    <div className="mb-5 flex items-center justify-center gap-2.5">
      {img && <img src={img} alt={branding.name ?? 'Brand'} className="h-9 max-w-[200px] object-contain" />}
      {branding.name && (
        <span className={`font-semibold ${img ? 'text-sm text-slate-700' : 'text-lg text-[var(--accent-text)]'}`}>{branding.name}</span>
      )}
    </div>
  )
}

/** "10:00 your time" — prefixed with the viewer-local DATE ("Thu 11 Jun,
 *  10:00 your time") whenever the slot falls on a different calendar day in
 *  the viewer's zone than in the poll's. Without the prefix, a slot late in
 *  the poll's evening reads as the wrong day for a viewer further east — for
 *  a confirmed meeting that's a missed-by-a-day bug. */
function viewerTimeNote(timeText: string, inst: Date, pollTz: string, viewerTz: string): string {
  const prefix = sameCalendarDay(inst, pollTz, viewerTz) ? '' : `${formatDateHeading(inst, viewerTz)}, `
  return `${prefix}${timeText} your time`
}

function groupByDay(slots: Slot[]): [string, Slot[]][] {
  const groups = new Map<string, Slot[]>()
  for (const s of slots) {
    const day = slotDayKey(s)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(s)
  }
  return [...groups.entries()]
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-4 py-20 text-center text-slate-500">{children}</div>
}

/** Shown when a poll fails to load (network hiccup, backend warming up on the
 *  first navigation right after creation). The load already auto-retries; this
 *  gives a one-click retry so the visitor never has to hard-refresh the page. */
function LoadError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-slate-900">Couldn't load this poll</h1>
      <p className="mt-2 text-slate-600">{message ?? 'Something went wrong.'}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-orange-600 px-5 font-semibold text-white hover:bg-orange-700"
      >
        Try again
      </button>
    </div>
  )
}

function NotFound({ pollBase }: { pollBase: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-slate-900">Poll not found</h1>
      <p className="mt-2 text-slate-600">This poll may have been removed, or the link is wrong.</p>
      <a href={pollBase} className="mt-4 inline-block text-sm font-medium text-orange-600 hover:underline">Create a new poll →</a>
    </div>
  )
}
