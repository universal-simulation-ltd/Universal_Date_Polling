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
  host_email: string
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
  /** The slot the host has confirmed as the final chosen time (a `Slot.id`), or
   *  null while undecided. Only the host can set it. */
  final_slot_id: string | null
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
  expires_at: string | null
}
