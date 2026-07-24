// Timezone helpers built on the platform Intl API — no date library needed.

import type { Poll, Slot } from './types'

/** The viewer's IANA timezone, or 'UTC' if it can't be resolved. */
export function localTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
}

/** A de-duplicated list of IANA zones for the picker — the full platform list
 *  where available (modern browsers), else a curated fallback. */
export function listTimezones(): string[] {
  try {
    const fn = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf
    const all = fn?.('timeZone')
    if (all && all.length) return all
  } catch {
    /* fall through */
  }
  return FALLBACK_ZONES
}

/** Filter a list of IANA zones by a free-text query for the searchable picker.
 *  Both the query and each zone are normalised so '/' and '_' read as spaces —
 *  so "new york" matches "America/New_York" and "london" matches
 *  "Europe/London". An empty query returns the list unchanged. */
export function filterTimezones(query: string, zones: string[]): string[] {
  const norm = (s: string) => s.toLowerCase().replace(/[\s_/]+/g, ' ').trim()
  const q = norm(query)
  if (!q) return zones
  return zones.filter((z) => norm(z).includes(q))
}

const FALLBACK_ZONES = [
  'UTC',
  'Europe/London', 'Europe/Dublin', 'Europe/Paris', 'Europe/Berlin', 'Europe/Madrid',
  'Europe/Rome', 'Europe/Amsterdam', 'Europe/Lisbon', 'Europe/Athens', 'Europe/Moscow',
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'America/Toronto', 'America/Sao_Paulo', 'America/Mexico_City',
  'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Hong_Kong', 'Asia/Shanghai',
  'Asia/Tokyo', 'Asia/Seoul',
  'Australia/Sydney', 'Australia/Perth', 'Pacific/Auckland',
]

/** Offset (ms) of `tz` from UTC at the given instant. */
function tzOffsetMs(tz: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
  const p = dtf.formatToParts(date).reduce<Record<string, string>>((a, x) => {
    if (x.type !== 'literal') a[x.type] = x.value
    return a
  }, {})
  // '24' for midnight in some engines — normalise to 0.
  const hour = p.hour === '24' ? 0 : +p.hour
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, hour, +p.minute, +p.second)
  return asUTC - date.getTime()
}

/** Convert a wall-clock string ('YYYY-MM-DDTHH:mm') in `tz` to a UTC instant. */
export function zonedWallClockToInstant(local: string, tz: string): Date {
  const guess = new Date(local.length === 16 ? local + ':00Z' : local + 'Z')
  const offset = tzOffsetMs(tz, guess)
  const candidate = new Date(guess.getTime() - offset)
  // Re-check once to settle DST boundaries.
  const offset2 = tzOffsetMs(tz, candidate)
  return offset2 === offset ? candidate : new Date(guess.getTime() - offset2)
}

export function slotInstant(start: string, pollTz: string): Date {
  return zonedWallClockToInstant(start, pollTz)
}

/** The end instant of a slot, `durationMins` after its start. The single source
 *  of slot end-instant math — both the on-page range label and the calendar
 *  event builder derive their end from here so they can never drift apart. */
export function slotEnd(start: Date, durationMins: number): Date {
  return new Date(start.getTime() + durationMins * 60_000)
}

/** The calendar day ('YYYY-MM-DD') a slot sits on. A slot's `start` is a bare
 *  'YYYY-MM-DDTHH:mm' wall-clock string (or 'YYYY-MM-DDT00:00' in days mode), so
 *  the day is its leading 10 chars — the accessor for grouping and days-mode use
 *  so the shape isn't re-sliced by hand across the app. */
export function slotDayKey(slot: Pick<Slot, 'start'>): string {
  return slot.start.slice(0, 10)
}

/** True when a slot's viewer-local time should be spelled out alongside the
 *  poll-timezone time: only for timed polls whose timezone differs from the
 *  viewer's. Whole-day polls carry no time-of-day, so there's nothing to note. */
export function needsTzNote(poll: Pick<Poll, 'mode' | 'timezone'>, viewerTz: string): boolean {
  return poll.mode !== 'days' && poll.timezone !== viewerTz
}

/** Add whole days to a 'YYYY-MM-DD' string, staying in the pure calendar frame
 *  (UTC arithmetic, no local-DST drift) — for exclusive all-day end dates and
 *  other date-string maths. Distinct from `addLocalDays`, which walks a `Date`
 *  in the viewer's local frame; keep the two apart (different timezone frames). */
export function addCalendarDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d + n)).toISOString().slice(0, 10)
}

/** Add whole days to a `Date` in the viewer's LOCAL frame — for stepping the
 *  week grid, where "the next day" means the user's own next calendar day.
 *  Distinct from `addCalendarDays` (pure date-string, UTC frame). */
export function addLocalDays(d: Date, n: number): Date {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

/** Whether a wall-clock time actually exists in `tz`. On a spring-forward DST
 *  night the clocks jump (e.g. London 01:00→02:00), so a time inside the gap
 *  (01:30) is not a real instant — it silently resolves an hour later. Detect it
 *  by round-tripping: convert to an instant, format that instant back in `tz`,
 *  and check the wall-clock survived unchanged. */
export function wallClockExists(local: string, tz: string): boolean {
  const inst = zonedWallClockToInstant(local, tz)
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(inst).reduce<Record<string, string>>((a, p) => {
    if (p.type !== 'literal') a[p.type] = p.value
    return a
  }, {})
  const hh = parts.hour === '24' ? '00' : parts.hour
  return `${hh}:${parts.minute}` === local.slice(11, 16)
}

/** "Mon 2 Jun 2026" for a WHOLE-DAY slot — a pure calendar date with no
 *  timezone conversion at all. A whole-day poll's date carries no time-of-day,
 *  so it must read identically for every viewer regardless of their zone:
 *  2 June is 2 June in London and Paris alike. Building the Date from numeric
 *  parts (local midnight) and formatting without a `timeZone` keeps construction
 *  and formatting in the same (local) frame, so the day can never roll over. */
export function formatCalendarDay(dateStr: string): string {
  const [y, m, d] = dateStr.slice(0, 10).split('-').map(Number)
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

/** "Tue 10 Jun" for the date heading of a slot, in the given display tz. */
export function formatDateHeading(instant: Date, displayTz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: displayTz, weekday: 'short', day: 'numeric', month: 'short',
  }).format(instant)
}

/** "10:00" — the start time of a slot, in the given display tz. */
export function formatTime(instant: Date, displayTz: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: displayTz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(instant)
}

/** "10:00–11:00" given a start instant + duration, in the display tz. */
export function formatRange(instant: Date, durationMins: number, displayTz: string): string {
  const end = slotEnd(instant, durationMins)
  return `${formatTime(instant, displayTz)}–${formatTime(end, displayTz)}`
}

/** True when `instant` falls on the same calendar day in both zones. Decides
 *  whether a viewer-local time needs its date spelled out — a slot late in the
 *  poll's evening can be the NEXT day for a viewer further east, and a bare
 *  "10:00 your time" under a poll-timezone date heading then points at the
 *  wrong day. */
export function sameCalendarDay(instant: Date, tzA: string, tzB: string): boolean {
  const day = (tz: string) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit',
    }).format(instant)
  return day(tzA) === day(tzB)
}

/** Short tz label, e.g. "GMT+1" appended to the IANA name where useful. */
export function tzAbbrev(tz: string, at: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, timeZoneName: 'short' }).formatToParts(at)
    return parts.find((p) => p.type === 'timeZoneName')?.value ?? tz
  } catch {
    return tz
  }
}
