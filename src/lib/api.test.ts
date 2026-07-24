import { describe, expect, it, vi } from 'vitest'
import type { Poll } from './types'
import { getPollResilient } from './api'

const fakePoll = (id: string): Poll => ({
  id,
  title: 'Test poll',
  host_email: 'host@example.com',
  host_user_id: 'user-1',
  timezone: 'Europe/London',
  mode: 'times',
  slots: [],
  theme: 'orange',
  branding: null,
  final_slot_id: null,
  notify_on_response: false,
  created_at: '2026-07-24T10:00:00.000Z',
  expires_at: null,
})

// Regression: opening a freshly-created poll used to fail the first request
// (backend/client warming up on the first navigation) and only a manual page
// refresh recovered it. getPollResilient must ride out a transient throw.
describe('getPollResilient', () => {
  it('recovers from a transient error without a page refresh', async () => {
    let calls = 0
    const fetch = vi.fn(async (id: string) => {
      calls++
      if (calls === 1) throw new Error('backend not configured') // first-navigation blip
      return fakePoll(id)
    })
    const poll = await getPollResilient('abc', { fetch, delayMs: 0, sleep: async () => {} })
    expect(poll?.id).toBe('abc')
    expect(fetch).toHaveBeenCalledTimes(2)
  })

  it('returns null immediately for a genuinely missing poll (no retries)', async () => {
    const fetch = vi.fn(async () => null)
    const sleep = vi.fn(async () => {})
    const poll = await getPollResilient('missing', { fetch, sleep })
    expect(poll).toBeNull()
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(sleep).not.toHaveBeenCalled()
  })

  it('gives up and rethrows after exhausting retries', async () => {
    const fetch = vi.fn(async () => {
      throw new Error('still down')
    })
    await expect(
      getPollResilient('abc', { fetch, retries: 2, delayMs: 0, sleep: async () => {} }),
    ).rejects.toThrow('still down')
    expect(fetch).toHaveBeenCalledTimes(3) // initial + 2 retries
  })
})
