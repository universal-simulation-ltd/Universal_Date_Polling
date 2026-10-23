// The calendar connect in the phone app, with claim mode (calendar-oauth,
// platform 0308).
//
// On the website the consent page opens in a popup, ends on our static
// calendar-connected page, and that page postMessages `{type:'unisim-calendar',
// ok, provider, claim}` to its opener. The phone app has no opener to post to:
// `window.open` in the Capacitor shell hands the URL to the system browser. So
// here:
//
//   1. the consent page opens in the in-app browser (@capacitor/browser:
//      SFSafariViewController / a Custom Tab — the kind Google allows for
//      OAuth, unlike a WebView);
//   2. the connect is started with base `…/polling/app/` (hostCalendar.ts), so
//      the provider's redirect lands on `/polling/app/calendar-connected`;
//   3. that page sees the `/app/` and sends the browser on to
//      `unisim-polling://calendar-connected?ok=…&provider=…&claim=…` (the
//      app's own scheme, registered in Info.plist and AndroidManifest.xml);
//   4. the app gets it as `appUrlOpen`, closes the in-app browser, and
//      re-dispatches it as the SAME message the website's popup posts, from
//      this window's own origin — so CreatePoll's and PollPage's existing
//      listeners take it from there and call `{action:'claim', claim}` with
//      the host's own login.
//
// A claim code alone stores nothing: only the host who started the connect can
// take it. If the host closes the browser without coming back, the parked
// tokens expire unclaimed and the connect simply did not happen.

import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { phoneApp } from './shell'

/** Where the hosted closer page sends the phone app back to. */
export const CALENDAR_RETURN_PREFIX = 'unisim-polling://calendar-connected'

/** The closer page's query, read off the deep link, as the website's message. */
export function calendarReturnMessage(url: string): { type: 'unisim-calendar'; ok: boolean; provider: string; claim: string } | null {
  if (!url.startsWith(CALENDAR_RETURN_PREFIX)) return null
  const q = url.indexOf('?')
  const params = new URLSearchParams(q >= 0 ? url.slice(q + 1) : '')
  return {
    type: 'unisim-calendar',
    ok: params.get('ok') === '1',
    provider: params.get('provider') ?? '',
    claim: params.get('claim') ?? '',
  }
}

/** What watchPopup needs of a "popup": whether it has gone away. */
export interface ConsentWindow {
  readonly closed: boolean
}

let installed = false
let current: { closed: boolean } | null = null

function install(): void {
  if (installed) return
  installed = true
  void App.addListener('appUrlOpen', ({ url }) => {
    const data = calendarReturnMessage(url)
    if (!data) return
    void Browser.close().catch(() => {})
    if (current) current.closed = true
    window.dispatchEvent(new MessageEvent('message', { data, origin: window.location.origin }))
  })
  // The host closed the in-app browser themselves (Done / back): the "popup"
  // has gone, so watchPopup re-reads the status, as on the website.
  void Browser.addListener('browserFinished', () => {
    if (current) current.closed = true
  })
}

/**
 * Open a provider's consent page: a popup on the website, the in-app browser
 * in the phone app. Resolves to something with `closed`, or null when the
 * website's popup was blocked.
 */
export async function openConsentWindow(url: string): Promise<ConsentWindow | null> {
  if (!phoneApp()) return window.open(url, 'unisim-calendar', 'width=540,height=680')
  install()
  const handle = { closed: false }
  if (current) current.closed = true
  current = handle
  try {
    await Browser.open({ url, presentationStyle: 'popover' })
  } catch {
    return null
  }
  return handle
}
