/** The sentence to show for something that was thrown.
 *
 *  ⚠️ Not `e instanceof Error ? e.message : fallback`. Supabase's PostgrestError
 *  arrives here as a plain object with a `message`, not an `Error`, so that
 *  test quietly swaps the database's own wording — "That poll no longer accepts
 *  responses", "The host is just changing the times, please check back
 *  shortly" — for a generic "Could not save". The RPCs raise sentences written
 *  to be read; this is what lets them be. */
export function errorMessage(e: unknown, fallback: string): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const m = String((e as { message: unknown }).message).trim()
    if (m) return m
  }
  return fallback
}
