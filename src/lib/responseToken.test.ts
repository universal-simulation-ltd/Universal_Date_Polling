import { describe, expect, it } from 'vitest'
import {
  editTokenFromHash, forgetResponseToken, hashWithoutEditToken, isEditToken, nameStatus, rememberResponseToken,
  responseTokens,
} from './responseToken'

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

const T1 = 'abcdefghijkmnpqrstuvwxyz23456789'
const T2 = '23456789abcdefghijkmnpqrstuvwxyz'

describe('edit tokens in a link', () => {
  it('reads #edit= and refuses anything not shaped like a server token', () => {
    expect(isEditToken(T1)).toBe(true)
    expect(editTokenFromHash(`#edit=${T1}`)).toBe(T1)
    expect(editTokenFromHash(`#x=1&edit=${T1}`)).toBe(T1)
    expect(editTokenFromHash(`#edit=${T1.slice(0, 20)}`)).toBeNull()
    expect(editTokenFromHash('#edit=' + 'O'.repeat(32))).toBeNull()
    expect(editTokenFromHash(`#admin=${T1}`)).toBeNull()
    expect(editTokenFromHash('')).toBeNull()
  })

  it('takes the token out of the address bar and keeps the rest', () => {
    expect(hashWithoutEditToken(`#edit=${T1}`)).toBe('')
    expect(hashWithoutEditToken(`#x=1&edit=${T1}`)).toBe('#x=1')
  })
})

describe('tokens kept on this device', () => {
  it('are kept per poll and per exact name, and can be forgotten', () => {
    const store = memoryStorage()
    rememberResponseToken('p1', ' Sam ', T1, store)
    rememberResponseToken('p1', 'Alex', T2, store)
    expect(responseTokens('p1', store)).toEqual({ Sam: T1, Alex: T2 })
    expect(responseTokens('p2', store)).toEqual({})
    forgetResponseToken('p1', 'Sam', store)
    expect(responseTokens('p1', store)).toEqual({ Alex: T2 })
  })

  it('ignore junk in storage rather than throwing', () => {
    const store = memoryStorage()
    store.setItem('unipoll-response-tokens', '{not json')
    expect(responseTokens('p1', store)).toEqual({})
    store.setItem('unipoll-response-tokens', JSON.stringify({ p1: { Sam: 'short', Alex: T2 } }))
    expect(responseTokens('p1', store)).toEqual({ Alex: T2 })
    rememberResponseToken('p1', 'Kim', 'not-a-token', store)
    expect(responseTokens('p1', store)).toEqual({ Alex: T2 })
  })
})

describe('whose name is this', () => {
  const responses = [
    { name: 'Sam', claimed: true },
    { name: 'Old', claimed: false },
    { name: 'Pre0284' },
  ]
  it('a fresh name is new', () => {
    expect(nameStatus('Jo', responses, {}, null)).toBe('new')
    expect(nameStatus('  ', responses, {}, null)).toBe('new')
  })
  it('a claimed answer is mine only with its token', () => {
    expect(nameStatus('Sam', responses, {}, null)).toBe('claimed')
    expect(nameStatus('Sam', responses, {}, 'Sam')).toBe('claimed')
    expect(nameStatus(' Sam ', responses, { Sam: T1 }, null)).toBe('mine')
  })
  it('an unclaimed (pre-token) answer is mine if this browser gave it, else a warning', () => {
    expect(nameStatus('Old', responses, {}, 'Old')).toBe('mine')
    expect(nameStatus('Old', responses, {}, null)).toBe('unclaimed')
    expect(nameStatus('Pre0284', responses, {}, null)).toBe('unclaimed')
  })
  it('other capitals are a different answer on the server, so only "similar"', () => {
    expect(nameStatus('sam', responses, {}, null)).toBe('similar')
  })
})
