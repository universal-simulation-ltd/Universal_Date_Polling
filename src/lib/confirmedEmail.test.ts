import { describe, expect, it } from 'vitest'
import { buildConfirmedEmail, guestEmailsForSlot, uniqueEmails, type ConfirmedEmailPoll } from './confirmedEmail'
import type { Slot } from './types'

const POLL_URL = 'https://opensource.unisim.co.uk/polling/p/abc123'
const slot: Slot = { id: 's1', start: '2026-06-10T14:00', durationMins: 60 }

function poll(overrides: Partial<ConfirmedEmailPoll> = {}): ConfirmedEmailPoll {
  return { title: 'Project kickoff', timezone: 'Europe/London', mode: 'times', location: null, ...overrides }
}

describe('guestEmailsForSlot', () => {
  const responses = [
    { name: 'Sam', availability: { s1: 'yes' as const } },
    { name: 'Alex', availability: { s1: 'maybe' as const } },
    { name: 'Jo', availability: { s1: 'no' as const } },
    { name: 'Kim', availability: { s2: 'yes' as const } },
  ]
  const contacts = [
    { name: 'Sam', email: 'sam@example.com' },
    { name: 'Alex', email: 'alex@example.com' },
    { name: 'Jo', email: 'jo@example.com' },
    { name: 'Kim', email: 'kim@example.com' },
  ]

  it('invites the yeses and the if-need-bes, and nobody else', () => {
    expect(guestEmailsForSlot(responses, contacts, 's1')).toEqual(['sam@example.com', 'alex@example.com'])
  })

  it('matches names however they were capitalised or spaced', () => {
    expect(guestEmailsForSlot([{ name: ' sam ', availability: { s1: 'yes' } }], [{ name: 'Sam', email: 'sam@example.com' }], 's1'))
      .toEqual(['sam@example.com'])
  })

  it('skips someone who was free but left no address', () => {
    expect(guestEmailsForSlot([{ name: 'Pat', availability: { s1: 'yes' } }], contacts, 's1')).toEqual([])
  })
})

describe('uniqueEmails', () => {
  it('keeps one of each address, whatever its case, first spelling first', () => {
    expect(uniqueEmails([
      { name: 'Sam', email: 'Sam@Example.com' },
      { name: 'Sam W', email: 'sam@example.com ' },
      { name: 'Alex', email: 'alex@example.com' },
    ])).toEqual(['Sam@Example.com', 'alex@example.com'])
  })
})

describe('buildConfirmedEmail', () => {
  it('says what was confirmed, when, in which zone, with the poll link', () => {
    const { subject, body } = buildConfirmedEmail(poll(), slot, { url: POLL_URL })
    expect(subject).toBe('Time confirmed: Project kickoff')
    expect(body).toContain('The time for Project kickoff is confirmed:')
    expect(body).toContain('Wed, 10 Jun 2026 at 14:00–15:00 BST')
    expect(body).toContain(POLL_URL)
  })

  it('writes the time in the zone the host is looking at', () => {
    const { body } = buildConfirmedEmail(poll(), slot, { displayTz: 'America/New_York' })
    // en-GB has no short name for New York, so the zone reads "GMT-4" — the
    // same label the page itself shows.
    expect(body).toContain('Wed, 10 Jun 2026 at 09:00–10:00 GMT-4')
  })

  it('gives a whole-day poll its date and no time', () => {
    const { body } = buildConfirmedEmail(poll({ mode: 'days' }), { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 })
    expect(body).toContain('Wed, 10 Jun 2026')
    expect(body).not.toContain('00:00')
  })

  it('adds the location when there is one, and drops the link line without a URL', () => {
    const { body } = buildConfirmedEmail(poll({ location: 'Meeting room 5' }), slot)
    expect(body).toContain('Where: Meeting room 5')
    expect(body).not.toContain('from the poll:')
  })

  it('still reads when the poll has no title', () => {
    const { subject, body } = buildConfirmedEmail(poll({ title: '  ' }), slot)
    expect(subject).toBe('Time confirmed')
    expect(body).toContain("We've confirmed a time:")
  })
})
