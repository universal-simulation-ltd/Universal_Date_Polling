import type { SupabaseClient } from '@supabase/supabase-js'
import { downscaleImage } from '@unisim/sdk'
import { supabase } from './supabase'
import { emailReturnUrl } from './appUrl'
import type { Availability, MyPoll, NewPoll, Poll, PollResponse } from './types'

// ---- Short, URL-safe poll ids (no ambiguous characters) --------------------
const ALPHABET = 'abcdefghijkmnpqrstuvwxyz23456789'
export function shortId(len = 10): string {
  const bytes = new Uint8Array(len)
  crypto.getRandomValues(bytes)
  let out = ''
  for (let i = 0; i < len; i++) out += ALPHABET[bytes[i] % ALPHABET.length]
  return out
}

// ---- Host email verification (Supabase Auth email OTP) ---------------------
export async function sendHostCode(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      shouldCreateUser: true,
      // Without this the magic link falls back to the project's global site_url
      // (https://app.unisim.co.uk) and a host who taps it lands on the suite hub
      // instead of here. The Supabase project is shared, so its site_url can't
      // be any one product's.
      //
      // ⚠️ Inside the iPhone app the running origin is
      // `capacitor://localhost`, which no allowlist can accept — so Supabase
      // would fall back to site_url and put the hub link in the email after
      // all. `emailReturnUrl` substitutes the hosted site there. The app signs
      // in with the TYPED CODE, so the link is not its route in; it just has to
      // lead somewhere sensible for whoever taps it. See src/lib/appUrl.ts.
      emailRedirectTo: emailReturnUrl(import.meta.env.BASE_URL),
    },
  })
  if (error) throw error
}

export async function verifyHostCode(email: string, token: string): Promise<string> {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: 'email',
  })
  if (error) throw error
  const uid = data.user?.id
  if (!uid) throw new Error('Verification failed — please try again.')
  return uid
}

export async function currentUser(): Promise<{ id: string; email: string | null } | null> {
  const { data } = await supabase.auth.getUser()
  return data.user ? { id: data.user.id, email: data.user.email ?? null } : null
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

// ---- Polls -----------------------------------------------------------------
// `client` is whichever Supabase client holds the authenticated host session:
// the app's own OTP client for guests, or the SDK's suite-SSO client for an
// enterprise host. RLS requires auth.uid() = host_user_id, so the insert must
// run on the client that is actually signed in as `hostUserId`.
export async function createPoll(
  client: SupabaseClient,
  p: NewPoll,
  hostUserId: string,
  hostEmail: string,
): Promise<Poll> {
  const row = {
    id: p.id,
    title: p.title.trim(),
    host_user_id: hostUserId,
    host_email: hostEmail.trim(),
    timezone: p.timezone,
    mode: p.mode,
    slots: p.slots,
    theme: p.theme,
    branding: p.branding,
    expires_at: p.expires_at,
    // Only send `location` when set: omitting the key when it's null keeps the
    // insert from referencing the column at all, so a build that shipped before
    // migration 0060 added `polls.location` still creates location-less polls.
    ...(p.location ? { location: p.location } : {}),
    // Same reasoning for `booking_mode` (migration 0120): an ordinary poll never
    // names the column, so this build still works against a database that
    // hasn't taken 0120 yet — it just can't make booking pages.
    ...(p.booking_mode ? { booking_mode: true } : {}),
  }
  const { data, error } = await client.from('polls').insert(row).select().single()
  if (error) throw error
  return data as Poll
}

/** Gated version for free-tier Universal ID users: enforces 1-poll limit and
 *  spends 1 credit from the caller's org. Uses the `create_poll_gated` RPC
 *  (SECURITY DEFINER) so the credit wallet can be updated server-side. */
export async function createPollGated(
  client: SupabaseClient,
  p: NewPoll,
  hostEmail: string,
): Promise<Poll> {
  const { data, error } = await client.rpc('create_poll_gated', {
    p_id:         p.id,
    p_title:      p.title.trim(),
    p_host_email: hostEmail.trim(),
    p_timezone:   p.timezone,
    p_mode:       p.mode,
    p_slots:      p.slots,
    p_theme:      p.theme,
    p_branding:   p.branding,
    p_expires_at: p.expires_at,
  })
  if (error) throw error
  return data as Poll
}

const LOGO_EXT: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
}

