// Host-calendar overlay (Phase 3) — the create screen can shade the times the
// host is already busy, read from their connected Google / Microsoft calendar.
//
// The API half wraps the calendar-oauth / calendar-freebusy Edge Functions
// (tokens live server-side, service-role only — never in this app). The pure
// half converts the UTC busy intervals those functions return into per-day
// wall-clock segments for the week grid, and is unit-tested in isolation.

import type { SupabaseClient } from '@supabase/supabase-js'
import { addCalendarDays, zonedDayAndMinute, zonedWallClockToInstant } from './time'

export type CalendarProvider = 'google' | 'microsoft'

export interface BusyInterval {
  /** ISO UTC instants. */
  start: string
  end: string
  /** The event's title, where the connected grant can read one. Absent is a
   *  real state rather than a missing value: a Google connection made before
   *  the detail scope existed (2026-08-25) genuinely cannot see it, and the UI
   *  shows an anonymous block plus a reconnect prompt rather than an error. */
  title?: string
}

export interface ProviderStatus {
  connected: boolean
  email: string | null
  /** Whether the stored grant can also CREATE events, i.e. whether the
   *  confirmed time can be written into this calendar. Separate from
   *  `connected` on purpose: a connection made before the write scope existed
   *  (2026-08-13) is connected and not writable, and the only fix is to
   *  reconnect — so the UI has to be able to tell those apart. */
  writable: boolean
  /** Whether the stored grant can read event TITLES, as opposed to only "busy".
   *  Reported separately from `connected` for the same reason `writable` is:
   *  a Google connection made before the detail scope existed is connected and
   *  anonymous, and only a reconnect changes that. Always true for Microsoft —
   *  Calendars.Read has always permitted `subject`. */
  detailed: boolean
}

export interface CalendarStatus {
  /** Which provider OAuth apps exist server-side; an unconfigured provider is
   *  hidden in the UI entirely. */
  configured: { google: boolean; microsoft: boolean }
  google: ProviderStatus
  microsoft: ProviderStatus
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

/** Tolerates a server that predates `writable` by defaulting it to false — the
 *  safe direction, since the alternative is offering a button that 403s.
 *
 *  Exported for the tests: the two optional flags want OPPOSITE defaults, and
 *  a wrong one is invisible until a host is looking at it. */
export function providerStatusOf(raw: unknown): ProviderStatus {
  const r = (raw ?? {}) as Partial<ProviderStatus>
  return {
    connected: !!r.connected,
    email: r.email ?? null,
    writable: !!r.writable,
    // ⚠️ Missing means TRUE here, the opposite of `writable` above, and the
    // asymmetry is the point. A server that predates this field is one where
    // NOTHING reads titles, so defaulting to false would put "reconnect to
    // show event names" under every row — including Microsoft's, which has
    // always been able to read them — offering a fix for a problem the
    // reconnect would not solve. `writable` defaults the other way because
    // there the wrong guess offers a button that 403s.
    detailed: r.detailed === undefined ? true : !!r.detailed,
  }
}

export async function calendarStatus(client: SupabaseClient): Promise<CalendarStatus> {
  const d = await invokeCalendarOauth(client, { action: 'status' })
  return {
    configured: d.configured,
    google: providerStatusOf(d.google),
    microsoft: providerStatusOf(d.microsoft),
  }
}

/** Which providers exist server-side — the one unauthenticated action, so the
 *  create screen can offer a signed-out guest the verify-and-connect prompt.
 *  Configuration only; it can never reveal anyone's connections. */
export async function calendarConfigured(client: SupabaseClient): Promise<{ google: boolean; microsoft: boolean }> {
  const d = await invokeCalendarOauth(client, { action: 'configured' })
  return d.configured as { google: boolean; microsoft: boolean }
}

/** Returns the provider consent URL to open in a popup. The flow ends with the
 *  edge function 302ing the popup to this app's own static
 *  `calendar-connected.html`, which postMessages
 *  `{type:'unisim-calendar', ok, provider}` back to the opener (same-origin)
 *  and closes itself — so the function needs our base URL, not just the
 *  origin (the app is path-routed under /polling/ in production). */
/** `scope` decides how much we ask the provider for. Connecting from the create
 *  screen asks for 'read' — free/busy is all the overlay needs, and it is what
 *  the copy beside the button promises. 'write' is asked for only from the
 *  confirmed banner's "Reconnect … to add it", i.e. at the moment a host has
 *  actually asked us to put something in their diary. Keeping them apart means
 *  a provider that refuses the wider consent still leaves the overlay working. */
export async function startCalendarConnect(
  client: SupabaseClient,
  provider: CalendarProvider,
  scope: 'read' | 'write' = 'read',
): Promise<string> {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  const d = await invokeCalendarOauth(client, { action: 'start', provider, base, scope })
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
  /** Whether each provider's read could see titles this time round. */
  detailed: { google: boolean; microsoft: boolean }
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
    // Missing means true, for the same reason as in `providerStatusOf`: a
    // server that predates the field reads no titles at all, so claiming the
    // grant is the reason would be a lie with a useless remedy attached.
    detailed: {
      google: data.detailed?.google === undefined ? true : !!data.detailed.google,
      microsoft: data.detailed?.microsoft === undefined ? true : !!data.detailed.microsoft,
    },
  }
}

