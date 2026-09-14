import { describe, expect, it } from 'vitest'
import { errorMessage } from './errors'

describe('errorMessage', () => {
  it('reads an Error', () => {
    expect(errorMessage(new Error('Boom'), 'fallback')).toBe('Boom')
  })

  it('reads a plain object with a message — the shape a Supabase error arrives in', () => {
    const postgrest = { code: '22023', message: 'That poll no longer accepts responses', details: null, hint: null }
    expect(errorMessage(postgrest, 'Could not save your response.')).toBe('That poll no longer accepts responses')
  })

  it('falls back for anything without a usable message', () => {
    expect(errorMessage('nope', 'fallback')).toBe('fallback')
    expect(errorMessage(null, 'fallback')).toBe('fallback')
    expect(errorMessage({ message: '   ' }, 'fallback')).toBe('fallback')
  })
})