/** The `poll-logos` bucket's own `file_size_limit` (migration 0040). Anything
 *  the downscale can't get under this would be rejected by storage anyway, so
 *  we say so ourselves rather than surfacing a raw storage error. */
const POLL_LOGO_BUCKET_LIMIT = 2 * 1024 * 1024

/** Upload a guest host's logo to the public `poll-logos` bucket under their own
 *  uid (RLS scopes writes to auth.uid()), returning the public URL to snapshot
 *  onto the poll. `client` must be signed in as `hostUserId`.
 *
 *  The file is shrunk in the browser first (same `@unisim/sdk` helper the hub's
 *  org branding uses) — the logo renders 36px tall at up to 200px wide, so
 *  1024px is already several times what's displayed, and a camera-sized
 *  original lands at a few tens of KB instead of being rejected. */
export async function uploadPollLogo(
  client: SupabaseClient,
  hostUserId: string,
  file: File,
): Promise<string> {
  if (!LOGO_EXT[file.type]) throw new Error('Logo must be a PNG, JPG or WebP image.')

  const upload = await downscaleImage(file, { maxDimension: 1024, maxBytes: 256 * 1024 })
  // `downscaleImage` hands the original back untouched when the browser can't
  // decode it, so re-check the size rather than assuming it shrank.
  if (upload.size > POLL_LOGO_BUCKET_LIMIT) {
    throw new Error('That image is too large to upload — try a smaller one.')
  }

  const ext = LOGO_EXT[upload.type] ?? LOGO_EXT[file.type]
  const path = `${hostUserId}/${shortId(16)}.${ext}`
  const { error } = await client.storage
    .from('poll-logos')
    .upload(path, upload, { contentType: upload.type, upsert: false })
  if (error) throw error
  return client.storage.from('poll-logos').getPublicUrl(path).data.publicUrl
}

/** Host-only: set (or clear, with `null`) the poll's confirmed final slot.
 *  `client` must be signed in as the poll's `host_user_id` — RLS
 *  (`polls_owner_update`) rejects it otherwise. */
export async function setFinalSlot(
  client: SupabaseClient,
  pollId: string,
  slotId: string | null,
): Promise<void> {
  const { error } = await client.from('polls').update({ final_slot_id: slotId }).eq('id', pollId)
  if (error) throw error
}

/** Host-only: set (or clear, with `null`) the poll's event location. `client`
 *  must be signed in as the host — RLS (`polls_owner_update`) gates it. Used as a
 *  follow-up write for the gated create path, whose RPC doesn't take a location. */
export async function setPollLocation(
  client: SupabaseClient,
  pollId: string,
  location: string | null,
): Promise<void> {
  const { error } = await client.from('polls').update({ location }).eq('id', pollId)
  if (error) throw error
}

/** Host-only: turn a poll into (or back out of) a 1:1 booking page. `client`
 *  must be signed in as the host — RLS (`polls_owner_update`) gates it. Used as
 *  a follow-up write for the gated create path, whose RPC predates the column. */
export async function setBookingMode(
  client: SupabaseClient,
  pollId: string,
  on: boolean,
): Promise<void> {
  const { error } = await client.from('polls').update({ booking_mode: on }).eq('id', pollId)
  if (error) throw error
}

/** Host-only: turn per-response email alerts on/off for a poll. `client` must be
 *  signed in as the host — RLS (`polls_owner_update`) gates it. */
export async function setNotifyOnResponse(
  client: SupabaseClient,
  pollId: string,
  on: boolean,
): Promise<void> {
  const { error } = await client.from('polls').update({ notify_on_response: on }).eq('id', pollId)
  if (error) throw error
}

