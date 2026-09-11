import { afterEach, describe, expect, it, vi } from 'vitest'
import { calendarPromptHidden, onOpenAppSettings, openAppSettings, setCalendarPromptHidden } from './appSettings'

// A browser's worth of window, and no more: an event target (the wire between
// the navbar's menu row and the screen that owns the settings) and a store.
function fakeWindow(storage?: Partial<Storage>) {
  const target = new EventTarget()
  const win = {
    addEventListener: target.addEventListener.bind(target),
    removeEventListener: target.removeEventListener.bind(target),
    dispatchEvent: target.dispatchEvent.bind(target),
    localStorage: storage,
  }
  vi.stubGlobal('window', win)
  return win
}

function memoryStorage(): Partial<Storage> {
  const map = new Map<string, string>()
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => { map.set(k, v) },
    removeItem: (k) => { map.delete(k) },
  }
}

afterEach(() => vi.unstubAllGlobals())

describe('openAppSettings / onOpenAppSettings', () => {
  it('carries the section the caller asked for', () => {
    fakeWindow()
    const seen: string[] = []
    const off = onOpenAppSettings((s) => seen.push(s))
    openAppSettings('timezone')
    openAppSettings()
    off()
    expect(seen).toEqual(['timezone', 'general'])
  })

  it('stops listening once unsubscribed — an unmounted screen must not answer', () => {
    fakeWindow()
    const seen: string[] = []
    onOpenAppSettings((s) => seen.push(s))()
    openAppSettings('timezone')
    expect(seen).toEqual([])
  })

  it('does nothing at all without a window (server / test render)', () => {
    vi.stubGlobal('window', undefined)
    expect(() => openAppSettings()).not.toThrow()
    expect(() => onOpenAppSettings(() => {})()).not.toThrow()
  })
})

describe('the calendar prompt preference', () => {
  it('remembers a dismissal, and gives it back', () => {
    fakeWindow(memoryStorage())
    expect(calendarPromptHidden()).toBe(false)
    setCalendarPromptHidden(true)
    expect(calendarPromptHidden()).toBe(true)
    setCalendarPromptHidden(false)
    expect(calendarPromptHidden()).toBe(false)
  })

  it('treats storage that throws as "not dismissed" rather than breaking the page', () => {
    // Safari with site data blocked: touching localStorage raises.
    fakeWindow({
      getItem: () => { throw new Error('denied') },
      setItem: () => { throw new Error('denied') },
      removeItem: () => { throw new Error('denied') },
    })
    expect(() => setCalendarPromptHidden(true)).not.toThrow()
    expect(calendarPromptHidden()).toBe(false)
  })

  it('survives having no storage at all', () => {
    fakeWindow(undefined)
    expect(calendarPromptHidden()).toBe(false)
    expect(() => setCalendarPromptHidden(true)).not.toThrow()
  })
})
