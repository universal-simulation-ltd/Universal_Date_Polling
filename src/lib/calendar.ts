// "Add to calendar" helpers — turn a poll slot into an .ics file and into
// Google / Outlook "add event" deep-links. Pure string builders (no date
// library), so they're unit-testable in isolation; only `downloadIcs` touches
// the DOM.
//
// A timed slot ('times' mode) becomes a normal timed VEVENT anchored to a UTC
// instant, so it lands at the right wall-clock time in every attendee's own
// calendar regardless of their zone. A whole-day slot ('days' mode) becomes an
// all-day event on that calendar date — no timezone conversion, exactly as the
// poll page renders it (2 June is 2 June everywhere).

import type { Poll, Slot } from './types'
import { addCalendarDays, slotDayKey, slotEnd, slotInstant } from './time'

interface CalendarEventBase {
  title: string
  /** Free-text body; the poll link is appended by the builders. */
  description: string
  /** Poll page URL, surfaced as the event URL / in the body. */
  url: string
  /** Event location — a meeting link or physical place — or '' when the poll has
   *  none. Carried into ICS LOCATION and the Google/Outlook deep-links. */
  location: string
}

/** A calendar event is EITHER timed (absolute start/end instants) or all-day
 *  (inclusive start + exclusive end calendar dates) — never both. Modelled as a
 *  discriminated union on `allDay` so each variant only carries the fields it
 *  actually has; no `Date(NaN)` / '' sentinels for the inapplicable half, and the
 *  builders get compile-time narrowing when they branch on `allDay`. */
export type CalendarEvent =
  | (CalendarEventBase & {
      allDay: false
      /** Absolute start/end instants. */
      start: Date
      end: Date
    })
  | (CalendarEventBase & {
      allDay: true
      /** Inclusive start date + exclusive end date, 'YYYY-MM-DD'. */
      startDay: string
      endDay: string
    })

/** Build the calendar event for a single poll slot. `pollUrl` is the public
 *  poll page link, woven into the event body so an attendee can get back to it. */
export function eventForSlot(poll: Poll, slot: Slot, pollUrl: string): CalendarEvent {
  const title = poll.title.trim() || 'Meeting'
  const location = poll.location?.trim() || ''
  const description = `Scheduled with Universal Date Polling.${pollUrl ? `\n\nView or update the poll: ${pollUrl}` : ''}`

  if (poll.mode === 'days') {
    const startDay = slotDayKey(slot)
    return {
      title, description, url: pollUrl, location, allDay: true,
      startDay, endDay: addCalendarDays(startDay, 1),
    }
  }

  const start = slotInstant(slot.start, poll.timezone)
  const end = slotEnd(start, slot.durationMins)
  return { title, description, url: pollUrl, location, allDay: false, start, end }
}

// ── ICS ─────────────────────────────────────────────────────────────────────

/** RFC 5545 VCALENDAR wrapping a single VEVENT for the slot. `now` is injectable
 *  purely so tests get a stable DTSTAMP; production passes the real clock. */
export function buildIcs(poll: Poll, slot: Slot, pollUrl: string, now: Date = new Date()): string {
  const ev = eventForSlot(poll, slot, pollUrl)
  const uid = `${poll.id}-${slot.id}@polling.unisim.co.uk`

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UNI SIM//Universal Date Polling//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${icsStampUtc(now)}`,
    `SUMMARY:${escapeIcs(ev.title)}`,
    `DESCRIPTION:${escapeIcs(ev.description)}`,
  ]
  if (ev.location) lines.push(`LOCATION:${escapeIcs(ev.location)}`)
  if (pollUrl) lines.push(`URL:${escapeIcs(pollUrl)}`)

  if (ev.allDay) {
    lines.push(`DTSTART;VALUE=DATE:${ev.startDay.replace(/-/g, '')}`)
    lines.push(`DTEND;VALUE=DATE:${ev.endDay.replace(/-/g, '')}`)
  } else {
    lines.push(`DTSTART:${icsStampUtc(ev.start)}`)
    lines.push(`DTEND:${icsStampUtc(ev.end)}`)
  }

  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.map(foldIcsLine).join('\r\n')
}

/** Trigger a browser download of the slot's .ics. DOM-only; not unit-tested. */
export function downloadIcs(poll: Poll, slot: Slot, pollUrl: string): void {
  const ics = buildIcs(poll, slot, pollUrl)
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${slugify(poll.title)}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

// ── Web calendar deep-links ───────────────────────────────────────────────────

/** Google Calendar "create event" URL. Timed events use UTC (…Z) stamps so no
 *  `ctz` is needed; all-day uses date-only with an exclusive end date. */
export function googleCalendarUrl(poll: Poll, slot: Slot, pollUrl: string): string {
  const ev = eventForSlot(poll, slot, pollUrl)
  const dates = ev.allDay
    ? `${ev.startDay.replace(/-/g, '')}/${ev.endDay.replace(/-/g, '')}`
    : `${icsStampUtc(ev.start)}/${icsStampUtc(ev.end)}`
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: ev.title,
    dates,
    details: ev.description,
  })
  if (ev.location) params.set('location', ev.location)
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

/** Outlook (Office 365 web) "compose event" deep-link. Timed events pass ISO
 *  instants; all-day passes date-only with an exclusive end date. */
export function outlookCalendarUrl(poll: Poll, slot: Slot, pollUrl: string): string {
  const ev = eventForSlot(poll, slot, pollUrl)
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: ev.title,
    body: ev.description,
    allday: String(ev.allDay),
  })
  if (ev.location) params.set('location', ev.location)
  if (ev.allDay) {
    params.set('startdt', ev.startDay)
    params.set('enddt', ev.endDay)
  } else {
    params.set('startdt', ev.start.toISOString())
    params.set('enddt', ev.end.toISOString())
  }
  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`
}

// ── Formatting internals ──────────────────────────────────────────────────────

/** 'YYYYMMDDTHHMMSSZ' in UTC — the ICS/Google basic-format UTC stamp. */
function icsStampUtc(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
}

/** Escape a text value for ICS: backslash, semicolon, comma and newlines. */
function escapeIcs(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

const utf8 = new TextEncoder()

/** Fold a content line to the RFC 5545 75-OCTET limit (CRLF + a leading space
 *  on continuations, the space counting toward that line's 75). Measures UTF-8
 *  octets and iterates by code point, so a fold can never split a multi-byte
 *  character or an emoji's surrogate pair — SUMMARY/DESCRIPTION carry the
 *  user's poll title, which is unconstrained Unicode. */
function foldIcsLine(line: string): string {
  if (utf8.encode(line).length <= 75) return line
  const chunks: string[] = []
  let current = ''
  let octets = 0
  for (const ch of line) { // for..of iterates code points, not UTF-16 units
    const w = utf8.encode(ch).length
    if (octets + w > 75) {
      chunks.push(current)
      current = ' '
      octets = 1
    }
    current += ch
    octets += w
  }
  chunks.push(current)
  return chunks.join('\r\n')
}

/** Filesystem-safe slug for the .ics filename. */
function slugify(title: string): string {
  const s = title.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  return s ? `${s}-invite` : 'invite'
}
