// slots: the availability pickers (SlotPicker, CalendarWeekView, TimezonePicker).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // The three ways to propose availability — a segmented control above the
  // picker, and the choices of Tune this app ▸ "Availability opens on"
  'view_form': 'Type in', // type a date and time into a form; tab, ≤ 12 chars
  'view_calendar': 'Calendar', // drag on a week grid; tab, ≤ 12 chars
  'view_days': 'Whole days', // a month grid of whole days; tab, ≤ 14 chars
  'view_none': 'Nothing picked', // the app's default: no picker open until the host picks one

  // Slot lengths, abbreviated — a chip ("09:00 · 1h30m") and the Length menu; keep as short as possible
  'duration_m': '{m}m', // minutes: "30m"
  'duration_h': '{h}h', // whole hours: "2h"
  'duration_hm': '{h}h{m}m', // hours and minutes: "1h30m"

  // Whole days (a month calendar)
  'previous_month': 'Previous month', // screen-reader label of the ‹ button
  'next_month': 'Next month', // screen-reader label of the › button
  'no_days_yet': 'No days yet — click the days you want to propose.',
  'days_selected_one': '{count} day selected',
  'days_selected_other': '{count} days selected',
  'remove_day': 'Remove {day}', // screen-reader label of the × on a date chip; {day} = "Mon 2 Jun 2026"

  // Type in (date + time + length form)
  'date': 'Date', // field label
  'time': 'Time', // field label
  'length': 'Length', // field label: how long the meeting lasts
  'add_time': 'Add time', // button
  'no_times_yet': 'No times yet — pick a date and time above and press {button}.', // {button} = the "Add time" button's name, in bold
  'remove_time': 'Remove {day} {time}', // screen-reader label of the × on a time chip
  'past_moved': "You can't pick a time in the past — moved it forward to {day}, {time}.",
  'dst_gap': "Heads up — {time} doesn't exist on {day} in {zone}: the clocks skip forward that night, so this slot lands at {lands}.", // {zone} = a short zone name like "BST"; {lands} = the time it really becomes

  // Calendar (a week grid you drag on)
  'previous_week': 'Previous week', // screen-reader label of the ‹ button
  'next_week': 'Next week', // screen-reader label of the › button
  'this_week': 'This week', // button; ≤ 12 chars
  'grid_help': 'Click a day to drop a 1-hour slot, or drag down a column to set the length. Drag a slot to move it within the day; click it to remove.',
  'busy_legend': 'Striped = busy in your connected calendar.', // after a small striped swatch
  'syncing': 'Syncing your calendar…', // shown while busy times load
  'syncing_sr': 'Syncing your calendar.', // the same, read out to screen readers
  'time_passed': 'That time has already passed — pick a future slot.',
  'already_proposed': 'You already proposed that time.',
  'slot_title': 'Drag to move · click to remove {time} · {length}', // hover text on a slot block

  // Timezone picker
  'show_times_in': 'Show times in', // the picker's name when the page gives none
  'search_zones': 'Search time zones', // screen-reader label of the search box
  'search_zones_placeholder': 'Search time zones…',
  'no_matching_zones': 'No matching time zones.',
}
