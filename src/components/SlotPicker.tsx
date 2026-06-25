import { useState } from 'react'
import type { PollMode, Slot } from '../lib/types'
import { shortId } from '../lib/api'
import CalendarWeekView from './CalendarWeekView'

const DURATIONS = [15, 30, 45, 60, 90, 120]
const ALL_DAY_MINS = 1440

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

/** Builds the candidate list for a poll. In 'times' mode slots are wall-clock
 *  times in the poll's timezone; in 'days' mode each slot is a whole day. */
export default function SlotPicker({ mode, slots, onChange }: { mode: PollMode; slots: Slot[]; onChange: (s: Slot[]) => void }) {
  if (mode === 'days') return <DayPicker slots={slots} onChange={onChange} />
  return <TimePicker slots={slots} onChange={onChange} />
}

/** Whole-day availability — the host picks days, respondents tick whole days. */
function DayPicker({ slots, onChange }: { slots: Slot[]; onChange: (s: Slot[]) => void }) {
  const today = localDate(new Date())
  const [date, setDate] = useState('')
  const [warning, setWarning] = useState<string | null>(null)

  function add() {
    if (!date) return
    setWarning(null)
    if (date < today) { setWarning("You can't pick a day in the past."); return }
    if (slots.some((s) => s.start.slice(0, 10) === date)) return
    const next = [...slots, { id: shortId(6), start: `${date}T00:00`, durationMins: ALL_DAY_MINS }]
    next.sort((a, b) => a.start.localeCompare(b.start))
    onChange(next)
    setDate('')
  }

  const days = [...slots].sort((a, b) => a.start.localeCompare(b.start))

  return (
    <div>
      <div className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col text-xs font-medium text-slate-600">
          Day
          <input
            type="date"
            min={today}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>
        <button
          type="button"
          onClick={add}
          disabled={!date}
          className="h-10 px-4 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add day
        </button>
      </div>

      {warning && <p className="mt-2 text-sm font-medium text-amber-600">{warning}</p>}

      {days.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">
          No days yet — pick a date above and press <span className="font-medium">Add day</span>.
        </p>
      ) : (
        <div className="mt-4 flex flex-wrap gap-2">
          {days.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-text)]"
            >
              {fmtDay(s.start.slice(0, 10))}
              <button
                type="button"
                onClick={() => onChange(slots.filter((x) => x.id !== s.id))}
                aria-label={`Remove ${fmtDay(s.start.slice(0, 10))}`}
                className="ml-0.5 -mr-1 grid h-4 w-4 place-items-center rounded-full text-[var(--accent-text)]/70 hover:bg-white/60 hover:text-[var(--accent-strong)]"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/** Timed slots — the original date + time + length picker, with a calendar. */
function TimePicker({ slots, onChange }: { slots: Slot[]; onChange: (s: Slot[]) => void }) {
  const today = localDate(new Date())
  const [view, setView] = useState<'form' | 'calendar'>('form')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(60)
  const [warning, setWarning] = useState<string | null>(null)

  function add() {
    if (!date || !time) return
    setWarning(null)

    // Roll a past selection forward to the next future occurrence of that time.
    // Slots are wall-clock; compare against the user's local clock — close
    // enough for picking candidate times, and never proposes a slot in the past.
    let start = `${date}T${time}`
    let d = new Date(start)
    const now = new Date()
    if (d.getTime() <= now.getTime()) {
      d = new Date(`${today}T${time}`)
      while (d.getTime() <= now.getTime()) d.setDate(d.getDate() + 1)
      start = `${localDate(d)}T${time}`
      setWarning(`You can't pick a time in the past — moved it forward to ${fmtDay(localDate(d))}, ${time}.`)
    }

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
    const day = s.start.slice(0, 10)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(s)
  }

  return (
    <div>
      {/* View toggle: the quick date/time form, or a Google-Calendar-style week
          grid you drag on to propose times. Both edit the same slot list. */}
      <div className="mb-3 inline-flex rounded-lg border border-slate-300 p-0.5 text-xs font-medium">
        <button
          type="button"
          onClick={() => setView('form')}
          aria-pressed={view === 'form'}
          className={
            'rounded-md px-3 py-1.5 transition-colors ' +
            (view === 'form' ? 'bg-[var(--accent)] text-white' : 'text-slate-600 hover:bg-slate-100')
          }
        >
          Date &amp; time
        </button>
        <button
          type="button"
          onClick={() => setView('calendar')}
          aria-pressed={view === 'calendar'}
          className={
            'rounded-md px-3 py-1.5 transition-colors ' +
            (view === 'calendar' ? 'bg-[var(--accent)] text-white' : 'text-slate-600 hover:bg-slate-100')
          }
        >
          Calendar
        </button>
      </div>

      {view === 'calendar' ? (
        <CalendarWeekView slots={slots} onChange={onChange} />
      ) : (
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
      )}
    </div>
  )
}
