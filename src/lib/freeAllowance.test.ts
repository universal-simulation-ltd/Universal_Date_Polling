import { describe, expect, it } from 'vitest'
import { atLimitCopy, isAtLimit, isNearLimit, nearLimitCopy, parseFreeAllowance } from './freeAllowance'

const row = (over: Record<string, unknown> = {}) => ({
  ok: true, app: 'polling', budget: 'polling', unlimited: false,
  used: 3, limit: 10, bytes_used: 0, bytes_limit: null, month_used: 3, month_limit: null, has_room: true,
  ...over,
})

describe('parseFreeAllowance', () => {
  it('reads the RPC row', () => {
    expect(parseFreeAllowance(row())).toEqual({ unlimited: false, used: 3, limit: 10, has_room: true })
  })
  it('says nothing for no company, an error shape or nothing at all', () => {
    expect(parseFreeAllowance({ ok: false, error: 'no_org' })).toBeNull()
    expect(parseFreeAllowance(null)).toBeNull()
    expect(parseFreeAllowance(row({ limit: null }))).toBeNull()
    expect(parseFreeAllowance(row({ used: '3' }))).toBeNull()
  })
})

describe('isNearLimit', () => {
  it('stays quiet below 80%', () => {
    expect(isNearLimit(parseFreeAllowance(row({ used: 7 })))).toBe(false)
  })
  it('speaks from 80% while there is room', () => {
    expect(isNearLimit(parseFreeAllowance(row({ used: 8 })))).toBe(true)
    expect(isNearLimit(parseFreeAllowance(row({ used: 9 })))).toBe(true)
  })
  it('follows the backend limit, not a typed-in 10', () => {
    expect(isNearLimit(parseFreeAllowance(row({ used: 8, limit: 20 })))).toBe(false)
    expect(isNearLimit(parseFreeAllowance(row({ used: 16, limit: 20 })))).toBe(true)
  })
  it('hands over to the at-limit banner when full, and is silent when unlimited', () => {
    expect(isNearLimit(parseFreeAllowance(row({ used: 10, has_room: false })))).toBe(false)
    expect(isNearLimit(parseFreeAllowance(row({ used: 9, unlimited: true })))).toBe(false)
    expect(isNearLimit(null)).toBe(false)
  })
})

describe('isAtLimit', () => {
  it('is true only when there is no room on a free plan', () => {
    expect(isAtLimit(parseFreeAllowance(row({ used: 10, has_room: false })))).toBe(true)
    expect(isAtLimit(parseFreeAllowance(row({ used: 9 })))).toBe(false)
    expect(isAtLimit(parseFreeAllowance(row({ used: 10, has_room: false, unlimited: true })))).toBe(false)
    expect(isAtLimit(null)).toBe(false)
  })
  it('clears once an expired poll stops counting', () => {
    // free_allowance_status counts live rows, so an expiry alone drops `used`.
    expect(isAtLimit(parseFreeAllowance(row({ used: 9, has_room: true })))).toBe(false)
  })
})

describe('copy', () => {
  it('uses the numbers it is given', () => {
    expect(nearLimitCopy({ unlimited: false, used: 8, limit: 10, has_room: true }))
      .toBe("You've used 8 of your 10 free active polls.")
    expect(atLimitCopy({ unlimited: false, used: 12, limit: 12, has_room: false }))
      .toMatch(/^You've used all 12 of your free active polls\. Delete a poll/)
  })
})
