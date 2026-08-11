import { describe, expect, it } from 'vitest'
import { busySegmentsByDay, mergeSegments, type BusyInterval } from './hostCalendar'

const iv = (start: string, end: string): BusyInterval => ({ start, end })

describe('mergeSegments', () => {
  it('merges overlapping and adjacent segments', () => {
    expect(mergeSegments([
      { fromMin: 60, toMin: 120 },
      { fromMin: 90, toMin: 180 },
      { fromMin: 180, toMin: 240 },
      { fromMin: 600, toMin: 660 },
    ])).toEqual([
      { fromMin: 60, toMin: 240 },
      { fromMin: 600, toMin: 660 },
    ])
  })

  it('sorts unordered input', () => {
    expect(mergeSegments([
      { fromMin: 300, toMin: 360 },
      { fromMin: 0, toMin: 60 },
    ])).toEqual([
      { fromMin: 0, toMin: 60 },
      { fromMin: 300, toMin: 360 },
    ])
  })
})

describe('busySegmentsByDay', () => {
  it('maps a same-day UTC interval onto its day in UTC', () => {
    const m = busySegmentsByDay([iv('2026-08-11T09:00:00Z', '2026-08-11T10:30:00Z')], 'UTC')
    expect(m.get('2026-08-11')).toEqual([{ fromMin: 540, toMin: 630 }])
    expect(m.size).toBe(1)
  })

  it('shifts the wall clock into the poll timezone (BST = UTC+1)', () => {
    const m = busySegmentsByDay([iv('2026-08-11T09:00:00Z', '2026-08-11T10:00:00Z')], 'Europe/London')
    expect(m.get('2026-08-11')).toEqual([{ fromMin: 600, toMin: 660 }])
  })

  it('can land an interval on a different calendar day than its UTC date', () => {
    // 23:30Z on the 11th is 00:30 on the 12th in Paris (UTC+2 in August).
    const m = busySegmentsByDay([iv('2026-08-11T23:30:00Z', '2026-08-11T23:45:00Z')], 'Europe/Paris')
    expect(m.get('2026-08-12')).toEqual([{ fromMin: 90, toMin: 105 }])
    expect(m.has('2026-08-11')).toBe(false)
  })

  it('splits an interval crossing midnight into both days', () => {
    const m = busySegmentsByDay([iv('2026-08-11T22:00:00Z', '2026-08-12T02:00:00Z')], 'UTC')
    expect(m.get('2026-08-11')).toEqual([{ fromMin: 1320, toMin: 1440 }])
    expect(m.get('2026-08-12')).toEqual([{ fromMin: 0, toMin: 120 }])
  })

  it('spans full intermediate days on a multi-day interval', () => {
    const m = busySegmentsByDay([iv('2026-08-11T22:00:00Z', '2026-08-13T06:00:00Z')], 'UTC')
    expect(m.get('2026-08-12')).toEqual([{ fromMin: 0, toMin: 1440 }])
    expect(m.get('2026-08-13')).toEqual([{ fromMin: 0, toMin: 360 }])
  })

  it('drops nothing on an interval ending exactly at midnight', () => {
    const m = busySegmentsByDay([iv('2026-08-11T22:00:00Z', '2026-08-12T00:00:00Z')], 'UTC')
    expect(m.get('2026-08-11')).toEqual([{ fromMin: 1320, toMin: 1440 }])
    expect(m.has('2026-08-12')).toBe(false)
  })

  it('merges overlapping intervals on the same day', () => {
    const m = busySegmentsByDay([
      iv('2026-08-11T09:00:00Z', '2026-08-11T10:00:00Z'),
      iv('2026-08-11T09:30:00Z', '2026-08-11T11:00:00Z'),
    ], 'UTC')
    expect(m.get('2026-08-11')).toEqual([{ fromMin: 540, toMin: 660 }])
  })

  it('keeps wall-clock alignment across a DST fall-back day', () => {
    // London clocks go back 02:00→01:00 on 2026-10-25 (a 25-hour day). An
    // interval 00:30–03:30 UTC shows 01:30→"01:30 again"→03:30 on the wall,
    // but the segment endpoints must still be sane wall-clock minutes.
    const m = busySegmentsByDay([iv('2026-10-25T00:30:00Z', '2026-10-25T03:30:00Z')], 'Europe/London')
    const segs = m.get('2026-10-25')!
    expect(segs).toHaveLength(1)
    expect(segs[0].fromMin).toBe(90) // 01:30 BST
    expect(segs[0].toMin).toBe(210) // 03:30 GMT
  })

  it('ignores empty and malformed intervals', () => {
    const m = busySegmentsByDay([
      iv('2026-08-11T10:00:00Z', '2026-08-11T10:00:00Z'),
      iv('not-a-date', '2026-08-11T10:00:00Z'),
    ], 'UTC')
    expect(m.size).toBe(0)
  })
})
