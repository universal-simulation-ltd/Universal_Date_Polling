// "Suggest some times" — with a calendar connected, the create screen can fill
// in a handful of candidate slots from the host's own free time instead of
// making them draw every one by hand.
//
// Everything here is pure. It takes the busy segments `hostCalendar` already
// derives for the week grid (per-day wall-clock minutes in the poll's
// timezone) and returns wall-clock slot shapes in that same frame, so a
// suggestion lands exactly where the shading says the host is free. Ids are
// minted by the caller, which keeps this module free of app dependencies.

import type { Slot } from './types'
import type { DaySegment } from './hostCalendar'
import { addCalendarDays, calendarWeekday, slotDayKey } from './time'

/** The working window suggestions stay inside: 10:00–16:00 wall-clock in the
 *  poll's timezone ("keep it between 10 and 4"). A suggestion starts no earlier
 *  than 10:00 and ends no later than 16:00. */
export const WINDOW_START_MIN = 10 * 60
export const WINDOW_END_MIN = 16 * 60

/** Noon divides a day in two. A day contributes at most one option each side,
 *  so a host is never offered two mornings on the same day — and four
 *  suggestions can't all land in one afternoon. A slot is classified by where
 *  it *starts*, so an 11:30 hour still counts as the morning one. */
export const MIDDAY_MIN = 12 * 60

/** Afternoons are searched from 13:00 first, and only fall back into the
 *  12:00–13:00 hour when nothing later fits — a free lunch hour is usually free
 *  for a reason, but proposing it beats proposing nothing. */
const AFTERNOON_PREFERRED_MIN = 13 * 60

/** Suggested starts land on the same 30-minute grid the week view snaps drags
 *  to, so a suggested slot looks like a hand-drawn one. */
const SNAP_MIN = 30

/** How many options one click proposes. */
export const SUGGEST_COUNT = 4

/** A proposed slot, minus the id — see the module note. */
export interface SuggestedSlot {
  /** Wall-clock 'YYYY-MM-DDTHH:mm' in the poll's timezone, as `Slot.start`. */
  start: string
  durationMins: number
}

export interface SuggestInput {
  /** Busy segments by wall-clock day in the poll's timezone — exactly what
   *  `busySegmentsByDay` returns. */
  busyByDay: Map<string, DaySegment[]>
  /** First day to consider ('YYYY-MM-DD', poll timezone). */
  fromDay: string
  /** How many days forward to scan, `fromDay` included. Weekends are skipped
   *  but still counted, so this is a calendar reach, not a working-day count. */
  days: number
  /** Earliest allowed start on `fromDay` in wall-clock minutes — "now" plus
   *  whatever notice the caller wants to give, so a suggestion is never in the
   *  past (or ten minutes away). Ignored on later days. */
  fromMin?: number
  durationMins: number
  count?: number
  /** Slots the poll already carries. Their times are treated as busy, so a
   *  second click adds four *more* options rather than four duplicates. */
  existing?: readonly Pick<Slot, 'start' | 'durationMins'>[]
}

type Half = 'morning' | 'afternoon'

/** Ranges of candidate starts for a half-day, in preference order. */
function searchRanges(half: Half): { fromMin: number; toMin: number }[] {
  if (half === 'morning') return [{ fromMin: WINDOW_START_MIN, toMin: MIDDAY_MIN }]
  return [
    { fromMin: AFTERNOON_PREFERRED_MIN, toMin: WINDOW_END_MIN },
    { fromMin: MIDDAY_MIN, toMin: AFTERNOON_PREFERRED_MIN },
  ]
}

function otherHalf(half: Half): Half {
  return half === 'morning' ? 'afternoon' : 'morning'
}

/** Minutes since midnight of a wall-clock 'YYYY-MM-DDTHH:mm' start. */
function minutesOf(start: string): number {
  return Number(start.slice(11, 13)) * 60 + Number(start.slice(14, 16))
}

function hhmm(min: number): string {
  return `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`
}

