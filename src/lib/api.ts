import type { SupabaseClient } from '@supabase/supabase-js'
import { downscaleImage } from '@unisim/sdk'
import { supabase } from './supabase'
import type { Availability, NewPoll, Poll, PollResponse } from './types'

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
      // BASE_URL is Vite's configured base ('/polling/' in production, '/' in dev), and
      // the trailing slash is stripped so this sends the exact bare form the
      // redirect allowlist carries — a listed entry without a wildcard has to
      // match exactly, and '.../polling/' is not '.../polling'.
      emailRedirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`.replace(/\/$/, ''),
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
  const n = name.trim()
  const e = email.trim()
  if (e) {
    const { error } = await supabase
      .from('poll_response_emails')
      .upsert(
        { poll_id: pollId, name: n, email: e, updated_at: new Date().toISOString() },
        { onConflict: 'poll_id,name' },
      )
    if (error) throw error
  } else {
    // Field left (or made) blank = not opted in; remove any earlier opt-in.
    const { error } = await supabase
      .from('poll_response_emails')
      .delete()
      .eq('poll_id', pollId)
      .eq('name', n)
    if (error) throw error
  }
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

export async function getPoll(id: string): Promise<Poll | null> {
  const { data, error } = await supabase.from('polls').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Poll) ?? null
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

export async function getResponses(pollId: string): Promise<PollResponse[]> {
  const { data, error } = await supabase
    .from('poll_responses')
    .select('*')
    .eq('poll_id', pollId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return (data as PollResponse[]) ?? []
}

export async function submitResponse(
  pollId: string,
  name: string,
  availability: Record<string, Availability>,
): Promise<void> {
  const { error } = await supabase
    .from('poll_responses')
    .upsert(
      { poll_id: pollId, name: name.trim(), availability, updated_at: new Date().toISOString() },
      { onConflict: 'poll_id,name' },
    )
  if (error) throw error
}
