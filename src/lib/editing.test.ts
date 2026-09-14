import { describe, expect, it } from 'vitest'
import { EDIT_HEARTBEAT_MS, EDIT_WINDOW_MS, hostIsEditing } from './editing'

const NOW = Date.parse('2026-06-10T12:00:00Z')

describe('hostIsEditing', () => {
  it('is false when nobody is editing', () => {
    expect(hostIsEditing({ editing_since: null }, NOW)).toBe(false)
    expect(hostIsEditing({}, NOW)).toBe(false)
  })

  it('is true for an edit started just now', () => {
    expect(hostIsEditing({ editing_since: new Date(NOW - 60_000).toISOString() }, NOW)).toBe(true)
  })

  it('treats an edit older than the window as abandoned', () => {
    expect(hostIsEditing({ editing_since: new Date(NOW - EDIT_WINDOW_MS - 1).toISOString() }, NOW)).toBe(false)
  })

  it('ignores a value it cannot read rather than locking the poll', () => {
    expect(hostIsEditing({ editing_since: 'not a date' }, NOW)).toBe(false)
  })

  it('renews well inside the window', () => {
    expect(EDIT_HEARTBEAT_MS * 2).toBeLessThan(EDIT_WINDOW_MS)
  })
})
