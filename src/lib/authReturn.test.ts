import { describe, expect, it } from 'vitest'
import { isOwnEmailLinkReturn, shouldClearGuestSession } from './authReturn'

describe('isOwnEmailLinkReturn', () => {
  it('claims a magic-link return', () => {
    expect(isOwnEmailLinkReturn({ access_token: 'a', refresh_token: 'r', type: 'magiclink' })).toBe(true)
  })

  it('claims the other link types Supabase emails', () => {
    for (const type of ['email', 'signup', 'recovery', 'invite', 'email_change']) {
      expect(isOwnEmailLinkReturn({ access_token: 'a', type })).toBe(true)
    }
  })

  // The regression this file exists for: a Google sign-in returning to this
  // page must be left for the suite client, or the suite session is never
  // established and the navbar still offers "Sign in".
  it('declines an OAuth return, which carries no type', () => {
    expect(isOwnEmailLinkReturn({
      access_token: 'a',
      refresh_token: 'r',
      provider_token: 'p',
      token_type: 'bearer',
    })).toBe(false)
  })

  it('declines an OAuth error, which the SDK dialog explains', () => {
    expect(isOwnEmailLinkReturn({ error: 'server_error', error_code: 'manual_linking_disabled' })).toBe(false)
  })

  it('declines a URL with no auth result', () => {
    expect(isOwnEmailLinkReturn({})).toBe(false)
    expect(isOwnEmailLinkReturn({ type: 'magiclink' })).toBe(false)
  })
})

describe('shouldClearGuestSession', () => {
  it('clears when a suite session goes away — the navbar sign-out', () => {
    expect(shouldClearGuestSession('user-1', null)).toBe(true)
  })

  it('leaves a guest who never had a suite session alone', () => {
    expect(shouldClearGuestSession(null, null)).toBe(false)
  })

  it('does not clear on signing in, or while signed in', () => {
    expect(shouldClearGuestSession(null, 'user-1')).toBe(false)
    expect(shouldClearGuestSession('user-1', 'user-1')).toBe(false)
  })

  it('does not clear when one suite account replaces another', () => {
    expect(shouldClearGuestSession('user-1', 'user-2')).toBe(false)
  })
})
