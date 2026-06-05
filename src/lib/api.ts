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
export async function createPoll(p: NewPoll, hostUserId: string, hostEmail: string): Promise<Poll> {
  const row = {
    id: p.id,
    title: p.title.trim(),
    host_user_id: hostUserId,
    host_email: hostEmail.trim(),
    timezone: p.timezone,
    slots: p.slots,
    theme: p.theme,
    expires_at: p.expires_at,
  }
  const { data, error } = await supabase.from('polls').insert(row).select().single()
  if (error) throw error
  return data as Poll
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
