import { describe, expect, it } from 'vitest'
import { busySegmentsByDay, mergeSegments, providerStatusOf, type BusyInterval } from './hostCalendar'

const iv = (start: string, end: string, title?: string): BusyInterval =>
  title ? { start, end, title } : { start, end }

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

// ---------------------------------------------------------------------------
// Event titles on the shaded blocks (James, 2026-08-13: on both providers).
//
// The titles ride along the same segment math as the shading, and the failure
// mode is silent in both directions: a title that gets dropped by a merge, and
// a title that leaks onto a block it does not belong to. Neither shows up as an
// error — the grid just quietly says something untrue about the host's diary.
// ---------------------------------------------------------------------------

describe('event titles', () => {
  it('carries a title through to the day segment', () => {
    const out = busySegmentsByDay([iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z', 'Standup')], 'UTC')
    expect(out.get('2026-06-10')).toEqual([{ fromMin: 540, toMin: 600, titles: ['Standup'] }])
  })

  it('leaves an anonymous interval without a titles list at all', () => {
    const out = busySegmentsByDay([iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z')], 'UTC')
    expect(out.get('2026-06-10')).toEqual([{ fromMin: 540, toMin: 600 }])
  })

  // The regression worth pinning: merging two overlapping meetings must not
  // hide one of them behind the other's name.
  it('keeps BOTH names when two meetings overlap', () => {
    const out = busySegmentsByDay([
      iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z', 'Standup'),
      iv('2026-06-10T09:30:00Z', '2026-06-10T11:00:00Z', '1:1 with Dana'),
    ], 'UTC')
    expect(out.get('2026-06-10')).toEqual([
      { fromMin: 540, toMin: 660, titles: ['Standup', '1:1 with Dana'] },
    ])
  })

  // One meeting reaching us from both a work and a personal calendar is the
  // ordinary case, not an edge case.
  it('does not repeat a name that arrived twice', () => {
    const out = busySegmentsByDay([
      iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z', 'Standup'),
      iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z', 'Standup'),
    ], 'UTC')
    expect(out.get('2026-06-10')).toEqual([{ fromMin: 540, toMin: 600, titles: ['Standup'] }])
  })

  it('an anonymous block merged with a named one takes the name', () => {
    const out = busySegmentsByDay([
      iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z'),
      iv('2026-06-10T09:30:00Z', '2026-06-10T11:00:00Z', 'Standup'),
    ], 'UTC')
    expect(out.get('2026-06-10')).toEqual([{ fromMin: 540, toMin: 660, titles: ['Standup'] }])
  })

  it('names do not leak between separate blocks on the same day', () => {
    const out = busySegmentsByDay([
      iv('2026-06-10T09:00:00Z', '2026-06-10T10:00:00Z', 'Standup'),
      iv('2026-06-10T14:00:00Z', '2026-06-10T15:00:00Z', 'Retro'),
    ], 'UTC')
    expect(out.get('2026-06-10')).toEqual([
      { fromMin: 540, toMin: 600, titles: ['Standup'] },
      { fromMin: 840, toMin: 900, titles: ['Retro'] },
    ])
  })

  // An overnight event is named on BOTH days. Naming only the day it starts
  // leaves the morning half of a red-eye as an unexplained block, which is the
  // thing titles exist to stop.
  it('names an overnight event on every day it covers', () => {
    const out = busySegmentsByDay([iv('2026-06-10T22:00:00Z', '2026-06-11T06:00:00Z', 'Red-eye to JFK')], 'UTC')
    expect(out.get('2026-06-10')).toEqual([{ fromMin: 1320, toMin: 1440, titles: ['Red-eye to JFK'] }])
    expect(out.get('2026-06-11')).toEqual([{ fromMin: 0, toMin: 360, titles: ['Red-eye to JFK'] }])
  })

  it('mergeSegments does not mutate its input', () => {
    const input = [{ fromMin: 60, toMin: 120, titles: ['A'] }, { fromMin: 90, toMin: 180, titles: ['B'] }]
    const copy = structuredClone(input)
    mergeSegments(input)
    expect(input).toEqual(copy)
  })
})

// ---------------------------------------------------------------------------
// Reading a provider status off the wire.
//
// The interesting case is a server that predates a field, because the two
// optional flags want OPPOSITE defaults and getting one of them backwards is
// invisible until it is in front of a host.
// ---------------------------------------------------------------------------

describe('providerStatusOf', () => {
  it('reads a full status verbatim', () => {
    const wire = {
      connected: true, email: 'a@b.com', writable: true, detailed: true,
      ceiling: { writable: true, detailed: true },
    }
    expect(providerStatusOf(wire)).toEqual(wire)
  })

  // The state every Google host is in while the server holds the sensitive
  // scopes back: connected and useful, but permanently anonymous and
  // unwritable. The UI reads the ceiling to know not to offer a reconnect.
  it('a capped provider is connected with a floor-level ceiling', () => {
    expect(providerStatusOf({
      connected: true, email: 'a@b.com', writable: false, detailed: false,
      ceiling: { writable: false, detailed: false },
    })).toEqual({
      connected: true, email: 'a@b.com', writable: false, detailed: false,
      ceiling: { writable: false, detailed: false },
    })
  })

  // ⚠️ Missing means TRUE for both halves, unlike `writable` above. A server
  // with no ceiling field predates the hold, when the widest connect really
  // did grant titles and writes — defaulting to false there would hide a
  // working "Add to my calendar" button behind nothing at all.
  it('an absent `ceiling` is wide open — a pre-hold server could grant both', () => {
    expect(providerStatusOf({ connected: true, email: null }).ceiling)
      .toEqual({ writable: true, detailed: true })
  })

  it('a half-specified ceiling keeps the specified half', () => {
    expect(providerStatusOf({ connected: true, email: null, ceiling: { writable: false } }).ceiling)
      .toEqual({ writable: false, detailed: true })
  })

  // A grant that cannot write must not be offered a button that 403s.
  it('an absent `writable` is false — the safe direction for a write', () => {
    expect(providerStatusOf({ connected: true, email: null }).writable).toBe(false)
  })

  // ⚠️ The opposite default, deliberately. A server with no `detailed` field
  // reads no titles at all, so "reconnect to show event names" would appear on
  // every row — Microsoft's included — proposing a fix that changes nothing.
  it('an absent `detailed` is TRUE — a missing field is not an anonymous grant', () => {
    expect(providerStatusOf({ connected: true, email: null }).detailed).toBe(true)
  })

  it('an explicit false is still false', () => {
    expect(providerStatusOf({ connected: true, email: null, detailed: false }).detailed).toBe(false)
  })

  it('an empty object is a disconnected provider', () => {
    expect(providerStatusOf({})).toEqual({
      connected: false, email: null, writable: false, detailed: true,
      ceiling: { writable: true, detailed: true },
    })
  })
})
