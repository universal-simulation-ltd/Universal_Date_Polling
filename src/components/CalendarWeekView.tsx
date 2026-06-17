import { useEffect, useRef, useState } from 'react'
import type { Slot } from '../lib/types'
import { shortId } from '../lib/api'

/* A Google-Calendar-style week view for proposing candidate times. The host
 * clicks-and-drags down a day column to draw a slot (snapped to 30 minutes), or
 * single-clicks to drop a default 1-hour slot; existing slots render as blocks
 * that delete on click. Slots use the same wall-clock `start` (YYYY-MM-DDTHH:mm)
 * + `durationMins` contract as the form picker, so the two views are
 * interchangeable. */

const START_HOUR = 6
const END_HOUR = 23 // last gridline; columns run START_HOUR..END_HOUR
const HOUR_PX = 44
const SNAP = 30 // minutes
const DEFAULT_DURATION = 60
const DAY_MIN = START_HOUR * 60
const END_MIN = END_HOUR * 60
const TOTAL_PX = (END_HOUR - START_HOUR) * HOUR_PX

function localDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function minToHHMM(min: number): string {
  const h = Math.floor(min / 60)
  const m = min % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`
}

function hourLabel(h: number): string {
  const ampm = h < 12 ? 'am' : 'pm'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}${ampm}`
}

function durationLabel(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = mins / 60
  return Number.isInteger(h) ? `${h}h` : `${Math.floor(mins / 60)}h${mins % 60}m`
}

function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const dow = (x.getDay() + 6) % 7 // 0 = Monday
  x.setDate(x.getDate() - dow)
  return x
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

interface DragState {
  dayIdx: number
  fromMin: number
  toMin: number
  moved: boolean
}

interface MoveState {
  id: string
  dayIdx: number
  startMin: number // live preview start (snapped)
  durationMins: number
  grabOffset: number // raw minutes between the pointer and the slot's start at grab
  moved: boolean
}

