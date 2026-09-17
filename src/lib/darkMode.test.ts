import { describe, expect, it } from 'vitest'
import { contrastRatio } from '@unisim/sdk'
// `?raw` rather than node:fs — this app's tsconfig carries no Node types, and
// Vite (which vitest runs on) hands the file over as a string either way.
import indexHtml from '../../index.html?raw'
import themeStoreSource from '../stores/themeStore.ts?raw'
import { themeVars } from './theme'

// Dark MODE (the app's chrome, `.dark` on <html>) — not to be confused with the
// poll's booking-page accent in `theme.ts`, which this file only tests for how
// it renders in each mode.

// ── The key is written down TWICE, and this is what stops the two drifting ──
//
// `src/stores/themeStore.ts` names it for the SDK's store; `index.html` names it
// again in the inline script that puts `.dark` on <html> before the first
// paint, which is the only place early enough to matter. There is no way to
// share one constant between a bundled module and a script that must run during
// head parsing — so renaming either without the other fails here. The key IS
// every user's saved choice for this app (since SDK 0.143, their override of the
// global colour scheme): change it and everybody who chose dark here is silently
// back to following global.

function storeKey(): string {
  const match = /createThemeStore\('([^']+)'\)/.exec(themeStoreSource)
  if (!match) throw new Error('themeStore.ts no longer calls createThemeStore with a literal key')
  return match[1]
}

function headScript(): string {
  return indexHtml.slice(0, indexHtml.indexOf('</head>'))
}

describe('the pre-paint theme script', () => {
  it('reads the same localStorage key as the theme store', () => {
    expect(headScript()).toContain(`localStorage.getItem('${storeKey()}')`)
  })

  // Since SDK 0.143 an absent app key means "follow Global preferences". Without
  // this fallback someone whose only choice is the global Dark gets a light first
  // frame and then a flip once the store loads.
  it('falls back to the global colour scheme, then to light', () => {
    expect(headScript()).toMatch(
      new RegExp(`localStorage\\.getItem\\('${storeKey()}'\\)\\s*\\|\\|\\s*localStorage\\.getItem\\('universal:color-scheme'\\)\\s*\\|\\|\\s*'light'`),
    )
  })

  it('puts the dark class on <html> before anything is painted', () => {
    const head = headScript()
    expect(head).toContain("classList.add('dark')")
    // 'system' has to be honoured here too, or somebody on the OS setting gets
    // the light ground first and the dark one once the bundle catches up.
    expect(head).toContain('prefers-color-scheme: dark')
  })

  it('never removes the class — light is the default, so it only ever adds', () => {
    expect(headScript()).not.toContain("classList.remove('dark')")
  })

  it('does not use a data-theme attribute, which is the poll accent', () => {
    expect(headScript()).not.toMatch(/setAttribute\(\s*'data-theme'/)
  })
})

// ── A custom-hex poll accent, in each mode ──────────────────────────────────

describe('themeVars', () => {
  it('renders LIGHT exactly as it always has (the default)', () => {
    const light = {
      '--accent': '#a76900',
      '--accent-strong': 'color-mix(in srgb, #a76900 82%, black)',
      '--accent-soft': 'color-mix(in srgb, #f59e0b 16%, white)',
      '--accent-softer': 'color-mix(in srgb, #f59e0b 7%, white)',
      '--accent-text': 'color-mix(in srgb, #a76900 72%, black)',
    }
    expect(themeVars('#f59e0b')).toEqual(light)
    expect(themeVars('#f59e0b', 'light')).toEqual(light)
  })

  it('leaves presets to the stylesheet in both modes', () => {
    expect(themeVars('orange')).toEqual({})
    expect(themeVars('blue', 'dark')).toEqual({})
  })

  // Every colour a user might pick, including the ones that are hard in dark:
  // near-black (its text has to go UP a long way) and a pale yellow.
  const PICKS = ['#f59e0b', '#7c3aed', '#0d9488', '#111111', '#fef08a', '#e11d48', '#1d4ed8']

  it.each(PICKS)('in DARK, %s keeps its fill but gets readable text and dark tints', (hex) => {
    const dark = themeVars(hex, 'dark') as Record<string, string>
    const light = themeVars(hex) as Record<string, string>
    // The fill sits under white text in either mode, so it does not change.
    expect(dark['--accent']).toBe(light['--accent'])
    expect(dark['--accent-strong']).toBe(light['--accent-strong'])
    // Accent-coloured TEXT is read on the dark card and on the soft tint.
    for (const ground of ['#0f172a', dark['--accent-soft'], dark['--accent-softer']]) {
      expect(contrastRatio(dark['--accent-text'], ground)).toBeGreaterThanOrEqual(4.5)
    }
    // The tints are dark: body text (slate-100) must still read on them.
    expect(contrastRatio('#f1f5f9', dark['--accent-soft'])).toBeGreaterThanOrEqual(4.5)
  })
})
