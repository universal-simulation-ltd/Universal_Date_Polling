// Host-calendar overlay (Phase 3) — the create screen can shade the times the
// host is already busy, read from their connected Google / Microsoft calendar.
//
// The API half wraps the calendar-oauth / calendar-freebusy Edge Functions
// (tokens live server-side, service-role only — never in this app). The pure
// half converts the UTC busy intervals those functions return into per-day
// wall-clock segments for the week grid, and is unit-tested in isolation.

import type { SupabaseClient } from '@supabase/supabase-js'
import { addCalendarDays, zonedWallClockToInstant } from './time'

export type CalendarProvider = 'google' | 'microsoft'

export interface BusyInterval {
  /** ISO UTC instants. */
  start: string
  end: string
}

export interface CalendarStatus {
  /** Which provider OAuth apps exist server-side; an unconfigured provider is
   *  hidden in the UI entirely. */
  configured: { google: boolean; microsoft: boolean }
  google: { connected: boolean; email: string | null }
  microsoft: { connected: boolean; email: string | null }
}

// ── Edge-function wrappers ───────────────────────────────────────────────────
// `client` must hold the host's session (suite client for Universal ID users,
// the app's OTP client for guests) — both functions key everything off the
// caller's uid.

async function invokeCalendarOauth(client: SupabaseClient, body: Record<string, unknown>) {
  const { data, error } = await client.functions.invoke('calendar-oauth', { body })
  if (error) {
    const ctx = (error as { context?: Response }).context
    if (ctx) {
      const parsed = await ctx.json().catch(() => null)
      if (parsed?.error) throw new Error(parsed.error)
    }
    throw new Error('Calendar request failed — please try again.')
  }
  if (!data?.ok) throw new Error(data?.error ?? 'Calendar request failed.')
  return data
}

export async function calendarStatus(client: SupabaseClient): Promise<CalendarStatus> {
  const d = await invokeCalendarOauth(client, { action: 'status' })
  return { configured: d.configured, google: d.google, microsoft: d.microsoft }
}

/** Returns the provider consent URL to open in a popup. The flow ends with the
 *  edge function 302ing the popup to this app's own static
 *  `calendar-connected.html`, which postMessages
 *  `{type:'unisim-calendar', ok, provider}` back to the opener (same-origin)
 *  and closes itself — so the function needs our base URL, not just the
 *  origin (the app is path-routed under /polling/ in production). */
export async function startCalendarConnect(client: SupabaseClient, provider: CalendarProvider): Promise<string> {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  const d = await invokeCalendarOauth(client, { action: 'start', provider, base })
  return d.url as string
}

export async function disconnectCalendar(client: SupabaseClient, provider: CalendarProvider): Promise<void> {
  await invokeCalendarOauth(client, { action: 'disconnect', provider })
}

/** Per-provider outcome of a free/busy fetch: 'none' = not connected,
 *  'reconnect' = the stored grant is dead (the server already deleted it),
 *  'error' = the provider read failed (e.g. the Calendar API is disabled on
 *  the OAuth project). */
export type ProviderFetchStatus = 'ok' | 'none' | 'reconnect' | 'error'

export interface FreeBusyResult {
  /** Merged busy intervals, UTC ISO. */
  busy: BusyInterval[]
  providers: { google: ProviderFetchStatus; microsoft: ProviderFetchStatus }
}

/** Busy intervals across every connected calendar for the given range, plus
 *  each provider's outcome — the overlay is a convenience, so partial data
 *  still shades, but the caller can tell the host when a read failed rather
 *  than silently showing an empty calendar. */
export async function fetchFreeBusy(
  client: SupabaseClient,
  timeMin: string,
  timeMax: string,
): Promise<FreeBusyResult> {
  const { data, error } = await client.functions.invoke('calendar-freebusy', { body: { timeMin, timeMax } })
  if (error) throw new Error('Could not load your calendar availability.')
  if (!data?.ok) throw new Error(data?.error ?? 'Could not load your calendar availability.')
  return {
    busy: (data.busy ?? []) as BusyInterval[],
    providers: {
      google: (data.providers?.google ?? 'none') as ProviderFetchStatus,
      microsoft: (data.providers?.microsoft ?? 'none') as ProviderFetchStatus,
    },
  }
}

// ── Pure overlay math ────────────────────────────────────────────────────────

export interface DaySegment {
  /** Wall-clock minutes since that day's midnight, in the poll's timezone. */
  fromMin: number
  toMin: number
}

/** Wall-clock day + minutes of a UTC instant in `tz`. */
function zonedParts(instant: Date, tz: string): { day: string; min: number } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: tz,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(instant).reduce<Record<string, string>>((a, p) => {
    if (p.type !== 'literal') a[p.type] = p.value
    return a
  }, {})
  const hour = parts.hour === '24' ? 0 : +parts.hour
  return { day: `${parts.year}-${parts.month}-${parts.day}`, min: hour * 60 + +parts.minute }
}

/** Merge overlapping/adjacent segments so double-booked (or twice-fetched)
 *  intervals paint as one clean block. */
export function mergeSegments(segs: DaySegment[]): DaySegment[] {
  const sorted = [...segs].sort((a, b) => a.fromMin - b.fromMin)
  const out: DaySegment[] = []
  for (const s of sorted) {
    const last = out[out.length - 1]
    if (last && s.fromMin <= last.toMin) {
      if (s.toMin > last.toMin) last.toMin = s.toMin
    } else {
      out.push({ ...s })
    }
  }
  return out
}

/** Split UTC busy intervals into per-day wall-clock segments in `tz` — the
 *  frame the week grid draws in (slots are wall-clock strings in the poll's
 *  timezone, so busy shading must land in the same frame or it lies whenever
 *  poll tz ≠ UTC). Intervals crossing midnight split at each midnight; the
 *  split walks real instants via `zonedWallClockToInstant`, so a 23/25-hour
 *  DST day still lands its segments on the right wall-clock minutes. */
export function busySegmentsByDay(busy: BusyInterval[], tz: string): Map<string, DaySegment[]> {
  const raw = new Map<string, DaySegment[]>()
  const push = (day: string, seg: DaySegment) => {
    if (seg.toMin <= seg.fromMin) return
    const list = raw.get(day)
    if (list) list.push(seg)
    else raw.set(day, [seg])
  }

  for (const iv of busy) {
    let t = new Date(iv.start)
    const end = new Date(iv.end)
    if (Number.isNaN(t.getTime()) || Number.isNaN(end.getTime())) continue
    // Guard: an interval spanning more days than any fetch range is malformed.
    for (let guard = 0; t < end && guard < 100; guard++) {
      const p = zonedParts(t, tz)
      const e = zonedParts(end, tz)
      if (e.day === p.day) {
        push(p.day, { fromMin: p.min, toMin: e.min })
        break
      }
      push(p.day, { fromMin: p.min, toMin: 1440 })
      t = zonedWallClockToInstant(`${addCalendarDays(p.day, 1)}T00:00`, tz)
    }
  }

  const out = new Map<string, DaySegment[]>()
  for (const [day, segs] of raw) out.set(day, mergeSegments(segs))
  return out
}
