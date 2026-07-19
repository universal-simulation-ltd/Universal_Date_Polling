import { describe, expect, it } from 'vitest'
import { buildIcs, eventForSlot, googleCalendarUrl, outlookCalendarUrl } from './calendar'
import type { Poll, Slot } from './types'

// A fixed clock so DTSTAMP is deterministic.
const NOW = new Date('2026-06-01T09:00:00Z')

function timedPoll(overrides: Partial<Poll> = {}): Poll {
  return {
    id: 'abc123',
    title: 'Project kickoff',
    host_email: 'host@example.com',
    host_user_id: 'u1',
    timezone: 'Europe/London', // BST (+01:00) in June
    mode: 'times',
    slots: [],
    theme: 'orange',
    branding: null,
    final_slot_id: null,
    notify_on_response: false,
    created_at: NOW.toISOString(),
    expires_at: null,
    ...overrides,
  }
}

const timedSlot: Slot = { id: 's1', start: '2026-06-10T14:00', durationMins: 60 }
const POLL_URL = 'https://opensource.unisim.co.uk/polling/p/abc123'

describe('eventForSlot', () => {
  it('converts a timed slot from the poll timezone to a UTC instant', () => {
    // 14:00 BST (UTC+1) => 13:00Z start, +60min => 14:00Z end.
    const ev = eventForSlot(timedPoll(), timedSlot, POLL_URL)
    expect(ev.allDay).toBe(false)
    expect(ev.start.toISOString()).toBe('2026-06-10T13:00:00.000Z')
    expect(ev.end.toISOString()).toBe('2026-06-10T14:00:00.000Z')
    expect(ev.description).toContain(POLL_URL)
  })

  it('treats a days-mode slot as an all-day event with an exclusive end date', () => {
    const poll = timedPoll({ mode: 'days' })
    const ev = eventForSlot(poll, { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 }, POLL_URL)
    expect(ev.allDay).toBe(true)
    expect(ev.startDay).toBe('2026-06-10')
    expect(ev.endDay).toBe('2026-06-11')
  })

  it('rolls the exclusive end date over a month boundary', () => {
    const poll = timedPoll({ mode: 'days' })
    const ev = eventForSlot(poll, { id: 'd1', start: '2026-06-30T00:00', durationMins: 0 }, POLL_URL)
    expect(ev.endDay).toBe('2026-07-01')
  })
})

describe('buildIcs', () => {
  it('emits a valid timed VEVENT with UTC stamps and CRLF line endings', () => {
    const ics = buildIcs(timedPoll(), timedSlot, POLL_URL, NOW)
    expect(ics).toContain('\r\n')
    expect(ics).toMatch(/^BEGIN:VCALENDAR/)
    expect(ics).toContain('BEGIN:VEVENT')
    expect(ics).toContain('UID:abc123-s1@polling.unisim.co.uk')
    expect(ics).toContain('DTSTAMP:20260601T090000Z')
    expect(ics).toContain('DTSTART:20260610T130000Z')
    expect(ics).toContain('DTEND:20260610T140000Z')
    expect(ics).toContain('SUMMARY:Project kickoff')
    expect(ics.trimEnd().endsWith('END:VCALENDAR')).toBe(true)
  })

  it('emits DATE-typed DTSTART/DTEND for an all-day event', () => {
    const poll = timedPoll({ mode: 'days' })
    const ics = buildIcs(poll, { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 }, POLL_URL, NOW)
    expect(ics).toContain('DTSTART;VALUE=DATE:20260610')
    expect(ics).toContain('DTEND;VALUE=DATE:20260611')
  })

  it('escapes special characters in the summary', () => {
    const ics = buildIcs(timedPoll({ title: 'Lunch, drinks; then talk' }), timedSlot, POLL_URL, NOW)
    expect(ics).toContain('SUMMARY:Lunch\\, drinks\\; then talk')
  })

  // RFC 5545 folding is a 75-OCTET limit and must never split a code point.
  // The poll title is unconstrained Unicode, so emoji/CJK have to survive.
  it('folds long lines at 75 octets without splitting surrogate pairs', () => {
    // 66 leading chars put the first emoji's surrogate pair exactly across the
    // old char-count fold boundary (index 74–75 of "SUMMARY:" + title).
    const title = 'x'.repeat(66) + '🎉🎉🎉🎉🎉 and then some more text to force several folds'
    const ics = buildIcs(timedPoll({ title }), timedSlot, POLL_URL, NOW)

    const encoder = new TextEncoder()
    const loneSurrogate = /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/
    for (const line of ics.split('\r\n')) {
      expect(loneSurrogate.test(line)).toBe(false)
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
    }
    // Unfolding (CRLF + space removal) must reproduce the escaped title intact.
    const unfolded = ics.replace(/\r\n[ ]/g, '')
    expect(unfolded).toContain(`SUMMARY:${title}`)
  })

  it('keeps every folded line within 75 octets for multi-byte (CJK) titles', () => {
    const title = '会議の候補日について皆さんの都合を教えてください'.repeat(4) // 3 octets/char
    const ics = buildIcs(timedPoll({ title }), timedSlot, POLL_URL, NOW)
    const encoder = new TextEncoder()
    for (const line of ics.split('\r\n')) {
      expect(encoder.encode(line).length).toBeLessThanOrEqual(75)
    }
    expect(ics.replace(/\r\n[ ]/g, '')).toContain(`SUMMARY:${title}`)
  })
})

describe('googleCalendarUrl', () => {
  it('builds a timed template link with a UTC date range', () => {
    const url = googleCalendarUrl(timedPoll(), timedSlot, POLL_URL)
    const u = new URL(url)
    expect(u.origin + u.pathname).toBe('https://calendar.google.com/calendar/render')
    expect(u.searchParams.get('action')).toBe('TEMPLATE')
    expect(u.searchParams.get('text')).toBe('Project kickoff')
    expect(u.searchParams.get('dates')).toBe('20260610T130000Z/20260610T140000Z')
  })

  it('builds an all-day range with date-only values', () => {
    const poll = timedPoll({ mode: 'days' })
    const url = googleCalendarUrl(poll, { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 }, POLL_URL)
    expect(new URL(url).searchParams.get('dates')).toBe('20260610/20260611')
  })
})

describe('outlookCalendarUrl', () => {
  it('builds a timed compose link with ISO instants', () => {
    const url = outlookCalendarUrl(timedPoll(), timedSlot, POLL_URL)
    const u = new URL(url)
    expect(u.origin + u.pathname).toBe('https://outlook.office.com/calendar/0/deeplink/compose')
    expect(u.searchParams.get('subject')).toBe('Project kickoff')
    expect(u.searchParams.get('allday')).toBe('false')
    expect(u.searchParams.get('startdt')).toBe('2026-06-10T13:00:00.000Z')
    expect(u.searchParams.get('enddt')).toBe('2026-06-10T14:00:00.000Z')
  })

  it('builds an all-day compose link with date-only values', () => {
    const poll = timedPoll({ mode: 'days' })
    const url = outlookCalendarUrl(poll, { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 }, POLL_URL)
    const u = new URL(url)
    expect(u.searchParams.get('allday')).toBe('true')
    expect(u.searchParams.get('startdt')).toBe('2026-06-10')
    expect(u.searchParams.get('enddt')).toBe('2026-06-11')
  })
})
