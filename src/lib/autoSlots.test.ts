import { describe, expect, it } from 'vitest'
import { suggestFreeSlots } from './autoSlots'
import { busySegmentsByDay, type DaySegment } from './hostCalendar'

// 2026-08-17 is a Monday; 2026-08-21 a Friday, 2026-08-22/23 the weekend.
const MON = '2026-08-17'
const TUE = '2026-08-18'
const WED = '2026-08-19'
const THU = '2026-08-20'
const FRI = '2026-08-21'

const busy = (...entries: [string, ...DaySegment[]][]) =>
  new Map<string, DaySegment[]>(entries.map(([day, ...segs]) => [day, segs]))

const at = (h: number, m = 0) => h * 60 + m
const seg = (fromH: number, toH: number): DaySegment => ({ fromMin: at(fromH), toMin: at(toH) })

const starts = (slots: { start: string }[]) => slots.map((s) => s.start)

describe('suggestFreeSlots', () => {
  it('spreads four options over four days, alternating morning and afternoon', () => {
    const out = suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 14, durationMins: 60 })
    expect(starts(out)).toEqual([
      `${MON}T10:00`,
      `${TUE}T13:00`,
      `${WED}T10:00`,
      `${THU}T13:00`,
    ])
    expect(out.every((s) => s.durationMins === 60)).toBe(true)
  })

  it('skips the weekend', () => {
    const out = suggestFreeSlots({ busyByDay: busy(), fromDay: FRI, days: 14, durationMins: 60 })
    expect(starts(out)).toEqual([
      `${FRI}T10:00`,
      '2026-08-24T13:00', // Monday
      '2026-08-25T10:00',
      '2026-08-26T13:00',
    ])
  })

  it('starts after a busy stretch, on the 30-minute grid', () => {
    const out = suggestFreeSlots({
      busyByDay: busy([MON, { fromMin: at(9), toMin: at(10, 20) }]),
      fromDay: MON, days: 1, durationMins: 60, count: 1,
    })
    expect(starts(out)).toEqual([`${MON}T10:30`])
  })

  it('never proposes anything outside 10:00–16:00', () => {
    // Free only 08:00–10:00 and 15:30–18:00 — neither leaves room for an hour
    // inside the window, so Monday contributes nothing.
    const out = suggestFreeSlots({
      busyByDay: busy([MON, { fromMin: at(10), toMin: at(15, 30) }]),
      fromDay: MON, days: 1, durationMins: 60,
    })
    expect(out).toEqual([])
  })

  it('gives a day at most one morning and one afternoon', () => {
    const out = suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 1, durationMins: 60, count: 4 })
    expect(starts(out)).toEqual([`${MON}T10:00`, `${MON}T13:00`])
  })

  it('doubles up on days that worked once the days run out', () => {
    const out = suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 2, durationMins: 60, count: 4 })
    expect(starts(out)).toEqual([
      `${MON}T10:00`, `${MON}T13:00`,
      `${TUE}T10:00`, `${TUE}T13:00`,
    ])
  })

  it('keeps the lunch hour free unless the rest of the afternoon is full', () => {
    const open = suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 1, durationMins: 60, count: 2 })
    expect(starts(open)[1]).toBe(`${MON}T13:00`)

    const packed = suggestFreeSlots({
      busyByDay: busy([MON, seg(13, 17)]),
      fromDay: MON, days: 1, durationMins: 60, count: 2,
    })
    expect(starts(packed)[1]).toBe(`${MON}T12:00`)
  })

  it('honours the earliest start on the first day only', () => {
    const out = suggestFreeSlots({
      busyByDay: busy(), fromDay: MON, days: 14, fromMin: at(14, 15), durationMins: 60, count: 2,
    })
    expect(starts(out)).toEqual([`${MON}T14:30`, `${TUE}T10:00`])
  })

  it('treats slots the poll already has as busy', () => {
    const out = suggestFreeSlots({
      busyByDay: busy(),
      fromDay: MON, days: 1, durationMins: 60, count: 1,
      existing: [{ start: `${MON}T10:00`, durationMins: 90 }],
    })
    expect(starts(out)).toEqual([`${MON}T11:30`])
  })

  it('returns what it could find when the calendar is too full for the count', () => {
    const wall = { fromMin: 0, toMin: 1440 }
    const out = suggestFreeSlots({
      busyByDay: busy([MON, wall], [TUE, wall], [WED, wall], [THU, seg(10, 13)]),
      fromDay: MON, days: 4, durationMins: 60,
    })
    expect(starts(out)).toEqual([`${THU}T13:00`])
  })

  it('fits a longer slot inside the window and still keeps the halves apart', () => {
    const out = suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 1, durationMins: 120, count: 4 })
    expect(starts(out)).toEqual([`${MON}T10:00`, `${MON}T13:00`])
  })

  it('leaves the caller`s busy map untouched', () => {
    const map = busy([MON, seg(10, 11)])
    suggestFreeSlots({ busyByDay: map, fromDay: MON, days: 5, durationMins: 60 })
    expect(map.get(MON)).toEqual([seg(10, 11)])
  })

  it('returns nothing for a nonsensical duration or count', () => {
    expect(suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 5, durationMins: 0 })).toEqual([])
    expect(suggestFreeSlots({ busyByDay: busy(), fromDay: MON, days: 5, durationMins: 60, count: 0 })).toEqual([])
  })

  // The frame the whole feature turns on: the 10–4 window is wall-clock time in
  // the poll's zone, so the busy intervals have to be read in that zone too.
  it('reads the calendar in the poll timezone, not UTC', () => {
    const raw = [{ start: `${MON}T09:00:00Z`, end: `${MON}T10:30:00Z` }]

    const london = suggestFreeSlots({
      busyByDay: busySegmentsByDay(raw, 'Europe/London'), // busy 10:00–11:30 BST
      fromDay: MON, days: 1, durationMins: 60, count: 1,
    })
    expect(starts(london)).toEqual([`${MON}T11:30`])

    const utc = suggestFreeSlots({
      busyByDay: busySegmentsByDay(raw, 'UTC'), // the same wall clock, an hour earlier
      fromDay: MON, days: 1, durationMins: 60, count: 1,
    })
    expect(starts(utc)).toEqual([`${MON}T10:30`])
  })
})
