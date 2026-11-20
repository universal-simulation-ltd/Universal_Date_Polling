// "Email me a link to manage this poll".
//
// A host who gave an email when making a poll owns it through that email's
// account, so the private admin link (adminLink.ts) cannot hand it to another
// device: the server never moves a poll away from a real account. Instead the
// poll page asks the server (platform function `poll-manage-link`) to email
// the address the poll was made with a link of the form
//
//     https://opensource.unisim.co.uk/polling/p/<id>#manage=<token hash>
//
// Opening it redeems the token (`redeemManageLink` in api.ts → verifyOtp),
// which signs this browser in as the host, the same session the device that
// made the poll has. Single use, and it expires after an hour.
//
// Like the admin link the token rides in the FRAGMENT, which browsers never
// send to a server, and the page takes it out of the address bar at once. The
// server answers every request the same way, so the page can never say
// whether an address was the right one.

/** GoTrue's hashed token: lower hex (56 characters today). Anything else is a
 *  mangled paste and is not sent anywhere. */
const TOKEN_RE = /^[0-9a-f]{40,128}$/

export function manageTokenFromHash(hash: string): string | null {
  const t = new URLSearchParams(hash.replace(/^#/, '')).get('manage')
  return t && TOKEN_RE.test(t) ? t : null
}

/** The same fragment with the token taken out ('' when nothing else is left). */
export function hashWithoutManageToken(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  params.delete('manage')
  const rest = params.toString()
  return rest ? `#${rest}` : ''
}

/** The address check the page makes before asking (the server makes its own). */
export function looksLikeEmail(s: string): boolean {
  const t = s.trim()
  return t.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)
}