/** Best-effort: ask the edge function to email the host that `respondentName`
 *  just responded. Fire-and-forget — the response is already saved, so a failure
 *  here (offline, provider down, host not opted in) must never surface as an
 *  error to the respondent. The function itself no-ops unless the host opted in
 *  and a matching response row exists. */
export async function notifyPollHost(pollId: string, respondentName: string): Promise<void> {
  try {
    await supabase.functions.invoke('notify-poll-host', { body: { pollId, respondentName } })
  } catch {
    /* ignore — notification is best-effort */
  }
}

/** Save (or clear, with '') the respondent's opt-in notification email for
 *  their response row. Lives in `poll_response_emails` — a write-only table for
 *  client roles (no SELECT grant on the email column), so an address can never
 *  be read back by anyone with the link; only the notify-poll-respondents edge
 *  function's service role sees it. Keyed (poll_id, name) like the response
 *  itself, and RLS requires the matching response row to exist — so this must
 *  run AFTER submitResponse. */
export async function saveResponseEmail(pollId: string, name: string, email: string): Promise<void> {
  // Written through the `upsert_response_email` RPC (migration 0119), NOT by
  // touching the table — and that is not a style choice. Withholding
  // table-level SELECT is what keeps addresses unreadable, but PostgREST's
  // upsert runs as ON CONFLICT DO UPDATE, which *requires* that privilege: the
  // direct write here failed `42501 permission denied` for every respondent
  // from 0115 until 0119, refused before RLS was even consulted. A definer
  // function resolves the conflict as the owner instead, and re-enforces the
  // live-poll + existing-response checks that RLS used to make — which is
  // still why this must run AFTER submitResponse.
  // Blank email = not opted in; the function clears any earlier opt-in, so
  // both directions are one call and cannot drift apart.
  const { error } = await supabase.rpc('upsert_response_email', {
    p_poll_id: pollId,
    p_name: name.trim(),
    p_email: email.trim(),
  })
  if (error) throw error
}

/** Host-only: ask the edge function to email every opted-in respondent the
 *  confirmed time (+ .ics). `client` must hold the host's session — the
 *  function rejects anyone whose uid isn't the poll's host. Returns how many
 *  emails were sent (0 = nobody opted in). */
export async function notifyRespondents(client: SupabaseClient, pollId: string): Promise<number> {
  const { data, error } = await client.functions.invoke('notify-poll-respondents', {
    body: { pollId },
  })
  if (error) {
    // FunctionsHttpError carries the response; surface the function's own
    // message when there is one (e.g. "No confirmed time yet").
    const ctx = (error as { context?: Response }).context
    if (ctx) {
      const body = await ctx.json().catch(() => null)
      if (body?.error) throw new Error(body.error)
    }
    throw new Error('Could not send the emails — please try again.')
  }
  if (!data?.ok) throw new Error(data?.error ?? 'Could not send the emails.')
  return data.sent ?? 0
}

/** Raised by the booking calls with the edge function's own `code`, so the page
 *  can react to "somebody beat you to it" differently from a network hiccup. */
export class BookingError extends Error {
  code: string | null
  constructor(message: string, code: string | null) {
    super(message)
    this.code = code
  }
}

/** Pull the edge function's own JSON error out of a FunctionsHttpError, which
 *  otherwise surfaces as a bare "non-2xx status code" with the body unread. */
async function functionError(error: unknown, fallback: string): Promise<BookingError> {
  const ctx = (error as { context?: Response }).context
  if (ctx) {
    const body = await ctx.json().catch(() => null)
    if (body?.error) return new BookingError(body.error, body.code ?? null)
  }
  return new BookingError(fallback, null)
}

export interface BookingResult {
  /** True when the host's own connected calendar sent the invitation (the guest
   *  gets a real Google/Outlook invite). False = we emailed a .ics instead. */
  viaCalendar: boolean
  /** Whether the confirmation email to the guest actually went out. */
  invitee: boolean
}

