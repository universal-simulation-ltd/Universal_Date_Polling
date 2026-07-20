import { describe, expect, it } from 'vitest'
import type { Poll } from './types'
import {
  addCalendarDays, addLocalDays, needsTzNote, sameCalendarDay, slotDayKey,
  slotEnd, slotInstant, tzAbbrev, wallClockExists,
} from './time'

describe('sameCalendarDay', () => {
  it('detects a midnight rollover between poll and viewer zones', () => {
    // Wed 10 Jun 18:00 in Los Angeles = Thu 11 Jun 10:00 in Tokyo.
    const inst = slotInstant('2026-06-10T18:00', 'America/Los_Angeles')
    expect(sameCalendarDay(inst, 'America/Los_Angeles', 'Asia/Tokyo')).toBe(false)
  })

  it('agrees when both zones are on the same calendar day', () => {
    // 14:00 London = 15:00 Paris — same day.
    const inst = slotInstant('2026-06-10T14:00', 'Europe/London')
    expect(sameCalendarDay(inst, 'Europe/London', 'Europe/Paris')).toBe(true)
  })

  it('handles the late-evening same-zone case trivially', () => {
    const inst = slotInstant('2026-06-10T23:30', 'Europe/London')
    expect(sameCalendarDay(inst, 'Europe/London', 'Europe/London')).toBe(true)
  })
})

describe('tzAbbrev at a specific instant', () => {
  it("reflects the slot's DST offset, not today's", () => {
    const winter = slotInstant('2026-12-14T10:00', 'Europe/London') // GMT
    const summer = slotInstant('2026-06-10T10:00', 'Europe/London') // BST
    expect(tzAbbrev('Europe/London', winter)).toBe('GMT')
    expect(tzAbbrev('Europe/London', summer)).toBe('BST')
  })
})

describe('slotEnd', () => {
  it('adds the duration in minutes to the start instant', () => {
    const start = new Date('2026-06-10T13:00:00.000Z')
    expect(slotEnd(start, 90).toISOString()).toBe('2026-06-10T14:30:00.000Z')
  })
  it('is a no-op for a zero-length slot', () => {
    const start = new Date('2026-06-10T13:00:00.000Z')
    expect(slotEnd(start, 0).getTime()).toBe(start.getTime())
  })
})

describe('slotDayKey', () => {
  it('returns the leading calendar date of a timed slot', () => {
    expect(slotDayKey({ start: '2026-06-10T14:30' })).toBe('2026-06-10')
  })
  it('returns the date of a days-mode slot', () => {
    expect(slotDayKey({ start: '2026-06-10T00:00' })).toBe('2026-06-10')
  })
})

describe('addCalendarDays', () => {
  it('advances a date string in the pure calendar frame', () => {
    expect(addCalendarDays('2026-06-10', 1)).toBe('2026-06-11')
  })
  it('rolls over a month boundary', () => {
    expect(addCalendarDays('2026-06-30', 1)).toBe('2026-07-01')
  })
  it('crosses a spring-forward night without drift (pure date maths)', () => {
    // 29 Mar 2026 is BST switch night in the UK; a naive local +1 day can slip.
    expect(addCalendarDays('2026-03-29', 1)).toBe('2026-03-30')
  })
})

describe('addLocalDays', () => {
  it('advances a Date by whole local days', () => {
    const d = new Date(2026, 5, 10) // 10 Jun 2026, local midnight
    expect(addLocalDays(d, 7).getDate()).toBe(17)
  })
  it('steps backwards and does not mutate its input', () => {
    const d = new Date(2026, 5, 10)
    const back = addLocalDays(d, -3)
    expect(back.getDate()).toBe(7)
    expect(d.getDate()).toBe(10) // original untouched
  })
})

describe('needsTzNote', () => {
  const base = { mode: 'times', timezone: 'Europe/London' } as Pick<Poll, 'mode' | 'timezone'>
  it('is true for a timed poll whose zone differs from the viewer', () => {
    expect(needsTzNote(base, 'America/New_York')).toBe(true)
  })
  it('is false when the viewer shares the poll timezone', () => {
    expect(needsTzNote(base, 'Europe/London')).toBe(false)
  })
  it('is always false for a whole-day poll', () => {
    expect(needsTzNote({ mode: 'days', timezone: 'Europe/London' }, 'America/New_York')).toBe(false)
  })
})

describe('wallClockExists', () => {
  it('accepts an ordinary time', () => {
    expect(wallClockExists('2026-06-10T10:30', 'Europe/London')).toBe(true)
  })
  it('rejects a time inside the UK spring-forward gap (01:30 on 29 Mar 2026)', () => {
    // Clocks jump 01:00→02:00, so 01:30 never occurs on the wall clock.
    expect(wallClockExists('2026-03-29T01:30', 'Europe/London')).toBe(false)
  })
  it('accepts the same wall-clock time on a normal day', () => {
    expect(wallClockExists('2026-03-22T01:30', 'Europe/London')).toBe(true)
  })
  it('rejects a US spring-forward gap time (02:30 on 8 Mar 2026, New York)', () => {
    expect(wallClockExists('2026-03-08T02:30', 'America/New_York')).toBe(false)
  })
})
