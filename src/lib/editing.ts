// "The host is just changing the times" — when a poll counts as being edited.
//
// The flag is a timestamp (`polls.editing_since`), not a boolean, because the
// host can simply close the tab mid-edit and nothing would ever clear a
// boolean: the poll would say "check back shortly" for ever and refuse every
// answer. A timestamp that is renewed while the host edits and ignored once it
// is old can't get stuck.

/** How long an edit counts without being renewed. ⚠️ Must match the
 *  `interval '10 minutes'` in `submit_response` (migration 0173) — if the page
 *  thought an edit had lapsed while the server still refused answers, a
 *  respondent would be shown the form and then turned away. */
export const EDIT_WINDOW_MS = 10 * 60_000

/** How often the host's create screen renews the flag while they edit — well
 *  inside the window, so one missed renewal doesn't let it lapse. */
export const EDIT_HEARTBEAT_MS = 4 * 60_000

/** Whether the host is changing the times right now. */
export function hostIsEditing(poll: { editing_since?: string | null }, now: number = Date.now()): boolean {
  if (!poll.editing_since) return false
  const since = Date.parse(poll.editing_since)
  return Number.isFinite(since) && now - since < EDIT_WINDOW_MS
}
