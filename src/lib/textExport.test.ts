import { describe, expect, it } from 'vitest'
import { buildPollTextList, type TextListPoll } from './textExport'

const POLL_URL = 'https://opensource.unisim.co.uk/polling/p/abc123'

function timedPoll(overrides: Partial<TextListPoll> = {}): TextListPoll {
  return {
    title: 'Project kickoff',
    timezone: 'Europe/London', // BST (+01:00) in June
    mode: 'times',
    slots: [
      { id: 's1', start: '2026-06-10T14:00', durationMins: 60 },
      { id: 's2', start: '2026-06-11T09:30', durationMins: 30 },
    ],
    location: null,
    ...overrides,
  }
}

describe('buildPollTextList', () => {
  it('numbers the slots, each carrying its own full date and time range', () => {
    const text = buildPollTextList(timedPoll())
    expect(text).toContain('1. Wed, 10 Jun 2026 at 14:00–15:00')
    expect(text).toContain('2. Thu, 11 Jun 2026 at 09:30–10:00')
  })

  it('leads with the title and names the timezone the times are written in', () => {
    const text = buildPollTextList(timedPoll())
    expect(text.split('\n')[0]).toBe('Project kickoff')
    expect(text).toContain('Which of these times work for you? All times BST.')
  })

  it('anchors the timezone label to the first slot, not to today', () => {
    // A January poll is GMT even when the list is copied in the summer.
    const text = buildPollTextList(timedPoll({
      slots: [{ id: 's1', start: '2026-01-14T10:00', durationMins: 60 }],
    }))
    expect(text).toContain('All times GMT.')
  })

  it('sorts the slots chronologically however they were stored', () => {
    const text = buildPollTextList(timedPoll({
      slots: [
        { id: 's2', start: '2026-06-11T09:30', durationMins: 30 },
        { id: 's1', start: '2026-06-10T14:00', durationMins: 60 },
      ],
    }))
    expect(text.indexOf('10 Jun')).toBeLessThan(text.indexOf('11 Jun'))
  })

  it('writes the times in the requested display timezone', () => {
    const text = buildPollTextList(timedPoll(), { displayTz: 'America/New_York' })
    // 14:00 BST is 09:00 EDT — the date is unchanged, the clock is not.
    expect(text).toContain('1. Wed, 10 Jun 2026 at 09:00–10:00')
    // en-GB names New York numerically ('GMT-4'), not 'EDT' — assert the offset
    // the platform actually produces rather than the abbreviation we'd prefer.
    expect(text).toContain('All times GMT-4.')
  })

  it('drops the time of day entirely for a whole-day poll', () => {
    const text = buildPollTextList(timedPoll({
      mode: 'days',
      slots: [
        { id: 'd1', start: '2026-06-10T00:00', durationMins: 0 },
        { id: 'd2', start: '2026-06-11T00:00', durationMins: 0 },
      ],
    }))
    expect(text).toContain('Which of these days work for you?')
    expect(text).toContain('1. Wed, 10 Jun 2026')
    expect(text).not.toMatch(/\d\d:\d\d/)
    expect(text).not.toContain('All times')
  })

  it('includes the location when the poll has one', () => {
    expect(buildPollTextList(timedPoll({ location: 'Meeting room 5' }))).toContain('Where: Meeting room 5')
    expect(buildPollTextList(timedPoll())).not.toContain('Where:')
  })

  it('adds the poll link only when asked for it', () => {
    const withLink = buildPollTextList(timedPoll(), { includeLink: true, url: POLL_URL })
    expect(withLink).toContain('Feel free to email back, or to leave your preferences here:')
    expect(withLink).toContain(POLL_URL)

    const without = buildPollTextList(timedPoll(), { includeLink: false, url: POLL_URL })
    expect(without).not.toContain(POLL_URL)
    expect(without).not.toContain('Feel free to email back')
  })

  it('never emits the invitation line without a URL to follow it', () => {
    const text = buildPollTextList(timedPoll(), { includeLink: true, url: '  ' })
    expect(text).not.toContain('Feel free to email back')
  })

  it('ends on the link, so the last line of a pasted email is the URL', () => {
    const text = buildPollTextList(timedPoll({ location: 'Meeting room 5' }), { includeLink: true, url: POLL_URL })
    const lines = text.split('\n')
    expect(lines[lines.length - 1]).toBe(POLL_URL)
    // …and the blocks stay separated by blank lines rather than running together.
    expect(text).not.toMatch(/\S\n\S*Where:/)
  })

  // ---- 1:1 booking pages ---------------------------------------------------
  // A booking page settles the time the moment the guest clicks, so the list
  // must not ask them to reply — the ask is the whole difference between the
  // two products, and it is the part a reader acts on.
  describe('booking mode', () => {
    it('asks the reader to pick rather than to say which work', () => {
      const text = buildPollTextList(timedPoll({ booking_mode: true }))
      expect(text).toContain("Pick whichever time suits you — it's booked as soon as you choose.")
      expect(text).not.toContain('Which of these times work for you?')
    })

    it('still names the timezone, anchored to the first slot', () => {
      expect(buildPollTextList(timedPoll({ booking_mode: true }))).toContain('All times BST.')
      expect(buildPollTextList(timedPoll({
        booking_mode: true,
        slots: [{ id: 's1', start: '2026-01-14T10:00', durationMins: 60 }],
      }))).toContain('All times GMT.')
    })

    it('says "day" for a whole-day booking page, and drops the times note', () => {
      const text = buildPollTextList(timedPoll({
        booking_mode: true,
        mode: 'days',
        slots: [{ id: 'd1', start: '2026-06-10T00:00', durationMins: 0 }],
      }))
      expect(text).toContain("Pick whichever day suits you — it's booked as soon as you choose.")
      expect(text).not.toContain('All times')
    })

    it('invites a booking, not an email back', () => {
      const text = buildPollTextList(timedPoll({ booking_mode: true }), { includeLink: true, url: POLL_URL })
      expect(text).toContain('Book your slot here:')
      expect(text).not.toContain('Feel free to email back')
      expect(text.split('\n').pop()).toBe(POLL_URL)
    })

    it('leaves an ordinary poll untouched', () => {
      const text = buildPollTextList(timedPoll({ booking_mode: false }), { includeLink: true, url: POLL_URL })
      expect(text).toContain('Which of these times work for you? All times BST.')
      expect(text).toContain('Feel free to email back, or to leave your preferences here:')
    })
  })
})