export default function CalendarWeekView({
  slots,
  onChange,
}: {
  slots: Slot[]
  onChange: (s: Slot[]) => void
}) {
  const todayStart = startOfWeek(new Date())
  const [weekStart, setWeekStart] = useState<Date>(todayStart)
  // `drag` state drives the live preview; `dragRef` mirrors it so the pointer
  // handlers read the current gesture synchronously (a fast click fires
  // pointerdown + pointerup before a state update would land).
  const [drag, setDrag] = useState<DragState | null>(null)
  const dragRef = useRef<DragState | null>(null)
  // `move` drives the live preview while an existing slot is being dragged to a
  // new time; `moveRef` mirrors it for synchronous reads in pointer handlers.
  const [move, setMove] = useState<MoveState | null>(null)
  const moveRef = useRef<MoveState | null>(null)
  // After a move gesture the browser still fires a click on the slot button;
  // this flag swallows that one click so a drag doesn't also delete the slot.
  const suppressClickRef = useRef(false)
  const [warning, setWarning] = useState<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  function setDragBoth(d: DragState | null) {
    dragRef.current = d
    setDrag(d)
  }

  function setMoveBoth(m: MoveState | null) {
    moveRef.current = m
    setMove(m)
  }

  // Open the grid scrolled to ~8am rather than the 6am top edge.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = (8 - START_HOUR) * HOUR_PX
  }, [])

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
  const atFirstWeek = weekStart.getTime() <= todayStart.getTime()
  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const todayStr = localDate(now)

  function yToRawMin(clientY: number, colEl: HTMLElement): number {
    const rect = colEl.getBoundingClientRect()
    return DAY_MIN + ((clientY - rect.top) / HOUR_PX) * 60
  }

  function yToMin(clientY: number, colEl: HTMLElement): number {
    const snapped = Math.round(yToRawMin(clientY, colEl) / SNAP) * SNAP
    return Math.max(DAY_MIN, Math.min(END_MIN, snapped))
  }

  function commit(dayIdx: number, fromMin: number, toMin: number, moved: boolean) {
    const lo = Math.min(fromMin, toMin)
    const hi = Math.max(fromMin, toMin)
    // A click (no meaningful drag) drops a default-length slot; a drag uses the
    // swept range. Either way clamp the end to the bottom of the grid.
    let startMin = lo
    let dur = moved && hi - lo >= SNAP ? hi - lo : DEFAULT_DURATION
    if (startMin + dur > END_MIN) {
      if (END_MIN - dur >= DAY_MIN) startMin = END_MIN - dur
      else dur = END_MIN - startMin
    }
    const day = days[dayIdx]
    const start = `${localDate(day)}T${minToHHMM(startMin)}`

    if (new Date(start).getTime() <= Date.now()) {
      setWarning("That time has already passed — pick a future slot.")
      return
    }
    if (slots.some((s) => s.start === start)) {
      setWarning('You already proposed that time.')
      return
    }
    setWarning(null)
    const next = [...slots, { id: shortId(6), start, durationMins: dur }]
    next.sort((a, b) => a.start.localeCompare(b.start))
    onChange(next)
  }

  function remove(id: string) {
    onChange(slots.filter((s) => s.id !== id))
  }

  // Reposition an existing slot to a new start time on the same day, keeping its
  // duration. Rejects past times and collisions with other slots (ignoring the
  // slot itself); a no-op move silently does nothing.
  function commitMove(id: string, dayIdx: number, startMin: number) {
    const start = `${localDate(days[dayIdx])}T${minToHHMM(startMin)}`
    if (slots.some((s) => s.id === id && s.start === start)) return
    if (new Date(start).getTime() <= Date.now()) {
      setWarning("That time has already passed — pick a future slot.")
      return
    }
    if (slots.some((s) => s.id !== id && s.start === start)) {
      setWarning('You already proposed that time.')
      return
    }
    setWarning(null)
    const next = slots.map((s) => (s.id === id ? { ...s, start } : s))
    next.sort((a, b) => a.start.localeCompare(b.start))
    onChange(next)
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-semibold text-slate-700">
          {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(days[0])} –{' '}
          {new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(days[6])}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
            disabled={atFirstWeek}
            aria-label="Previous week"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(todayStart)}
            className="h-8 px-3 rounded-lg border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            This week
          </button>
          <button
            type="button"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
            aria-label="Next week"
            className="grid h-8 w-8 place-items-center rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
          >
            ›
          </button>
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500">
        Click a day to drop a 1-hour slot, or drag down a column to set the length. Drag a slot to move it within the day; click it to remove.
      </p>

      {/* Day headers */}
      <div className="mt-3 grid" style={{ gridTemplateColumns: `3rem repeat(7, minmax(0, 1fr))` }}>
        <div />
        {days.map((d) => {
          const isToday = localDate(d) === todayStr
          return (
            <div key={d.toISOString()} className="px-1 pb-1 text-center">
              <div className="text-[11px] uppercase tracking-wide text-slate-400">
                {new Intl.DateTimeFormat('en-GB', { weekday: 'short' }).format(d)}
              </div>
              <div
                className={
                  'mx-auto mt-0.5 grid h-6 w-6 place-items-center rounded-full text-xs font-semibold ' +
                  (isToday ? 'bg-[var(--accent)] text-white' : 'text-slate-700')
                }
              >
                {d.getDate()}
              </div>
            </div>
          )
        })}
      </div>

      {/* Scrollable time grid */}
      <div
        ref={scrollRef}
        className="mt-1 max-h-[460px] overflow-y-auto rounded-lg border border-slate-200"
      >
        <div className="grid" style={{ gridTemplateColumns: `3rem repeat(7, minmax(0, 1fr))` }}>
          {/* Hour gutter */}
          <div className="relative" style={{ height: TOTAL_PX }}>
            {Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i).map((h) => (
              <div
                key={h}
                className="absolute right-1.5 -translate-y-1/2 text-[10px] tabular-nums text-slate-400"
                style={{ top: (h - START_HOUR) * HOUR_PX }}
              >
                {hourLabel(h)}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day, dayIdx) => {
            const dayStr = localDate(day)
            const isToday = dayStr === todayStr
            const isPastDay = dayStr < todayStr
            const daySlots = slots.filter((s) => s.start.slice(0, 10) === dayStr)
            return (
              <div
                key={day.toISOString()}
                className="relative border-l border-slate-200 touch-none select-none"
                style={{
                  height: TOTAL_PX,
                  backgroundImage: `repeating-linear-gradient(to bottom, transparent, transparent ${HOUR_PX - 1}px, #e2e8f0 ${HOUR_PX - 1}px, #e2e8f0 ${HOUR_PX}px)`,
                }}
                onPointerDown={(e) => {
                  if ((e.target as HTMLElement).closest('[data-slot]')) return
                  e.preventDefault()
                  const m = yToMin(e.clientY, e.currentTarget)
                  try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* synthetic */ }
                  setDragBoth({ dayIdx, fromMin: m, toMin: m, moved: false })
                }}
                onPointerMove={(e) => {
                  const prev = dragRef.current
                  if (!prev || prev.dayIdx !== dayIdx) return
                  const m = yToMin(e.clientY, e.currentTarget)
                  if (m === prev.toMin && prev.moved) return
                  setDragBoth({ ...prev, toMin: m, moved: prev.moved || m !== prev.fromMin })
                }}
                onPointerUp={(e) => {
                  const g = dragRef.current
                  if (!g || g.dayIdx !== dayIdx) return
                  const m = yToMin(e.clientY, e.currentTarget)
                  commit(dayIdx, g.fromMin, m, g.moved || m !== g.fromMin)
                  setDragBoth(null)
                }}
                onPointerCancel={() => setDragBoth(null)}
              >
                {/* Past shading: whole day if before today, or up to "now" today */}
                {isPastDay && <div className="pointer-events-none absolute inset-0 bg-slate-100/70" />}
                {isToday && nowMin > DAY_MIN && (
                  <div
                    className="pointer-events-none absolute inset-x-0 top-0 bg-slate-100/70"
                    style={{ height: Math.min(TOTAL_PX, ((Math.min(nowMin, END_MIN) - DAY_MIN) / 60) * HOUR_PX) }}
                  />
                )}

                {/* Drag preview */}
                {drag && drag.dayIdx === dayIdx && (() => {
                  const lo = Math.min(drag.fromMin, drag.toMin)
                  const hi = Math.max(drag.fromMin, drag.toMin)
                  const dur = drag.moved && hi - lo >= SNAP ? hi - lo : DEFAULT_DURATION
                  return (
                    <div
                      className="pointer-events-none absolute inset-x-0.5 rounded-md bg-[var(--accent)]/30 ring-1 ring-[var(--accent)]"
                      style={{ top: ((lo - DAY_MIN) / 60) * HOUR_PX, height: Math.max(HOUR_PX / 2, (dur / 60) * HOUR_PX) }}
                    />
                  )
                })()}

                {/* Existing slots */}
                {daySlots.map((s) => {
                  const storedMin = Number(s.start.slice(11, 13)) * 60 + Number(s.start.slice(14, 16))
                  const isMoving = move?.id === s.id
                  const sMin = isMoving ? move!.startMin : storedMin
                  const top = ((sMin - DAY_MIN) / 60) * HOUR_PX
                  const height = Math.max(HOUR_PX / 2, (s.durationMins / 60) * HOUR_PX)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      data-slot
                      onPointerDown={(e) => {
                        e.stopPropagation()
                        suppressClickRef.current = false
                        try { e.currentTarget.setPointerCapture(e.pointerId) } catch { /* synthetic */ }
                        const col = e.currentTarget.parentElement as HTMLElement
                        const raw = yToRawMin(e.clientY, col)
                        setMoveBoth({
                          id: s.id,
                          dayIdx,
                          startMin: storedMin,
                          durationMins: s.durationMins,
                          grabOffset: raw - storedMin,
                          moved: false,
                        })
                      }}
                      onPointerMove={(e) => {
                        const prev = moveRef.current
                        if (!prev || prev.id !== s.id) return
                        const col = e.currentTarget.parentElement as HTMLElement
                        const raw = yToRawMin(e.clientY, col)
                        const snapped = Math.round((raw - prev.grabOffset) / SNAP) * SNAP
                        const start = Math.max(DAY_MIN, Math.min(END_MIN - prev.durationMins, snapped))
                        if (start === prev.startMin && prev.moved) return
                        setMoveBoth({ ...prev, startMin: start, moved: prev.moved || start !== storedMin })
                      }}
                      onPointerUp={() => {
                        const g = moveRef.current
                        setMoveBoth(null)
                        if (!g || g.id !== s.id || !g.moved) return
                        suppressClickRef.current = true
                        if (g.startMin !== storedMin) commitMove(s.id, dayIdx, g.startMin)
                      }}
                      onPointerCancel={() => setMoveBoth(null)}
                      onClick={() => {
                        if (suppressClickRef.current) { suppressClickRef.current = false; return }
                        remove(s.id)
                      }}
                      title={`Drag to move · click to remove ${s.start.slice(11)} · ${durationLabel(s.durationMins)}`}
                      className={
                        'group absolute inset-x-0.5 overflow-hidden rounded-md bg-[var(--accent)] px-1.5 py-0.5 text-left text-[11px] font-medium text-white shadow-sm ring-1 ring-[var(--accent-strong)] hover:bg-[var(--accent-strong)] ' +
                        (isMoving ? 'cursor-grabbing ring-2 z-10' : 'cursor-grab')
                      }
                      style={{ top, height }}
                    >
                      <span className="flex items-center justify-between gap-1">
                        <span className="truncate">{minToHHMM(sMin)}</span>
                        <span aria-hidden className="opacity-0 group-hover:opacity-100">✕</span>
                      </span>
                      <span className="block text-[10px] opacity-80">{durationLabel(s.durationMins)}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {warning && <p className="mt-2 text-sm font-medium text-amber-600">{warning}</p>}
    </div>
  )
}
