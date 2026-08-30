// Where this app lives, as a URL somebody else can open.
//
// ⚠️ `window.location.origin` is the wrong answer inside the iPhone app. The
// Capacitor shell serves the bundle from `capacitor://localhost`, so every URL
// built out of the running origin comes out as something no browser, no email
// client and no Supabase redirect allowlist will ever accept. It does not
// fail loudly: a poll link reads plausibly right up until somebody taps it, and
// Supabase silently falls back to the project's global `site_url` (the suite
// hub) for a redirect it cannot honour.
//
// So: use the real origin wherever it IS a real origin — local dev, previews
// and production all keep working against themselves — and substitute the
// hosted site everywhere else.

/** The hosted app, trailing slash included. */
const HOSTED_BASE = 'https://opensource.unisim.co.uk/polling/'

/** True inside a Capacitor WebView, i.e. wherever the origin is unusable. */
function originIsShareable(): boolean {
  return window.location.origin.startsWith('http')
}

/**
 * The app's base URL, always ending in `/`.
 *
 * @param pollBase Vite's `import.meta.env.BASE_URL` as the caller already has
 *                 it — `/` in dev, `/polling/` on the web, `./` in the native
 *                 build (where it is not used, because the origin is not real).
 */
export function appBase(pollBase: string): string {
  return originIsShareable() ? `${window.location.origin}${pollBase}` : HOSTED_BASE
}

/** The shareable link to one poll. */
export function pollLink(pollBase: string, id: string): string {
  return `${appBase(pollBase)}p/${id}`
}

/**
 * Where a link inside an email we send should land.
 *
 * The trailing slash is stripped because the Supabase redirect allowlist
 * carries the bare form, and a listed entry without a wildcard has to match
 * exactly — `.../polling/` is not `.../polling`.
 */
export function emailReturnUrl(pollBase: string): string {
  return appBase(pollBase).replace(/\/$/, '')
}
