import type { SupabaseClient } from '@supabase/supabase-js'
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
    options: { shouldCreateUser: true },
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

/** Upload a guest host's logo to the public `poll-logos` bucket under their own
 *  uid (RLS scopes writes to auth.uid()), returning the public URL to snapshot
 *  onto the poll. `client` must be signed in as `hostUserId`. */
export async function uploadPollLogo(
  client: SupabaseClient,
  hostUserId: string,
  file: File,
): Promise<string> {
  const ext = LOGO_EXT[file.type]
  if (!ext) throw new Error('Logo must be a PNG, JPG or WebP image.')
  if (file.size > 2 * 1024 * 1024) throw new Error('Logo must be 2 MB or smaller.')
  const path = `${hostUserId}/${shortId(16)}.${ext}`
  const { error } = await client.storage
    .from('poll-logos')
    .upload(path, file, { contentType: file.type, upsert: false })
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

export async function getPoll(id: string): Promise<Poll | null> {
  const { data, error } = await supabase.from('polls').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Poll) ?? null
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