/** The first start on the snap grid that fits `durationMins` inside the working
 *  window without touching a busy segment, or null if the day's half is full. */
function firstFreeStart(
  ranges: { fromMin: number; toMin: number }[],
  busy: DaySegment[],
  durationMins: number,
  earliestMin: number,
): number | null {
  const lastStart = WINDOW_END_MIN - durationMins
  for (const r of ranges) {
    const from = Math.max(r.fromMin, earliestMin, WINDOW_START_MIN)
    for (
      let start = Math.ceil(from / SNAP_MIN) * SNAP_MIN;
      start < r.toMin && start <= lastStart;
      start += SNAP_MIN
    ) {
      const end = start + durationMins
      if (!busy.some((b) => b.fromMin < end && start < b.toMin)) return start
    }
  }
  return null
}

/** Pick up to `count` candidate times out of the host's free time.
 *
 *  Weekdays only, 10:00–16:00, at most one morning and one afternoon per day.
 *  Spread beats density: the first pass takes one option per day (alternating
 *  which half of the day it tries first, so the set isn't four identical 10am
 *  slots), and only once the days run out does a second pass double up on days
 *  that already worked. */
export function suggestFreeSlots({
  busyByDay, fromDay, days, fromMin = 0, durationMins, count = SUGGEST_COUNT, existing = [],
}: SuggestInput): SuggestedSlot[] {
  if (durationMins <= 0 || count <= 0) return []

  // What a suggestion has to dodge: real busy time, plus anything the poll
  // already proposes. Copied out of the caller's map so we can add to it as we
  // pick, without mutating the shading the grid is drawing from.
  const blocked = new Map<string, DaySegment[]>()
  for (const [day, segs] of busyByDay) blocked.set(day, [...segs])
  const block = (day: string, seg: DaySegment) => {
    const list = blocked.get(day)
    if (list) list.push(seg)
    else blocked.set(day, [seg])
  }
  for (const s of existing) {
    const from = minutesOf(s.start)
    block(slotDayKey(s), { fromMin: from, toMin: from + s.durationMins })
  }

  const picked: SuggestedSlot[] = []
  const usedHalves = new Map<string, Set<Half>>()
  // The half the last successful pick landed in — the alternation follows what
  // was actually taken, not the count, so a day that falls back to its
  // afternoon doesn't leave the next day preferring an afternoon too.
  let lastHalf: Half | null = null

  const take = (day: string, half: Half): boolean => {
    const earliest = day === fromDay ? fromMin : 0
    const start = firstFreeStart(searchRanges(half), blocked.get(day) ?? [], durationMins, earliest)
    if (start == null) return false
    picked.push({ start: `${day}T${hhmm(start)}`, durationMins })
    block(day, { fromMin: start, toMin: start + durationMins })
    const halves = usedHalves.get(day) ?? new Set<Half>()
    halves.add(half)
    usedHalves.set(day, halves)
    lastHalf = half
    return true
  }

  const weekdays: string[] = []
  for (let i = 0, day = fromDay; i < days; i++, day = addCalendarDays(day, 1)) {
    const w = calendarWeekday(day)
    if (w >= 1 && w <= 5) weekdays.push(day)
  }

  // Pass 1 — one option per day, in day order.
  for (const day of weekdays) {
    if (picked.length >= count) break
    const prefer: Half = lastHalf ? otherHalf(lastHalf) : 'morning'
    if (!take(day, prefer)) take(day, otherHalf(prefer))
  }

  // Pass 2 — the days ran out before the options did, so double up on the days
  // that worked: their other half, never a second slot in the same one.
  for (const day of weekdays) {
    if (picked.length >= count) break
    const halves = usedHalves.get(day)
    // No entry means the whole day was busy — both halves were already tried.
    if (!halves) continue
    for (const half of ['morning', 'afternoon'] as const) {
      if (picked.length >= count) break
      if (!halves.has(half)) take(day, half)
    }
  }

  picked.sort((a, b) => a.start.localeCompare(b.start))
  return picked
}
