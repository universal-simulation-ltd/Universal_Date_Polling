// Timezone helpers built on the platform Intl API — no date library needed.

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
  const end = new Date(instant.getTime() + durationMins * 60_000)
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
