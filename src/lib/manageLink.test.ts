import { describe, expect, it } from 'vitest'
import { hashWithoutManageToken, looksLikeEmail, manageTokenFromHash } from './manageLink'

const TOKEN = 'a'.repeat(56)

describe('manageTokenFromHash', () => {
  it('reads the token GoTrue hashed', () => {
    expect(manageTokenFromHash(`#manage=${TOKEN}`)).toBe(TOKEN)
    expect(manageTokenFromHash(`manage=${TOKEN}`)).toBe(TOKEN)
    expect(manageTokenFromHash(`#edit=x&manage=${TOKEN}`)).toBe(TOKEN)
  })
  it('ignores anything that is not lower hex of a sensible length', () => {
    expect(manageTokenFromHash('')).toBeNull()
    expect(manageTokenFromHash('#manage=')).toBeNull()
    expect(manageTokenFromHash('#manage=abc')).toBeNull()
    expect(manageTokenFromHash(`#manage=${'A'.repeat(56)}`)).toBeNull()
    expect(manageTokenFromHash(`#manage=${TOKEN}<script>`)).toBeNull()
    expect(manageTokenFromHash(`#admin=${TOKEN}`)).toBeNull()
  })
})

describe('hashWithoutManageToken', () => {
  it('takes the token out and keeps the rest', () => {
    expect(hashWithoutManageToken(`#manage=${TOKEN}`)).toBe('')
    expect(hashWithoutManageToken(`#manage=${TOKEN}&edit=x`)).toBe('#edit=x')
    expect(hashWithoutManageToken('')).toBe('')
  })
})

describe('looksLikeEmail', () => {
  it('accepts an address and refuses the obvious mistakes', () => {
    expect(looksLikeEmail(' jo@example.com ')).toBe(true)
    expect(looksLikeEmail('jo@example')).toBe(false)
    expect(looksLikeEmail('jo example.com')).toBe(false)
    expect(looksLikeEmail('')).toBe(false)
    expect(looksLikeEmail(`${'a'.repeat(250)}@x.com`)).toBe(false)
  })
})
