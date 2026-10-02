// The free Polling allowance, as `free_allowance_status('polling')` reports it
// (universal-platform migration 0199): how many of a workspace's free-funded
// polls are live right now, out of how many. The numbers are tunable on the
// backend, so the UI always reads them from here and never types one in.
//
// Counted from live rows, so a poll that expires or is deleted frees its place
// with nothing to go stale — unlike the `app_free_tokens` flag, which is only
// recomputed when something is created or released.
export interface FreeAllowanceStatus {
  unlimited: boolean
  used: number
  limit: number
  has_room: boolean
}

/** Parse the RPC's jsonb. Anything unexpected (signed out, no company —
 *  `ok:false, error:'no_org'` — an older backend, a bad shape) gives null, and
 *  a null status means "say nothing". */
export function parseFreeAllowance(data: unknown): FreeAllowanceStatus | null {
  const d = data as Record<string, unknown> | null
  if (!d || typeof d !== 'object' || d.ok !== true) return null
  if (typeof d.used !== 'number' || typeof d.limit !== 'number') return null
  return { unlimited: d.unlimited === true, used: d.used, limit: d.limit, has_room: d.has_room === true }
}

/** Limits are only mentioned once a host comes close to one: from 80% used,
 *  with room still left (a full allowance has its own message). Same rule as
 *  QR, Signatures and PDF. */
export function isNearLimit(s: FreeAllowanceStatus | null): s is FreeAllowanceStatus {
  return !!s && !s.unlimited && s.limit > 0 && s.has_room && s.used / s.limit >= 0.8
}

/** No room left for another free poll. */
export function isAtLimit(s: FreeAllowanceStatus | null): s is FreeAllowanceStatus {
  return !!s && !s.unlimited && !s.has_room
}

export function nearLimitCopy(s: FreeAllowanceStatus): string {
  return `You've used ${s.used} of your ${s.limit} free active polls.`
}

/** Nothing is for sale for the everyday apps (2026-10-03). Under the at-limit
 *  banner one quiet link asks hosts who need more to tell us — that is the
 *  signal for when a paid tier is worth building. */
export const NEED_MORE_URL = 'https://www.unisim.co.uk/support'

/** The at-limit banner. Names the limit when the backend gave one; the make-room
 *  advice is the one the create errors give too. */
export function atLimitCopy(s: FreeAllowanceStatus): string {
  const what = s.limit > 0 ? `all ${s.limit} of your free active polls` : 'your free active polls'
  return `You've used ${what}. Delete a poll or wait for one to finish to make room.`
}