/** Book a slot on a 1:1 booking page. Anonymous by design — the guest has no
 *  account — and routed through the edge function rather than written directly
 *  because the booking and the invitations must not be able to come apart:
 *  `book_poll_slot` is service-role-only, so there is no client path to a
 *  booking that skips the emails (migration 0120). */
export async function bookSlot(
  pollId: string,
  slotId: string,
  name: string,
  email: string,
): Promise<BookingResult> {
  const { data, error } = await supabase.functions.invoke('book-poll-slot', {
    body: { action: 'book', pollId, slotId, name: name.trim(), email: email.trim() },
  })
  if (error) throw await functionError(error, 'Could not book that time — please try again.')
  if (!data?.ok) throw new BookingError(data?.error ?? 'Could not book that time.', data?.code ?? null)
  return { viaCalendar: !!data.viaCalendar, invitee: !!data.invitee }
}

/** Host-only: release a booked page so it can be booked again, telling the
 *  guest it's off (provider cancellation where the host's calendar sent the
 *  invite, a METHOD:CANCEL .ics otherwise). `client` must hold the host's
 *  session — the function checks the uid against the poll's host itself. */
export async function cancelBooking(
  client: SupabaseClient,
  pollId: string,
): Promise<{ notified: boolean; notifyError: string | null }> {
  const { data, error } = await client.functions.invoke('book-poll-slot', {
    body: { action: 'cancel', pollId },
  })
  if (error) throw await functionError(error, 'Could not cancel that booking — please try again.')
  if (!data?.ok) throw new BookingError(data?.error ?? 'Could not cancel that booking.', data?.code ?? null)
  // `notified` is not decoration: cancelling deletes the guest's address, so a
  // cancellation the guest was never told about is one nobody can retry. The
  // host has to hear about it, which is why this is returned rather than logged.
  return { notified: !!data.notified, notifyError: data.notifyError ?? null }
}

/** One poll, by id.
 *
 *  ⚠️ Goes through the `get_poll` RPC rather than `from('polls')`, and that is a
 *  privacy boundary rather than a style choice. The table's read policy used to
 *  be `using (true)`, and RLS filters rows without ever seeing the caller's
 *  WHERE clause — so "anyone with the link can read a poll" was in fact "anyone
 *  can read every poll", host addresses included, no link required. Measured
 *  against prod on 2026-08-20: an unfiltered read returned all 14. Passing the
 *  id as an ARGUMENT is what makes it required (migrations 0121/0122).
 *
 *  The returned object carries every column except `host_email`, which nothing
 *  on the client has ever read. */
export async function getPoll(id: string): Promise<Poll | null> {
  const { data, error } = await supabase.rpc('get_poll', { p_id: id })
  if (error) throw error
  return (data as Poll | null) ?? null
}

/** Every poll the caller hosts, newest first, each with a `response_count`.
 *
 *  `client` must be the one holding the host's session — the SDK's suite-SSO
 *  client for a Universal ID user, this app's own OTP client for a guest host.
 *  There is no id argument and none is wanted: `list_my_polls` (migration 0130)
 *  scopes itself to `auth.uid()`, so an unauthenticated caller gets `[]` rather
 *  than an error, and no caller can ask for somebody else's polls.
 *
 *  An RPC rather than `from('polls').select()` — which the `polls_owner_read`
 *  policy would in fact allow — because of the RESPONSE COUNT: 0122 revoked
 *  `poll_responses` from client roles entirely, so the count has to be computed
 *  server-side. See the migration.
 */
export async function listMyPolls(client: SupabaseClient): Promise<MyPoll[]> {
  const { data, error } = await client.rpc('list_my_polls')
  if (error) throw error
  return (data as MyPoll[] | null) ?? []
}

