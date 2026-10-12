import { describe, expect, it } from 'vitest'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  ADMIN_TOKEN_LENGTH, adminTokenFromHash, forgetAdminToken, hashAdminToken, hashWithoutAdminToken, isAdminToken,
  newAdminToken, rememberAdminToken, storedAdminToken,
} from './adminLink'
import { probeAdminLinks } from './api'

function memoryStorage(): Storage {
  const m = new Map<string, string>()
  return {
    get length() { return m.size },
    clear: () => m.clear(),
    getItem: (k) => m.get(k) ?? null,
    key: (i) => [...m.keys()][i] ?? null,
    removeItem: (k) => { m.delete(k) },
    setItem: (k, v) => { m.set(k, String(v)) },
  }
}

describe('admin tokens', () => {
  it('are 32 characters of the unambiguous alphabet, and differ each time', () => {
    const a = newAdminToken()
    const b = newAdminToken()
    expect(a).toHaveLength(ADMIN_TOKEN_LENGTH)
    expect(isAdminToken(a)).toBe(true)
    expect(a).not.toBe(b)
    expect(a).not.toMatch(/[01lo]/)
  })

  it('are read from the fragment, and anything mangled is ignored', () => {
    const t = newAdminToken()
    expect(adminTokenFromHash(`#admin=${t}`)).toBe(t)
    expect(adminTokenFromHash(`#x=1&admin=${t}`)).toBe(t)
    expect(adminTokenFromHash(`#admin=${t.slice(0, 20)}`)).toBeNull()
    expect(adminTokenFromHash('#admin=' + 'O'.repeat(32))).toBeNull()
    expect(adminTokenFromHash('')).toBeNull()
  })

  it('come out of the fragment without disturbing the rest of it', () => {
    const t = newAdminToken()
    expect(hashWithoutAdminToken(`#admin=${t}`)).toBe('')
    expect(hashWithoutAdminToken(`#x=1&admin=${t}`)).toBe('#x=1')
  })

  it('hash to lower-case hex SHA-256, the form polls.admin_token_hash holds', async () => {
    // sha256("abc") — the FIPS 180-2 test vector.
    expect(await hashAdminToken('abc')).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('are remembered per poll on this device, and can be forgotten', () => {
    const store = memoryStorage()
    const t = newAdminToken()
    rememberAdminToken('poll1', t, store)
    expect(storedAdminToken('poll1', store)).toBe(t)
    expect(storedAdminToken('poll2', store)).toBeNull()
    forgetAdminToken('poll1', store)
    expect(storedAdminToken('poll1', store)).toBeNull()
  })

  it('survive a corrupt store without throwing', () => {
    const store = memoryStorage()
    store.setItem('unipoll-admin-links', '{not json')
    expect(storedAdminToken('poll1', store)).toBeNull()
    rememberAdminToken('poll1', newAdminToken(), store)
    expect(storedAdminToken('poll1', store)).not.toBeNull()
  })
})

describe('probeAdminLinks', () => {
  const clientAnswering = (result: { error: { code: string } | null }) =>
    ({ rpc: async () => ({ data: false, ...result }) }) as unknown as SupabaseClient

  it('says yes when claim_poll answers', async () => {
    expect(await probeAdminLinks(clientAnswering({ error: null }))).toBe('yes')
  })

  it('says no when the server has no claim_poll yet — the email path stays', async () => {
    expect(await probeAdminLinks(clientAnswering({ error: { code: 'PGRST202' } }))).toBe('no')
  })

  it('says unknown on any other failure, so it is asked again later', async () => {
    expect(await probeAdminLinks(clientAnswering({ error: { code: '500' } }))).toBe('unknown')
    const throwing = { rpc: async () => { throw new Error('offline') } } as unknown as SupabaseClient
    expect(await probeAdminLinks(throwing)).toBe('unknown')
  })
})
