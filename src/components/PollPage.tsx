import { useEffect, useMemo, useState } from 'react'
import type { Availability, Poll, PollBranding, PollResponse, Slot } from '../lib/types'
import { getPoll, getResponses, submitResponse } from '../lib/api'
import { SUPABASE_CONFIGURED } from '../lib/supabase'
import { themeAttr, themeVars } from '../lib/theme'
import {
  formatCalendarDay, formatDateHeading, formatRange, formatTime, localTimezone, slotInstant, tzAbbrev,
} from '../lib/time'

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

  const viewerTz = localTimezone()

  useEffect(() => {
    let live = true
    async function load() {
      if (!SUPABASE_CONFIGURED) { setState('error'); setError('Backend not configured.'); return }
      try {
        const p = await getPoll(id)
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
  }, [id])

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
    setSaving(true)
    try {
      await submitResponse(poll.id, name, availability)
      localStorage.setItem(NAME_KEY, name.trim())
      setResponses(await getResponses(poll.id))
      setSavedAt(Date.now())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your response.')
    } finally {
      setSaving(false)
    }
  }

  if (state === 'loading') return <Centered>Loading poll…</Centered>
  if (state === 'notfound') return <NotFound pollBase={pollBase} />
  if (state === 'error' || !poll) return <Centered>{error ?? 'Something went wrong.'}</Centered>

  const slots = [...poll.slots].sort((a, b) => a.start.localeCompare(b.start))
  const dayMode = poll.mode === 'days'
  const tzNote = !dayMode && poll.timezone !== viewerTz

  return (
    <div data-theme={themeAttr(poll.theme)} style={themeVars(poll.theme)} className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 sm:py-10">
      {poll.branding && <BrandingHeader branding={poll.branding} />}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 break-words">{poll.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {responses.length === 0 ? 'Be the first to respond.' : `${responses.length} ${responses.length === 1 ? 'person has' : 'people have'} responded.`}
          {!dayMode && (
            <>
              {' · '}Times in <span className="font-medium">{tzAbbrev(poll.timezone)}</span>
              {tzNote && <span className="text-slate-500"> (your timezone: {tzAbbrev(viewerTz)})</span>}
            </>
          )}
        </p>
      </header>

      {expired && (
        <div className="mt-6 rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-4 py-3 text-sm">
          This poll's link has expired — it's read-only now.
        </div>
      )}

      {/* Respond */}
      {!expired && (
        <section className="mt-7 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 pop-in">
          <h2 className="text-base font-bold text-slate-900">Your availability</h2>
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
                          {tzNote && <div className="text-xs text-slate-500">{formatTime(inst, viewerTz)} your time</div>}
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'yes')}
                            aria-pressed={v === 'yes'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'yes' ? 'bg-[var(--accent)] text-white ring-[var(--accent)]' : 'bg-white text-slate-700 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            Free
                          </button>
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'maybe')}
                            aria-pressed={v === 'maybe'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'maybe' ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] ring-[var(--accent)]' : 'bg-white text-slate-500 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            If need be
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
      <Results poll={poll} slots={slots} responses={responses} viewerTz={viewerTz} />
    </div>
  )
}

function Results({ poll, slots, responses, viewerTz }: {
  poll: Poll; slots: Slot[]; responses: PollResponse[]; viewerTz: string
}) {
  const tally = useMemo(() => {
    return slots.map((s) => {
      const yes = responses.filter((r) => r.availability[s.id] === 'yes').map((r) => r.name)
      const maybe = responses.filter((r) => r.availability[s.id] === 'maybe').map((r) => r.name)
      return { slot: s, yes, maybe }
    })
  }, [slots, responses])

  const maxYes = Math.max(0, ...tally.map((t) => t.yes.length))
  const total = responses.length
  const dayMode = poll.mode === 'days'
  const tzNote = !dayMode && poll.timezone !== viewerTz

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
                  return (
                    <div key={s.id} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-900">{dayMode ? 'All day' : formatRange(inst, s.durationMins, poll.timezone)}</span>
                          {tzNote && <span className="ml-2 text-xs text-slate-500">{formatTime(inst, viewerTz)} your time</span>}
                          {best && (
                            <span className="ml-2 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white align-middle">Best</span>
                          )}
                        </div>
                        <div className="shrink-0 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">{t.yes.length}</span>
                          {t.maybe.length > 0 && <span className="text-slate-400"> · {t.maybe.length} maybe</span>}
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div className="heat-cell h-2 rounded-full" style={{ width: `${Math.max(heat * 100, t.yes.length ? 6 : 0)}%`, ['--heat' as string]: '1' }} />
                      </div>
                      {(t.yes.length > 0 || t.maybe.length > 0) && (
                        <p className="mt-1.5 text-xs text-slate-500">
                          {t.yes.length > 0 && <span className="text-[var(--accent-text)] font-medium">{t.yes.join(', ')}</span>}
                          {t.maybe.length > 0 && <span> {t.yes.length > 0 ? '· ' : ''}maybe: {t.maybe.join(', ')}</span>}
                        </p>
                      )}
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

function groupByDay(slots: Slot[]): [string, Slot[]][] {
  const groups = new Map<string, Slot[]>()
  for (const s of slots) {
    const day = s.start.slice(0, 10)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(s)
  }
  return [...groups.entries()]
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-4 py-20 text-center text-slate-500">{children}</div>
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
