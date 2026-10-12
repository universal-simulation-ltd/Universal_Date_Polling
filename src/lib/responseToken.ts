// A respondent's edit token — what makes an answer theirs.
//
// Answers used to be keyed by NAME alone, so anyone with the poll link could
// overwrite somebody else's availability by typing the same name. Since
// platform migration 0284 the server hands back a random 32-character token the
// first time someone answers (it stores only a hash) and refuses to change, or
// change the email on, an answer that has one unless the token comes with the
// request. This file keeps those tokens on the device and builds the
// "your edit link" a respondent can open on another device:
//
//     https://opensource.unisim.co.uk/polling/p/<id>#edit=<token>
//
// Like the admin link (adminLink.ts), the token rides in the FRAGMENT, which
// browsers never send to a server, and the poll page takes it out of the
// address bar as soon as it has read it.
//
// Answers given before 0284 have no token: they stay updatable by name, and the
// first save that asks for a token (this app always asks) claims them.

/** Same shape as an admin token: 32 characters of shortId's alphabet. */
const TOKEN_RE = /^[a-kmnp-z2-9]{32}$/

export function isEditToken(t: string): boolean {
  return TOKEN_RE.test(t)
}

/** The token in a URL fragment such as `#edit=…`, or null. */
export function editTokenFromHash(hash: string): string | null {
  const t = new URLSearchParams(hash.replace(/^#/, '')).get('edit')
  return t && isEditToken(t) ? t : null
}

/** The same fragment with the token taken out ('' when nothing else is left). */
export function hashWithoutEditToken(hash: string): string {
  const params = new URLSearchParams(hash.replace(/^#/, ''))
  params.delete('edit')
  const rest = params.toString()
  return rest ? `#${rest}` : ''
}

// ---- Kept on this device ----------------------------------------------------
// { pollId: { exactName: token } }. Keyed by the exact (trimmed) name because
// that is the server's key: "Sam" and "sam" are two different answers. More
// than one name per poll, because a shared family tablet answers for several
// people. Capped by poll so it cannot grow without end.

const STORE_KEY = 'unipoll-response-tokens'
const STORE_MAX = 200

type Stored = Record<string, Record<string, string>>

function defaultStorage(): Storage | undefined {
  try {
    return globalThis.localStorage
  } catch {
    return undefined
  }
}

function readStore(storage: Pick<Storage, 'getItem'> | undefined): Stored {
  try {
    const raw = storage?.getItem(STORE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? (parsed as Stored) : {}
  } catch {
    return {}
  }
}

function writeStore(storage: Storage, all: Stored): void {
  try {
    storage.setItem(STORE_KEY, JSON.stringify(all))
  } catch {
    /* storage full or blocked — the respondent can still copy their edit link */
  }
}

/** Every token this device holds for one poll, by exact name. */
export function responseTokens(pollId: string, storage: Storage | undefined = defaultStorage()): Record<string, string> {
  const forPoll = readStore(storage)[pollId]
  if (!forPoll || typeof forPoll !== 'object') return {}
  const out: Record<string, string> = {}
  for (const [name, t] of Object.entries(forPoll)) if (typeof t === 'string' && isEditToken(t)) out[name] = t
  return out
}

export function rememberResponseToken(
  pollId: string,
  name: string,
  token: string,
  storage: Storage | undefined = defaultStorage(),
): void {
  const n = name.trim()
  if (!storage || !n || !isEditToken(token)) return
  const all = readStore(storage)
  const forPoll = { ...(all[pollId] ?? {}), [n]: token }
  // Re-insert at the end so the cap drops the polls touched longest ago.
  delete all[pollId]
  all[pollId] = forPoll
  const ids = Object.keys(all)
  for (const old of ids.slice(0, Math.max(0, ids.length - STORE_MAX))) delete all[old]
  writeStore(storage, all)
}

export function forgetResponseToken(pollId: string, name: string, storage: Storage | undefined = defaultStorage()): void {
  if (!storage) return
  const all = readStore(storage)
  const forPoll = all[pollId]
  const n = name.trim()
  if (!forPoll || !(n in forPoll)) return
  delete forPoll[n]
  if (Object.keys(forPoll).length === 0) delete all[pollId]
  writeStore(storage, all)
}

// ---- Whose name is this? ----------------------------------------------------

/** What the name in the box means for this poll:
 *  - `new`: nobody has answered under it (or anything like it);
 *  - `mine`: this device holds its token, or gave this old (unclaimed) answer —
 *    saving updates it, and an old one is claimed on the way;
 *  - `claimed`: someone else's answer with a token — the server will refuse;
 *  - `unclaimed`: an answer from before tokens, not given here — saving
 *    replaces it (the old behaviour, so the page warns first);
 *  - `similar`: the same name in different capitals or spacing — a separate
 *    answer on the server, but people won't tell the two apart. */
export type NameStatus = 'new' | 'mine' | 'claimed' | 'unclaimed' | 'similar'

const fold = (s: string) => s.trim().toLowerCase()

export function nameStatus(
  name: string,
  responses: { name: string; claimed?: boolean }[],
  tokens: Record<string, string>,
  answeredAs: string | null,
): NameStatus {
  const n = name.trim()
  if (!n) return 'new'
  const exact = responses.find((r) => r.name === n)
  if (exact) {
    if (tokens[n]) return 'mine'
    if (exact.claimed) return 'claimed'
    return answeredAs === n ? 'mine' : 'unclaimed'
  }
  return responses.some((r) => fold(r.name) === fold(n)) ? 'similar' : 'new'
}
