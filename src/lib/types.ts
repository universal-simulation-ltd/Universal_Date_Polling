export type ThemeName = 'orange' | 'blue' | 'pink' | 'green'

export const THEMES: { name: ThemeName; label: string; swatch: string }[] = [
  { name: 'orange', label: 'Orange', swatch: '#ea580c' },
  { name: 'blue', label: 'Blue', swatch: '#2563eb' },
  { name: 'pink', label: 'Pink', swatch: '#db2777' },
  { name: 'green', label: 'Green', swatch: '#16a34a' },
]

/** A candidate time the host proposes. `start` is wall-clock local time in the
 *  poll's timezone ('YYYY-MM-DDTHH:mm'); `durationMins` is the slot length. */
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
  slots: Slot[]
  theme: ThemeName
  created_at: string
  expires_at: string | null
}

/** Availability for a single slot. Absence of a slot key means "unavailable". */
export type Availability = 'yes' | 'maybe'

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
  slots: Slot[]
  theme: ThemeName
  expires_at: string | null
}
