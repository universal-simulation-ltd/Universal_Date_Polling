import { useState } from 'react'
import type { Slot } from '../lib/types'
import { shortId } from '../lib/api'
import { formatTime, slotDayKey, slotInstant, tzAbbrev, wallClockExists } from '../lib/time'
import CalendarWeekView from './CalendarWeekView'

const DURATIONS = [15, 30, 45, 60, 90, 120]
const ALL_DAY_MINS = 1440

/** The three ways to propose availability — the first two are timed, the last
 *  switches the whole poll to whole-day mode. Drives the segmented selector. */
export type SlotView = 'form' | 'calendar' | 'days'

/** Local (not UTC) YYYY-MM-DD for a Date — keeps the date input's `min` and the
 *  rollforward comparison on the user's own calendar day. */
function localDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function fmtDay(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).format(d)
}

function durationLabel(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = mins / 60
  return Number.isInteger(h) ? `${h}h` : `${Math.floor(mins / 60)}h${mins % 60}m`
}

/** Builds the candidate list for a poll. The segmented selector chooses between
 *  two timed views (quick form / drag calendar) and whole-day mode; `view` is
 *  owned by the parent so it can derive the poll mode and clear incompatible
 *  slots when crossing the timed↔days boundary. */
export default function SlotPicker({
  view, onViewChange, slots, onChange, timezone,
}: {
  view: SlotView
  onViewChange: (v: SlotView) => void
  slots: Slot[]
  onChange: (s: Slot[]) => void
  /** The poll's timezone — used to warn when a proposed time falls in a DST
   *  spring-forward gap (and so wouldn't exist on the clock that night). */
  timezone: string
}) {
  return (
    <div>
      {/* Date & time / Calendar both edit timed slots, so they sit in one group;
          Whole days is a separate mode, set apart with a gap. */}
      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium">
        <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
          <SelectorTab view={view} value="form" onSelect={onViewChange}>Date &amp; time</SelectorTab>
          <SelectorTab view={view} value="calendar" onSelect={onViewChange}>Calendar</SelectorTab>
        </div>
        <div className="inline-flex rounded-lg border border-slate-300 p-0.5">
          <SelectorTab view={view} value="days" onSelect={onViewChange}>Whole days</SelectorTab>
        </div>
      </div>

      {view === 'days' ? (
        <DayPicker slots={slots} onChange={onChange} />
      ) : view === 'calendar' ? (
        <CalendarWeekView slots={slots} onChange={onChange} />
      ) : (
        <FormPicker slots={slots} onChange={onChange} timezone={timezone} />
      )}
    </div>
  )
}

