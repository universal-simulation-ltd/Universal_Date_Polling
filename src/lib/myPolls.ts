// "Your polls" — the pure logic behind the list a returning host sees.
//
// A poll id is ten random characters and the app never listed them anywhere, so
// until now the only way back to a poll you created was the link you copied at
// the time. Everything here is deliberately free of React and of Supabase: the
// dates and labels are the fiddly part (two poll modes, a timezone, an expiry
// that has to read as a human interval), so they are testable on their own.

import type { MyPoll, Slot } from './types'
import { formatCalendarDayShort, formatDateHeading, formatRange, slotInstant } from './time'

/** Combine the lists from the sessions a host might have at once — a Universal
 *  ID (suite SSO) session and this app's own email-code session are different
 *  uids, and polls made under each are all equally "yours". Deduplicated by id
 *  (the same poll can only come from one of them, but a merge that trusts that
 *  is a merge that breaks the day it isn't true) and returned newest-first, so
 *  the caller never has to re-sort after merging. */
export function mergeMyPolls(...lists: MyPoll[][]): MyPoll[] {
  const byId = new Map<string, MyPoll>()
  for (const list of lists) {
    for (const p of list) if (!byId.has(p.id)) byId.set(p.id, p)
  }
  return [...byId.values()].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
  )
}

/** A poll is past it once its `expires_at` has gone by. `expires_at` is null
 *  only for polls made before the expiry option existed; those never expire. */
export function isExpired(poll: MyPoll, now: number = Date.now()): boolean {
  return !!poll.expires_at && Date.parse(poll.expires_at) <= now
}

/** The list split the way it is shown: live polls up front, expired ones behind
 *  a "show" toggle rather than dropped, because a host looking for a poll that
 *  lapsed yesterday should find it saying so instead of finding nothing. */
export function splitMyPolls(
  polls: MyPoll[],
  now: number = Date.now(),
): { active: MyPoll[]; expired: MyPoll[] } {
  const active: MyPoll[] = []
  const expired: MyPoll[] = []
  for (const p of polls) (isExpired(p, now) ? expired : active).push(p)
  return { active, expired }
}

/** The slot the host (or, on a booking page, the guest) settled on. */
export function confirmedSlot(poll: MyPoll): Slot | null {
  if (!poll.final_slot_id) return null
  return poll.slots.find((s) => s.id === poll.final_slot_id) ?? null
}

/** One slot as a date, in the poll's own timezone — which is the frame the rest
 *  of the app already presents this poll in, and the one the host chose. */
function dayLabel(poll: MyPoll, slot: Slot): string {
  return poll.mode === 'days'
    ? formatCalendarDayShort(slot.start)
    : formatDateHeading(slotInstant(slot.start, poll.timezone), poll.timezone)
}

/** "5 times · Tue 10 Jun – Thu 12 Jun", or "3 dates · Tue 10 Jun" when they all
 *  fall on one day. Enough to tell two polls with similar titles apart at a
 *  glance, which is the whole job of this line. */
export function pollSummary(poll: MyPoll): string {
  const slots = [...poll.slots].sort((a, b) => a.start.localeCompare(b.start))
  const unit = poll.mode === 'days' ? 'date' : 'time'
  if (slots.length === 0) return `No ${unit}s`
  const count = `${slots.length} ${unit}${slots.length === 1 ? '' : 's'}`
  const first = dayLabel(poll, slots[0])
  const last = dayLabel(poll, slots[slots.length - 1])
  return first === last ? `${count} · ${first}` : `${count} · ${first} – ${last}`
}

/** "Tue 10 Jun, 10:00–11:00" for a confirmed poll, or null while undecided. */
export function confirmedLabel(poll: MyPoll): string | null {
  const slot = confirmedSlot(poll)
  if (!slot) return null
  if (poll.mode === 'days') return formatCalendarDayShort(slot.start)
  const at = slotInstant(slot.start, poll.timezone)
  return `${formatDateHeading(at, poll.timezone)}, ${formatRange(at, slot.durationMins, poll.timezone)}`
}

/** How many people have answered — or, on a booking page, whether the one
 *  person it was sent to has booked. A booking page has no "2 responses"
 *  state by design: it is taken or it isn't. */
export function responsesLabel(poll: MyPoll): string {
  if (poll.booking_mode) return poll.final_slot_id ? 'Booked' : 'Not booked yet'
  if (poll.response_count === 0) return 'No responses yet'
  return `${poll.response_count} response${poll.response_count === 1 ? '' : 's'}`
}

/** What the Delete button asks before it does anything.
 *
 *  It names the responses because deleting a poll takes them with it (they
 *  cascade from `polls`, and nobody who answered gets told) — "Delete this
 *  poll?" hides the only part of this that cannot be undone.
 *
 *  A BOOKED booking page gets its own warning: deleting the row does not
 *  cancel anything, so the guest keeps an invitation to a meeting the host has
 *  just thrown away. Cancelling first (on the poll page) is what tells them. */
export function deletePrompt(poll: MyPoll): string {
  if (poll.booking_mode) {
    return poll.final_slot_id
      ? 'Delete this booking page? The booking is NOT cancelled — the invite stays in both calendars.'
      : 'Delete this booking page?'
  }
  if (poll.response_count === 0) return 'Delete this poll?'
  const n = poll.response_count
  return `Delete this poll and its ${n} response${n === 1 ? '' : 's'}?`
}

/** The same question for the whole expired batch. Separate from the singular
 *  phrasing rather than a count dropped into one string: "Delete all 1 expired
 *  poll and their responses?" is what that produces, and a confirmation that
 *  reads like a mail-merge is a confirmation people stop reading. */
export function deleteAllPrompt(n: number): string {
  return n === 1
    ? "Delete this expired poll and its responses? This can't be undone."
    : `Delete all ${n} expired polls and their responses? This can't be undone.`
}

const DAY_MS = 24 * 60 * 60 * 1000

/** "Expires today" / "Expires tomorrow" / "Expires in 12 days" / "Expired", or
 *  null for a poll with no expiry at all.
 *
 *  Counted in whole days of remaining time rather than calendar days: this sits
 *  next to a link the host is deciding whether to re-send, so "how long have I
 *  got" is the question, and it must never round up to a day that isn't there.
 *  Anything under 24h left reads as "today". */
export function expiryLabel(poll: MyPoll, now: number = Date.now()): string | null {
  if (!poll.expires_at) return null
  const left = Date.parse(poll.expires_at) - now
  if (left <= 0) return 'Expired'
  const days = Math.floor(left / DAY_MS)
  if (days === 0) return 'Expires today'
  if (days === 1) return 'Expires tomorrow'
  return `Expires in ${days} days`
}