// ── Writing the confirmed time back ──────────────────────────────────────────

/** Outcome of a write, per provider. `read_only` is the interesting one: the
 *  host IS connected, but under the pre-2026-08-13 free/busy-only grant, so the
 *  fix is to reconnect rather than to retry. */
export type ProviderWriteStatus = 'ok' | 'none' | 'read_only' | 'reconnect' | 'error'

export interface CalendarWriteResult {
  /** Providers the event actually landed in. */
  providers: Partial<Record<CalendarProvider, ProviderWriteStatus>>
  touched: CalendarProvider[]
}

async function invokeCalendarEvent(
  client: SupabaseClient,
  body: Record<string, unknown>,
  failureMessage: string,
): Promise<CalendarWriteResult> {
  const { data, error } = await client.functions.invoke('calendar-event', { body })
  if (error) {
    const ctx = (error as { context?: Response }).context
    if (ctx) {
      const parsed = await ctx.json().catch(() => null)
      if (parsed?.error) throw new Error(parsed.error)
    }
    throw new Error(failureMessage)
  }
  if (!data?.ok) throw new Error(data?.error ?? failureMessage)
  return {
    providers: (data.providers ?? {}) as Partial<Record<CalendarProvider, ProviderWriteStatus>>,
    touched: ((data.added ?? data.removed ?? []) as CalendarProvider[]),
  }
}

/** Host-only: create (or move) the confirmed time in every connected,
 *  write-capable calendar. Safe to call twice — the server updates the event it
 *  already made rather than duplicating it. */
export async function addConfirmedTimeToCalendar(
  client: SupabaseClient,
  pollId: string,
): Promise<CalendarWriteResult> {
  return invokeCalendarEvent(
    client,
    { action: 'add', pollId },
    "Couldn't add this to your calendar.",
  )
}

/** Host-only: take the event back out (used when un-confirming). */
export async function removeConfirmedTimeFromCalendar(
  client: SupabaseClient,
  pollId: string,
): Promise<CalendarWriteResult> {
  return invokeCalendarEvent(
    client,
    { action: 'remove', pollId },
    "Couldn't remove this from your calendar.",
  )
}

// ── Pure overlay math ────────────────────────────────────────────────────────

export interface DaySegment {
  /** Wall-clock minutes since that day's midnight, in the poll's timezone. */
  fromMin: number
  toMin: number
  /** Titles of every event that went into this block, in start order and
   *  deduplicated. Empty for an anonymous block. A list rather than a string
   *  because the grid renders them as separate lines and the `title` attribute
   *  joins them differently. */
  titles?: string[]
}

/** Merge overlapping/adjacent segments so double-booked (or twice-fetched)
 *  intervals paint as one clean block.
 *
 *  ⚠️ The titles of everything that went into a block are KEPT, not replaced.
 *  Dropping all but the first is the obvious implementation and it quietly
 *  hides one of a host's two overlapping meetings behind the name of the
 *  other — the same trap the server's `mergeIntervals` has. Deduplicated
 *  because one meeting can arrive from two connected calendars. */
export function mergeSegments(segs: DaySegment[]): DaySegment[] {
  const sorted = [...segs].sort((a, b) => a.fromMin - b.fromMin)
  const out: DaySegment[] = []
  for (const s of sorted) {
    const last = out[out.length - 1]
    if (last && s.fromMin <= last.toMin) {
      if (s.toMin > last.toMin) last.toMin = s.toMin
      if (s.titles?.length) last.titles = [...new Set([...(last.titles ?? []), ...s.titles])]
    } else {
      out.push({ ...s, ...(s.titles?.length ? { titles: [...new Set(s.titles)] } : {}) })
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
    // An overnight event is named on EVERY day it covers. The alternative —
    // naming only the day it starts — leaves the second half of a red-eye as an
    // unexplained block, which is the thing titles exist to stop.
    const titles = iv.title ? { titles: [iv.title] } : {}
    // Guard: an interval spanning more days than any fetch range is malformed.
    for (let guard = 0; t < end && guard < 100; guard++) {
      const p = zonedDayAndMinute(t, tz)
      const e = zonedDayAndMinute(end, tz)
      if (e.day === p.day) {
        push(p.day, { fromMin: p.min, toMin: e.min, ...titles })
        break
      }
      push(p.day, { fromMin: p.min, toMin: 1440, ...titles })
      t = zonedWallClockToInstant(`${addCalendarDays(p.day, 1)}T00:00`, tz)
    }
  }

  const out = new Map<string, DaySegment[]>()
  for (const [day, segs] of raw) out.set(day, mergeSegments(segs))
  return out
}