/** Host-only: delete polls, and with them every response, respondent email and
 *  calendar link that hangs off them (all `on delete cascade` from 0025/0115).
 *  `client` must hold the host's session — `polls_owner_delete` (0025) gates it.
 *
 *  Returns the ids that were ACTUALLY deleted, which is the point of the
 *  `.select()`: RLS filters rows rather than raising, so a delete the caller
 *  doesn't own is not an error — it silently removes nothing. Reading back what
 *  went lets the caller tell "deleted" from "quietly did nothing", instead of
 *  striking a poll off the list that is still there on the next load.
 *
 *  Deleting is also how a token comes back: the `polls_after_delete` trigger
 *  (0042) refunds a credit-funded poll, and a free-token-funded one stops
 *  holding the org's free token the moment the row is gone (0045 derives the
 *  holder from the live rows). Neither needs a call from here.
 */
export async function deletePolls(client: SupabaseClient, ids: string[]): Promise<string[]> {
  if (ids.length === 0) return []
  const { data, error } = await client.from('polls').delete().in('id', ids).select('id')
  if (error) throw error
  return (data ?? []).map((r) => (r as { id: string }).id)
}

/** Fetch a poll, retrying a few times on a *thrown* error before giving up.
 *
 *  Why this exists: opening a poll immediately after creating it occasionally
 *  failed the very first request — the app's Supabase client can still be warming
 *  up on that first navigation (in-flight auth/token-refresh lock, a cold
 *  connection, or a service-worker-served shell that raced the network), so a
 *  single attempt would surface an error that a manual page refresh then cleared.
 *  Auto-retrying the transient failure removes the need for that refresh.
 *
 *  A poll that resolves to `null` is a *definitive* "not found" (the row simply
 *  isn't there) and is returned immediately — only exceptions are retried.
 *  `fetch` and `sleep` are injectable purely so the retry logic is unit-testable
 *  without a live backend. */
export async function getPollResilient(
  id: string,
  opts: {
    retries?: number
    delayMs?: number
    fetch?: (id: string) => Promise<Poll | null>
    sleep?: (ms: number) => Promise<void>
  } = {},
): Promise<Poll | null> {
  const retries = opts.retries ?? 3
  const delayMs = opts.delayMs ?? 250
  const fetchOne = opts.fetch ?? getPoll
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)))
  let lastErr: unknown
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchOne(id)
    } catch (e) {
      lastErr = e
      // Linear backoff between attempts; no wait after the final one.
      if (attempt < retries) await sleep(delayMs * (attempt + 1))
    }
  }
  throw lastErr
}

/** Everyone's answers to one poll. See `getPoll` for why this is an RPC.
 *
 *  Ordering stays server-side (`order by created_at` inside the function), so
 *  the grid's row order is unchanged from the PostgREST version. */
export async function getResponses(pollId: string): Promise<PollResponse[]> {
  const { data, error } = await supabase.rpc('get_poll_responses', { p_poll_id: pollId })
  if (error) throw error
  return (data as PollResponse[] | null) ?? []
}

/** Add or update one person's availability.
 *
 *  ⚠️ An RPC for a sharper reason than the two reads above. PostgREST's upsert
 *  is `INSERT ... ON CONFLICT DO UPDATE`, and that path requires **table-level
 *  SELECT** on the target — so the moment 0122 takes SELECT away from client
 *  roles, a respondent CHANGING an answer they had already given would fail
 *  with `42501 permission denied`, before RLS was even consulted. A first-time
 *  answer (a plain insert) would have carried on working, which is exactly the
 *  kind of half-broken that gets shipped. This is the same trap 0119 hit on
 *  `poll_response_emails`; it is written up at length there.
 *
 *  The function re-enforces the live-poll check that 0025's insert policy used
 *  to make, because RLS does not run inside a SECURITY DEFINER function. */
export async function submitResponse(
  pollId: string,
  name: string,
  availability: Record<string, Availability>,
): Promise<void> {
  const { error } = await supabase.rpc('submit_response', {
    p_poll_id: pollId,
    p_name: name.trim(),
    p_availability: availability,
  })
  if (error) throw error
}
