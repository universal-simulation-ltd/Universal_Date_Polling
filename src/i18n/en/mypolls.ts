// mypolls: Your polls (components/MyPolls.tsx) — the list of the host's own
// polls above the create form.
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // Heading
  'title_active': 'Your active polls',
  'title': 'Your polls', // when every poll has expired
  'nothing_active_one_poll': 'Nothing active right now — your poll has expired.',
  'nothing_active_polls': 'Nothing active right now — your polls have expired.',

  // Loading
  'load_failed': "Couldn't load your polls. {retry}", // {retry} = a "Try again" button
  'some_missing': 'Some of your polls may be missing from this list — {retry}.', // {retry} = a button, the next key
  'some_missing_retry': 'try again', // lower case: it sits mid-sentence

  // A poll row
  'booking_page': 'Booking page', // tag before a booking page's summary: "Booking page · 3 times"
  'copy_link': 'Copy link', // small button
  'copied': 'Copied!', // the same button, just after it worked
  'open': 'Open →', // link to the poll
  'booked_on': 'Booked: {when}', // a booking page someone has booked; {when} = the date and time
  'confirmed_on': 'Confirmed: {when}', // a poll whose host confirmed a time

  // Deleting
  'delete_all': 'Delete all {count}', // always 2 or more
  'delete_it': 'Delete it', // the only expired poll
  'show_expired_one': 'Show {count} expired',
  'show_expired_other': 'Show {count} expired',
  'hide_expired_one': 'Hide {count} expired',
  'hide_expired_other': 'Hide {count} expired',
  'deleting': 'Deleting…',
  'delete_failed_one': "That poll couldn't be deleted — please try again.",
  'delete_failed_some': "{failed} of {total} polls couldn't be deleted — please try again.",
}
