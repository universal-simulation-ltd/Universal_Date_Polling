import { describe, expect, it } from 'vitest'
import { sameCalendarDay, slotInstant, tzAbbrev } from './time'

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
