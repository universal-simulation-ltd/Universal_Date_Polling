import { describe, expect, it } from 'vitest'
import { calendarMessage } from '../lib/hostCalendar'
import { calendarReturnMessage } from './calendarReturn'

const CLAIM = 'a'.repeat(64)

describe('calendarReturnMessage', () => {
  it('turns the deep link into the message the website popup posts', () => {
    const d = calendarReturnMessage(`unisim-polling://calendar-connected?ok=1&provider=google&claim=${CLAIM}`)
    expect(d).toEqual({ type: 'unisim-calendar', ok: true, provider: 'google', claim: CLAIM })
    // …which the existing listeners read exactly as they read the popup's.
    expect(calendarMessage(d)).toEqual({ ok: true, provider: 'google', claim: CLAIM })
  })

  it('reads a cancelled connect as not ok, with no claim', () => {
    const d = calendarReturnMessage('unisim-polling://calendar-connected?ok=0&provider=microsoft')
    expect(calendarMessage(d)).toEqual({ ok: false, provider: 'microsoft', claim: null })
  })

  it('ignores any other link into the app', () => {
    expect(calendarReturnMessage('unisim-polling://auth-callback#access_token=x')).toBeNull()
    expect(calendarReturnMessage('https://opensource.unisim.co.uk/polling/calendar-connected?ok=1')).toBeNull()
  })
})
