// What a host needs to follow up a confirmed poll from their OWN email and
// calendar: who to invite, and the confirmation email itself.
//
// Pure: no DOM, no clipboard, no React. The wording is the product, so it is
// unit-tested; the preview dialog lives in `components/CopyEmail.tsx`.

import type { Availability, PollMode, Slot } from './types'
import { formatCalendarDay, formatLongDate, formatRange, slotDayKey, slotInstant, tzAbbrev } from './time'

/** One address a respondent left, as `get_poll_respondent_emails` returns it. */
export interface RespondentContact {
  name: string
  email: string
}

/** Names are the poll's identity (the table keys on them), and the page already
 *  matches them case-insensitively when it pre-fills a returning respondent. */
function sameName(name: string): string {
  return name.trim().toLowerCase()
}

/** The addresses, one per mailbox: the same person can answer under two names,
 *  and a guest list with a duplicate in it reads as careless. The first
 *  spelling of each address wins. */
export function uniqueEmails(contacts: RespondentContact[]): string[] {
  const seen = new Map<string, string>()
  for (const c of contacts) {
    const email = c.email.trim()
    const key = email.toLowerCase()
    if (key && !seen.has(key)) seen.set(key, email)
  }
  return [...seen.values()]
}

/** Everyone who can make the confirmed time and left an address: a "yes" or an
 *  "if need be" on that slot. A "no" and a silence are both left out — the
 *  event is going in their diaries, not a notice that it was decided. */
export function guestEmailsForSlot(
  responses: { name: string; availability: Record<string, Availability | undefined> }[],
  contacts: RespondentContact[],
  slotId: string,
): string[] {
  const available = new Set(
    responses
      .filter((r) => r.availability[slotId] === 'yes' || r.availability[slotId] === 'maybe')
      .map((r) => sameName(r.name)),
  )
  return uniqueEmails(contacts.filter((c) => available.has(sameName(c.name))))
}

export interface ConfirmedEmailPoll {
  title: string
  timezone: string
  mode: PollMode
  location: string | null
}

/** The confirmation email, as plain text the host pastes into their own mail
 *  client and edits there. Mirrors what `notify-poll-respondents` sends, minus
 *  the .ics attachment (a paste can't carry one — the poll link can). */
export function buildConfirmedEmail(
  poll: ConfirmedEmailPoll,
  slot: Slot,
  opts: { url?: string; displayTz?: string } = {},
): { subject: string; body: string } {
  const title = poll.title.trim()
  const tz = opts.displayTz || poll.timezone

  let when: string
  if (poll.mode === 'days') {
    when = formatCalendarDay(slotDayKey(slot))
  } else {
    const inst = slotInstant(slot.start, poll.timezone)
    when = `${formatLongDate(inst, tz)} at ${formatRange(inst, slot.durationMins, tz)} ${tzAbbrev(tz, inst)}`
  }

  const lines = [
    'Hi all,',
    '',
    title ? `The time for ${title} is confirmed:` : "We've confirmed a time:",
    '',
    when,
  ]
  const location = poll.location?.trim()
  if (location) lines.push(`Where: ${location}`)
  const url = opts.url?.trim()
  if (url) lines.push('', 'You can add it to your calendar from the poll:', url)
  lines.push('', 'See you then!')

  return {
    subject: title ? `Time confirmed: ${title}` : 'Time confirmed',
    body: lines.join('\n'),
  }
}
