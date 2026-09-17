// Which auth returns in the URL belong to WHICH Supabase client.
//
// ⚠️ This app runs TWO clients against the same project: its own
// (`src/lib/supabase.ts`, storage key `unipoll-auth`) for the guest host's
// email code, and the SDK's suite client (`universal-suite-auth`) for a
// Universal ID. Both default to reading a session out of the URL, and the
// first one to look CONSUMES it — supabase-js strips the tokens afterwards, so
// the other client sees a clean URL and nothing at all.
//
// That is what broke suite sign-in here on 2026-09-17: signing in with Google
// came back to this page, this app's client swallowed the tokens, and the suite
// session was never established — so the navbar still offered "Sign in" while
// the app went on showing the previous guest host.
//
// The two returns are distinguishable without touching the emails or the
// Supabase redirect allowlist: **an email link carries `type=`** (magiclink,
// signup, recovery, invite, email_change), **an OAuth return does not**. So
// this app's client claims only email-link returns, and every provider return
// is left to the suite client.

/** The `type` values Supabase puts on a return from a link it emailed. */
const EMAIL_LINK_TYPES = new Set([
  'magiclink',
  'email',
  'signup',
  'recovery',
  'invite',
  'email_change',
])

/** True when the URL carries any auth result at all (session or error). */
function hasAuthResult(params: Record<string, string>): boolean {
  return Boolean(
    params.access_token || params.error || params.error_description || params.error_code,
  )
}

/**
 * Should THIS app's own client take the auth result in the URL?
 *
 * Only for a link we emailed. A provider return — and an OAuth error, which the
 * SDK's dialog knows how to explain — belongs to the suite client, which is the
 * only one that can turn it into a suite-wide session.
 */
export function isOwnEmailLinkReturn(params: Record<string, string>): boolean {
  if (!hasAuthResult(params)) return false
  return EMAIL_LINK_TYPES.has(params.type ?? '')
}

/**
 * Should the guest host's own session be cleared, given how the SUITE session
 * just changed?
 *
 * Yes only when a suite session existed and has now gone: that is the navbar's
 * "Sign out", and it used to leave this app's separate guest session in place,
 * so the page kept naming the account the user had just signed out of. A page
 * that never had a suite session (`prev` null) must not be touched — plenty of
 * guest hosts never sign into the suite at all.
 */
export function shouldClearGuestSession(prev: string | null, next: string | null): boolean {
  return Boolean(prev) && !next
}
