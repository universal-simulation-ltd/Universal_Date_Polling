// Does this run as the phone app (iOS / Android)?
//
// The phone app keeps the website's create form and poll page, but none of the
// website's popups (James, 2026-10-11; Docs_UNI_SIM/store-listings/README.md
// §7): no navbar dropdown, no centred dialogs, no window.confirm. Each one is a
// page with a back gesture, a bottom sheet, or the system's own picker. The
// website keeps its dialogs.
//
// In `npm run dev`, `?app` shows the phone version in a browser (it sticks for
// the tab; `?app=0` turns it off). Universal_PDF's and Universal_Jukebox's
// shell.ts are the pattern.

import { Capacitor } from '@capacitor/core'

const DEV_KEY = 'unisim-polling:dev-phone'

let cached: boolean | null = null

export function phoneApp(): boolean {
  if (cached !== null) return cached
  cached = detect()
  return cached
}

function detect(): boolean {
  if (typeof window === 'undefined') return false
  if (Capacitor.isNativePlatform()) return true
  if (!import.meta.env.DEV) return false
  try {
    const q = new URLSearchParams(window.location.search).get('app')
    if (q !== null) sessionStorage.setItem(DEV_KEY, q === '0' ? '0' : '1')
    return sessionStorage.getItem(DEV_KEY) === '1'
  } catch {
    return false
  }
}