function SelectorTab({
  view, value, onSelect, children,
}: {
  view: SlotView
  value: SlotView
  onSelect: (v: SlotView) => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={view === value}
      className={
        'rounded-md px-3 py-1.5 transition-colors ' +
        (view === value ? 'bg-[var(--accent)] text-white' : 'text-slate-600 hover:bg-slate-100')
      }
    >
      {children}
    </button>
  )
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_YEAR = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' })

/** Whole-day availability — a month calendar you click to highlight days.
 *  Days are pure calendar dates ('YYYY-MM-DD'), never converted through a
 *  timezone, so they read the same for the host and every responder. */
function DayPicker({ slots, onChange }: { slots: Slot[]; onChange: (s: Slot[]) => void }) {
  const now = new Date()
  const todayStr = localDate(now)
  const [cursor, setCursor] = useState(() => ({ y: now.getFullYear(), m: now.getMonth() }))

  const selected = new Set(slots.map((s) => slotDayKey(s)))

  function toggle(dateStr: string) {
    if (dateStr < todayStr) return
    if (selected.has(dateStr)) {
      onChange(slots.filter((s) => slotDayKey(s) !== dateStr))
    } else {
      const next = [...slots, { id: shortId(6), start: `${dateStr}T00:00`, durationMins: ALL_DAY_MINS }]
      next.sort((a, b) => a.start.localeCompare(b.start))
      onChange(next)
    }
  }

  const first = new Date(cursor.y, cursor.m, 1)
  const lead = (first.getDay() + 6) % 7 // days before the 1st, Monday-first
  const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate()
  // Don't let the host page back into fully-past months.
  const canPrev = cursor.y > now.getFullYear() || (cursor.y === now.getFullYear() && cursor.m > now.getMonth())

  const cells: (string | null)[] = []
  for (let i = 0; i < lead; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${cursor.y}-${String(cursor.m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)
  }

  const chosen = [...selected].sort()

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCursor(({ y, m }) => (m === 0 ? { y: y - 1, m: 11 } : { y, m: m - 1 }))}
          disabled={!canPrev}
          aria-label="Previous month"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent"
        >
          ‹
        </button>
        <span className="text-sm font-semibold text-slate-800">{MONTH_YEAR.format(first)}</span>
        <button
          type="button"
          onClick={() => setCursor(({ y, m }) => (m === 11 ? { y: y + 1, m: 0 } : { y, m: m + 1 }))}
          aria-label="Next month"
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
        >
          ›
        </button>
      </div>

      {/* Day grid — click a day to highlight it */}
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1 text-[11px] font-medium text-slate-400">{w}</div>
        ))}
        {cells.map((dateStr, i) => {
          if (dateStr === null) return <div key={`b${i}`} />
          const past = dateStr < todayStr
          const sel = selected.has(dateStr)
          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => toggle(dateStr)}
              disabled={past}
              aria-pressed={sel}
              aria-label={fmtDay(dateStr)}
              className={
                'h-9 rounded-md text-sm transition-colors ' +
                (sel
                  ? 'bg-[var(--accent)] text-white font-semibold'
                  : past
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-[var(--accent-soft)]')
              }
            >
              {Number(dateStr.slice(8, 10))}
            </button>
          )
        })}
      </div>

      {chosen.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No days yet — click the days you want to propose.</p>
      ) : (
        <div className="mt-3">
          <div className="text-xs font-medium text-slate-500">{chosen.length} day{chosen.length > 1 ? 's' : ''} selected</div>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {chosen.map((dateStr) => (
              <span
                key={dateStr}
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-text)]"
              >
                {fmtDay(dateStr)}
                <button
                  type="button"
                  onClick={() => toggle(dateStr)}
                  aria-label={`Remove ${fmtDay(dateStr)}`}
                  className="ml-0.5 -mr-1 grid h-4 w-4 place-items-center rounded-full text-[var(--accent-text)]/70 hover:bg-white/60 hover:text-[var(--accent-strong)]"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/** Timed slots — the original quick date + time + length form. */
function FormPicker({ slots, onChange, timezone }: { slots: Slot[]; onChange: (s: Slot[]) => void; timezone: string }) {
  const today = localDate(new Date())
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(60)
  const [warning, setWarning] = useState<string | null>(null)

  function add() {
    if (!date || !time) return

    // Roll a past selection forward to the next future occurrence of that time.
    // Slots are wall-clock; compare against the user's local clock — close
    // enough for picking candidate times, and never proposes a slot in the past.
    let start = `${date}T${time}`
    let d = new Date(start)
    const now = new Date()
    let msg: string | null = null
    if (d.getTime() <= now.getTime()) {
      d = new Date(`${today}T${time}`)
      while (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1)
      start = `${localDate(d)}T${time}`
      msg = `You can't pick a time in the past — moved it forward to ${fmtDay(localDate(d))}, ${time}.`
    }

    // Spring-forward DST gap: on the switch night the clocks jump (e.g. London
    // 01:00→02:00), so a time inside the gap never happens on the wall clock and
    // silently resolves an hour later. Warn rather than block — the host may
    // still want the (shifted) slot, they just shouldn't be surprised by it.
    if (!msg && !wallClockExists(start, timezone)) {
      const inst = slotInstant(start, timezone)
      msg = `Heads up — ${time} doesn't exist on ${fmtDay(start.slice(0, 10))} in ${tzAbbrev(timezone, inst)}: the clocks skip forward that night, so this slot lands at ${formatTime(inst, timezone)}.`
    }
    setWarning(msg)

    if (slots.some((s) => s.start === start)) return
    const next = [...slots, { id: shortId(6), start, durationMins: duration }]
    next.sort((a, b) => a.start.localeCompare(b.start))
    onChange(next)
  }

  function remove(id: string) {
    onChange(slots.filter((s) => s.id !== id))
  }

  const groups = new Map<string, Slot[]>()
  for (const s of slots) {
    const day = slotDayKey(s)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(s)
  }

  return (
    <>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-xs font-medium text-slate-600">
          Date
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>
        <label className="flex flex-col text-xs font-medium text-slate-600">
          Time
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="mt-1 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>
        <label className="flex flex-col text-xs font-medium text-slate-600">
          Length
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 h-10 rounded-lg border border-slate-300 px-2 text-sm text-slate-900 focus:border-[var(--accent)] outline-none"
          >
            {DURATIONS.map((d) => (
              <option key={d} value={d}>{durationLabel(d)}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={add}
          disabled={!date || !time}
          className="h-10 px-4 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add time
        </button>
      </div>

      {warning && (
        <p className="mt-2 text-sm font-medium text-amber-600">{warning}</p>
      )}

      {slots.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No times yet — pick a date and time above and press <span className="font-medium">Add time</span>.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {[...groups.entries()].map(([day, list]) => (
            <div key={day}>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{fmtDay(day)}</div>
              <div className="mt-1.5 flex flex-wrap gap-2">
                {list.map((s) => (
                  <span
                    key={s.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-text)]"
                  >
                    {s.start.slice(11)} · {durationLabel(s.durationMins)}
                    <button
                      type="button"
                      onClick={() => remove(s.id)}
                      aria-label={`Remove ${day} ${s.start.slice(11)}`}
                      className="ml-0.5 -mr-1 grid h-4 w-4 place-items-center rounded-full text-[var(--accent-text)]/70 hover:bg-white/60 hover:text-[var(--accent-strong)]"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
