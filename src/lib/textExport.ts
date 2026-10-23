// Plain-text export of a poll's proposed dates — the list a host pastes into an
// email for the people who won't click a link, or who want the options in front
// of them before they do.
//
// Pure string building: no DOM, no clipboard, no React. The exact wording is
// the product here, so it's unit-tested; the Copy button and the "include the
// link" toggle live in `components/CopyAsText.tsx`.

import type { PollMode, Slot } from './types'
import { formatCalendarDay, formatLongDate, formatRange, slotDayKey, slotInstant, tzAbbrev } from './time'
import { getT } from '../i18n/runtime'

/** The subset of a poll the text list needs. Both a live `Poll` and the
 *  `NewPoll` draft the create screen has just posted satisfy this structurally,
 *  so one builder serves the "your poll is live" panel and the poll page. */
export interface TextListPoll {
  title: string
  timezone: string
  mode: PollMode
  slots: Slot[]
  location: string | null
  /** A 1:1 booking page rather than a poll. Changes what the list ASKS FOR:
   *  picking a time on a booking page settles it, so inviting a reply by email
   *  would be inviting a reply nobody is waiting for. Optional because the
   *  create screen's draft and older callers predate it. */
  booking_mode?: boolean
}

export interface TextListOptions {
  /** Append the "or leave your preferences here" line and the URL. */
  includeLink?: boolean
  /** The poll's public URL. Only used when `includeLink` is set; an empty or
   *  missing URL drops the line entirely rather than emailing a dangling
   *  invitation to nowhere. */
  url?: string
  /** Timezone the times are written in. Defaults to the poll's own zone, so the
   *  poll page can pass whatever the host is currently looking at and the text
   *  always matches the screen it was copied from. */
  displayTz?: string
}

/** The poll's dates as a numbered plain-text list, ready to paste into an email.
 *
 *  The list is flat rather than grouped under date headings on purpose: every
 *  line carries its own full date, so nothing depends on indentation surviving
 *  a mail client, and a reply can just say "2 and 4 work for me". */
export function buildPollTextList(poll: TextListPoll, opts: TextListOptions = {}): string {
  const t = getT()
  const dayMode = poll.mode === 'days'
  const tz = opts.displayTz || poll.timezone
  const slots = [...poll.slots].sort((a, b) => a.start.localeCompare(b.start))

  const lines: string[] = []

  const title = poll.title.trim()
  if (title) lines.push(title, '')

  if (slots.length) {
    // Anchor the tz abbreviation to the first slot, not to "now" — a poll for
    // January copied in June would otherwise be labelled BST.
    const anchor = slotInstant(slots[0].start, poll.timezone)
    const timesNote = dayMode ? '' : ` ${t('lib.list_all_times', { tz: tzAbbrev(tz, anchor) })}`
    const ask = poll.booking_mode
      ? t(dayMode ? 'lib.list_book_day' : 'lib.list_book_time')
      : t(dayMode ? 'lib.list_ask_days' : 'lib.list_ask_times')
    lines.push(`${ask}${timesNote}`, '')
    slots.forEach((slot, i) => {
      const n = `${i + 1}.`
      if (dayMode) {
        lines.push(`${n} ${formatCalendarDay(slotDayKey(slot))}`)
      } else {
        const inst = slotInstant(slot.start, poll.timezone)
        // " at ", not another comma — the long date already carries one after
        // the weekday ("Wed, 10 Jun 2026"), and three commas in a line reads
        // like a list of three things rather than one date and one time.
        lines.push(`${n} ${t('lib.list_line_timed', { date: formatLongDate(inst, tz), time: formatRange(inst, slot.durationMins, tz) })}`)
      }
    })
  }

  const location = poll.location?.trim()
  if (location) lines.push('', t('lib.where', { location }))

  const url = opts.url?.trim()
  if (opts.includeLink && url) {
    lines.push(
      '',
      t(poll.booking_mode ? 'lib.list_link_booking' : 'lib.list_link_poll'),
      url,
    )
  }

  return lines.join('\n')
}
