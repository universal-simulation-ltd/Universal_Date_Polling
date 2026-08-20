export type ThemeName = 'orange' | 'blue' | 'pink' | 'green'

export const THEMES: { name: ThemeName; label: string; swatch: string }[] = [
  { name: 'orange', label: 'Orange', swatch: '#ea580c' },
  { name: 'blue', label: 'Blue', swatch: '#2563eb' },
  { name: 'pink', label: 'Pink', swatch: '#db2777' },
  { name: 'green', label: 'Green', swatch: '#16a34a' },
]

/** A poll's booking-page colour: a named preset, or a custom '#rrggbb' hex from
 *  the "+" picker. Stored verbatim in the `theme` column. */
export type Theme = ThemeName | string

const HEX_RE = /^#[0-9a-fA-F]{6}$/
export function isHexTheme(theme: string): boolean {
  return HEX_RE.test(theme)
}

/** A poll is either timed (meetings) or whole-day (trips). */
export type PollMode = 'times' | 'days'

/** Branding snapshot rendered on the public sharing page. Copied onto the poll
 *  at creation because logged-out respondents can't read the host's org. */
export interface PollBranding {
  source: 'org' | 'guest'
  name: string | null
  logo_url: string | null
  icon_url: string | null
  brand_color: string | null
}

/** A candidate the host proposes. `start` is wall-clock local time in the poll's
 *  timezone ('YYYY-MM-DDTHH:mm'); `durationMins` is the slot length. In a 'days'
 *  poll `start` is a bare 'YYYY-MM-DDT00:00' and `durationMins` is ignored. */
export interface Slot {
  id: string
  start: string
  durationMins: number
}

export interface Poll {
  id: string
  title: string
  /** ⚠️ Present only on a poll you just CREATED (the insert returns the row
   *  you wrote). `getPoll` omits it deliberately: it is the host's email
   *  address, no client code has ever displayed it, and it used to be
   *  readable by anyone who asked for the table. See migrations 0121/0122. */
  host_email?: string
  host_user_id: string
  timezone: string
  mode: PollMode
  slots: Slot[]
  theme: Theme
  branding: PollBranding | null
  /** Optional EVENT location — a meeting link (Teams / Zoom / Google Meet) or a
   *  physical place ("Meeting room 5"). One value for the whole poll (not
   *  per-slot); shown to respondents and carried into the calendar export. */
  location: string | null
  /** True = this is a 1:1 BOOKING PAGE, not a poll. The one person the link was
   *  sent to picks a slot and it is confirmed there and then, with a calendar
   *  invite to both people — no availability grid, and no host confirmation
   *  step. Opted into at creation; never inferred from the response count,
   *  because a second responder would then silently change what the link
   *  means. See migration 0120 and the book-poll-slot edge function. */
  booking_mode: boolean
  /** The slot the host has confirmed as the final chosen time (a `Slot.id`), or
   *  null while undecided. Set by the host on an ordinary poll, or by the guest
   *  themselves (server-side, via book-poll-slot) on a booking page. */
  final_slot_id: string | null
  /** The slot respondents were last emailed about by notify-poll-respondents,
   *  or null if the host has never sent the confirmation email. Stamped
   *  server-side after a successful send. */
  final_notified_slot_id: string | null
  /** When true, the host is emailed each time a new person responds. */
  notify_on_response: boolean
  created_at: string
  expires_at: string | null
}

/** Availability for a single slot. Absence of a slot key means "no answer";
 *  an explicit 'no' means the respondent marked themselves not free. */
export type Availability = 'yes' | 'maybe' | 'no'

export interface PollResponse {
  id: string
  poll_id: string
  name: string
  availability: Record<string, Availability>
  created_at: string
  updated_at: string
}

/** Client-side draft used to create a poll (server fills the rest). */
export interface NewPoll {
  id: string
  title: string
  timezone: string
  mode: PollMode
  slots: Slot[]
  theme: Theme
  branding: PollBranding | null
  location: string | null
  booking_mode: boolean
  expires_at: string | null
}
