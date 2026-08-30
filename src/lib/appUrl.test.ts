import { afterEach, describe, expect, it } from 'vitest'
import { appBase, emailReturnUrl, pollLink } from './appUrl'

// These helpers exist for ONE reason: inside the Capacitor (iPhone) shell the
// running origin is `capacitor://localhost`, and anything built from it is
// worthless to the person it reaches — an unopenable poll link, or a sign-in
// email Supabase silently redirects to the suite hub instead. Nothing on the
// web can catch a regression here, so it is pinned in a test.

const HOSTED = 'https://opensource.unisim.co.uk/polling/'

function withOrigin(origin: string) {
  ;(globalThis as { window?: unknown }).window = { location: { origin } }
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window
})

describe('appBase', () => {
  it('uses the running origin on the web', () => {
    withOrigin('https://opensource.unisim.co.uk')
    expect(appBase('/polling/')).toBe(HOSTED)
  })

  it('uses the running origin in local dev', () => {
    withOrigin('http://localhost:5173')
    expect(appBase('/')).toBe('http://localhost:5173/')
  })

  it('substitutes the hosted site inside the native shell', () => {
    withOrigin('capacitor://localhost')
    // Not `capacitor://localhost./` — which is what the naive form produces,
    // since the native build's BASE_URL is './'.
    expect(appBase('./')).toBe(HOSTED)
  })
})

describe('pollLink', () => {
  it('is the hosted link inside the native shell', () => {
    withOrigin('capacitor://localhost')
    expect(pollLink('./', 'k7m2xq')).toBe(`${HOSTED}p/k7m2xq`)
  })

  it('is the local link in dev', () => {
    withOrigin('http://localhost:5173')
    expect(pollLink('/', 'k7m2xq')).toBe('http://localhost:5173/p/k7m2xq')
  })
})

describe('emailReturnUrl', () => {
  it('drops the trailing slash the redirect allowlist does not carry', () => {
    withOrigin('https://opensource.unisim.co.uk')
    expect(emailReturnUrl('/polling/')).toBe('https://opensource.unisim.co.uk/polling')
  })

  it('never hands Supabase a capacitor:// URL', () => {
    withOrigin('capacitor://localhost')
    const url = emailReturnUrl('./')
    expect(url.startsWith('https://')).toBe(true)
    expect(url).toBe('https://opensource.unisim.co.uk/polling')
  })
})
