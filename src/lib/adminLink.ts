// A poll's private admin link.
//
// A guest host does not have to give an email address any more. Instead every
// poll a guest creates gets a secret: a 32-character random token, shown to the
// host once as a link of the form
//
//     https://opensource.unisim.co.uk/polling/p/<id>#admin=<token>
//
// Whoever opens that link can manage the poll (confirm a time, change it,
// delete it), on any device. The token is in the FRAGMENT on purpose: browsers
// never send the part after `#` to a server, so it is not in our logs, Cloudflare's,
// or a Referer header. The poll page takes it out of the address bar as soon as
// it has read it.
//
// The server only ever stores a SHA-256 hash of the token (`polls.admin_token_hash`),
// and swaps the token for host rights with `claim_poll(id, token)`, which makes
// the caller's session the poll's host. See `adminLinksSupported` in api.ts for
// how the app tells whether the server has that yet.

import { shortId } from './api'

/** 32 characters from a 32-symbol alphabet: 160 random bits. */
export const ADMIN_TOKEN_LENGTH = 32

// shortId's alphabet (no 0/1/l/o): a-k, m, n, p-z, 2-9.
const TOKEN_RE = /^[a-kmnp-z2-9]{32}$/

export function newAdminToken(): string {
  return shortId(ADMIN_TOKEN_LENGTH)
}

export function isAdminToken(t: string): boolean {
  return TOKEN_RE.test(t)
}

/** The token in a URL fragment such as `#admin=…`, or null if there is none
 *  (or it is not the shape we make, so a mangled paste is not sent anywhere). */
export function adminTokenFromHash(hash: string): string | null {
  const t = new URLSearchParams(hash.replace(/^#/, '')).get('admin')
  return t && isAdminToken(t) ? t : null
}

/** The same fragment with the token taken out ('' when nothing else is left). */
export function hashWithoutAdminToken(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  params.delete('admin')
  const rest = params.toString()
  return rest ? `#${rest}` : ''
}

/** Whether this browser can hash a token. WebCrypto needs a secure context;
 *  every place the app runs (https, localhost, the Capacitor shells) is one. */
export function canHashAdminTokens(): boolean {
  return typeof globalThis.crypto?.subtle?.digest === 'function'
}

/** Lower-case hex SHA-256 — what `polls.admin_token_hash` holds. */
export async function hashAdminToken(token: string): Promise<string> {
  const digest = await globalThis.crypto.subtle.digest('SHA-256', new TextEncoder().encode(token))
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

// ---- Kept on this device ----------------------------------------------------
// So the host can copy their admin link again from the poll page. Only on this
// device (localStorage), never sent anywhere; clearing the site's data
// forgets it. Capped so it cannot grow without end.

const STORE_KEY = 'unipoll-admin-links'
const STORE_MAX = 200

type Stored = Record<string, string>

function readStore(storage: Pick<Storage, 'getItem'> | undefined): Stored {
  try {
    const raw = storage?.getItem(STORE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? (parsed as Stored) : {}
  } catch {
    return {}
  }
}

function defaultStorage(): Storage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

export function rememberAdminToken(pollId: string, token: string, storage: Storage | undefined = defaultStorage()): void {
  if (!storage || !isAdminToken(token)) return
  const all = readStore(storage)
  delete all[pollId]
  all[pollId] = token
  const ids = Object.keys(all)
  for (const old of ids.slice(0, Math.max(0, ids.length - STORE_MAX))) delete all[old]
  try {
    storage.setItem(STORE_KEY, JSON.stringify(all))
  } catch {
    /* storage full or blocked — the host still has the link they were shown */
  }
}

export function storedAdminToken(pollId: string, storage: Storage | undefined = defaultStorage()): string | null {
  const t = readStore(storage)[pollId]
  return typeof t === 'string' && isAdminToken(t) ? t : null
}

export function forgetAdminToken(pollId: string, storage: Storage | undefined = defaultStorage()): void {
  if (!storage) return
  const all = readStore(storage)
  if (!(pollId in all)) return
  delete all[pollId]
  try {
    storage.setItem(STORE_KEY, JSON.stringify(all))
  } catch {
    /* ignore */
  }
}
