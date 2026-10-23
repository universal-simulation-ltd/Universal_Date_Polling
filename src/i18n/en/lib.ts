// lib: text built outside components: the pasted list, the confirmation email, the .ics/calendar text, error messages (src/lib/*).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
//
// Dates and times inside {date} / {time} arrive already formatted for the
// language. {tz} is a short timezone name such as "BST" or "GMT+2".
export default {
  // The poll's dates as a plain-text list a host pastes into an email
  // (lib/textExport.ts, the "Copy as text" button). Plain text: no markup.
  'list_ask_times': 'Which of these times work for you?', // the line above the numbered list, timed poll
  'list_ask_days': 'Which of these days work for you?', // the same, whole-day poll
  'list_book_time': "Pick whichever time suits you — it's booked as soon as you choose.", // booking page, timed
  'list_book_day': "Pick whichever day suits you — it's booked as soon as you choose.", // booking page, whole days
  'list_all_times': 'All times {tz}.', // follows the sentence above, after a space: "All times BST."
  'list_line_timed': '{date} at {time}', // one numbered line: "Wed, 10 Jun 2026 at 10:00–11:00"
  'list_link_poll': 'Feel free to email back, or to leave your preferences here:', // above the poll's link
  'list_link_booking': 'Book your slot here:', // above a booking page's link
  'where': 'Where: {location}', // the poll's location line, in the list and in the email

  // The confirmation email a host copies into their own mail client
  // (lib/confirmedEmail.ts, "Copy email"). Plain text.
  'email_subject': 'Time confirmed', // subject line, poll with no title
  'email_subject_title': 'Time confirmed: {title}', // subject line; {title} is the poll's title
  'email_greeting': 'Hi all,',
  'email_confirmed': "We've confirmed a time:", // poll with no title
  'email_confirmed_title': 'The time for {title} is confirmed:',
  'email_when_timed': '{date} at {time} {tz}', // "Wed, 10 Jun 2026 at 10:00–11:00 BST"
  'email_add_calendar': 'You can add it to your calendar from the poll:', // above the poll's link
  'email_sign_off': 'See you then!',

  // The calendar event (.ics file, Google and Outlook "add event" links;
  // lib/calendar.ts)
  'event_title_fallback': 'Meeting', // the event's title when the poll has none
  'event_description': 'Scheduled with Universal Date Polling.', // the event's notes
  'event_view_poll': 'View or update the poll: {url}', // second paragraph of the notes

  // "Your polls" rows (lib/myPolls.ts)
  'summary_no_times': 'No times', // a poll with no proposed times
  'summary_no_dates': 'No dates', // a whole-day poll with no proposed days
  'summary_times_one': '{count} time', // "3 times · Wed 10 Jun – Fri 12 Jun"
  'summary_times_other': '{count} times',
  'summary_dates_one': '{count} date', // whole-day poll: "1 date · Wed 10 Jun"
  'summary_dates_other': '{count} dates',
  'confirmed_at': '{date}, {time}', // a confirmed poll's time: "Wed 10 Jun, 10:00–11:00"
  'booked': 'Booked', // a booking page whose one guest has picked a time
  'not_booked': 'Not booked yet',
  'no_responses': 'No responses yet',
  'expires_today': 'Expires today',
  'expires_tomorrow': 'Expires tomorrow',
  'expires_in_one': 'Expires in {count} day', // only used from 2 days up
  'expires_in_other': 'Expires in {count} days',
  'expired_deleted_today': 'Expired · deleted today', // an expired poll, removed from the server today
  'expired_deleted_tomorrow': 'Expired · deleted tomorrow',
  'expired_deleted_in_one': 'Expired · deleted in {count} day', // only used from 2 days up
  'expired_deleted_in_other': 'Expired · deleted in {count} days',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Delete this booking page? The booking is NOT cancelled — the invite stays in both calendars.',
  'delete_booking': 'Delete this booking page?',
  'delete_poll': 'Delete this poll?',
  'delete_poll_responses_one': 'Delete this poll and its {count} response?',
  'delete_poll_responses_other': 'Delete this poll and its {count} responses?',
  'delete_expired_one': "Delete this expired poll and its responses? This can't be undone.", // one expired poll
  'delete_expired_other': "Delete all {count} expired polls and their responses? This can't be undone.",
  'cannot_undo': "This can't be undone.", // added after a single poll's question
  // Deleting every live poll at once; {polls} is 2 or more
  'delete_active': "Delete all {polls} active polls? Their links stop working immediately and this can't be undone.",
  'delete_active_responses_one': "Delete all {polls} active polls and their {count} response? Their links stop working immediately and this can't be undone.",
  'delete_active_responses_other': "Delete all {polls} active polls and their {count} responses? Their links stop working immediately and this can't be undone.",
  'delete_active_booked': 'A booking already taken is NOT cancelled — that invite stays in both calendars.', // added after the question above

  // The free allowance banner on the create screen (lib/freeAllowance.ts);
  // {count} is the company's limit of free active polls
  'near_limit_one': "You've used {used} of your {count} free active polls.",
  'near_limit_other': "You've used {used} of your {count} free active polls.",
  'at_limit_one': "You've used all {count} of your free active polls. Delete a poll or wait for one to finish to make room.",
  'at_limit_other': "You've used all {count} of your free active polls. Delete a poll or wait for one to finish to make room.",
  'at_limit_unknown': "You've used your free active polls. Delete a poll or wait for one to finish to make room.", // the limit was not given

  // Error messages (lib/api.ts, lib/hostCalendar.ts)
  'err_verify': 'Verification failed — please try again.', // the email code did not sign the host in
  'err_session': 'Could not start a session — please try again.',
  'err_logo_type': 'Logo must be a PNG, JPG or WebP image.',
  'err_logo_large': 'That image is too large to upload — try a smaller one.',
  'err_send_emails_retry': 'Could not send the emails — please try again.',
  'err_send_emails': 'Could not send the emails.',
  'err_book_retry': 'Could not book that time — please try again.',
  'err_book': 'Could not book that time.',
  'err_cancel_booking_retry': 'Could not cancel that booking — please try again.',
  'err_cancel_booking': 'Could not cancel that booking.',
  'err_calendar_retry': 'Calendar request failed — please try again.',
  'err_calendar': 'Calendar request failed.',
  'err_busy_load': 'Could not load your calendar availability.',
  'err_calendar_add': "Couldn't add this to your calendar.",
  'err_calendar_remove': "Couldn't remove this from your calendar.",
}
