// poll: the poll page (components/PollPage.tsx).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // Loading, not found, load error
  'loading': 'Loading poll…',
  'load_failed': 'Failed to load poll.',
  'load_error_title': "Couldn't load this poll",
  'load_error_fallback': 'Something went wrong.',
  'not_found_title': 'Poll not found',
  'not_found_body': 'This poll may have been removed, or the link is wrong.',
  'not_found_create': 'Create a new poll →', // link back to the create screen

  // The line under the poll's title
  'header_booked': 'This time is booked.', // a booking page that has been booked
  'header_waiting': 'Waiting for your guest to pick a time.', // the host, on their own booking page
  'header_pick': "Pick the time that suits you — it's booked straight away.", // the guest, on a booking page
  'header_first': 'Be the first to respond.',
  'header_responded_one': '{count} person has responded.',
  'header_responded_other': '{count} people have responded.',
  'times_in': 'Times in {tz}', // after the line above: "· Times in BST"; {tz} is a timezone abbreviation

  // The host is changing the times
  'editing_title': 'The host is just changing the times, please check back shortly.',
  'editing_body': "This page will update by itself when they're done.",

  // The guest has just booked (booking page)
  'booked_title': "You're booked in.",
  'booked_via_calendar': 'A calendar invitation is on its way to {email} — accept it and the meeting lands in your calendar.',
  'booked_emailed': "We've emailed the invite to {email} — open the attachment to add it to your calendar.",
  'booked_not_emailed': "We couldn't email you a copy just now, so add it to your calendar from the button above — the time itself is booked.",

  // Hints for the host
  'host_hint': "You're the host — pick the final time below with {button}, and everyone with the link will see it.", // {button} is the "Confirm this time" label (host_hint_button)
  'host_hint_button': 'Confirm this time', // must match confirm_this_time without the tick
  'host_booking_hint': "This is a booking page. Send the link to one person — whichever time they pick is booked immediately, and you'll both get a calendar invite.",

  // The private admin link
  'admin_checking': 'Checking your admin link…',
  'admin_failed': "That admin link didn't work for this poll, so you're seeing it as a guest. Check you copied the whole link.",
  'admin_unsupported': "Admin links aren't available just yet, so you're seeing this poll as a guest. Please try the link again later.",
  'admin_link_summary': 'Your private admin link', // a small fold-out link
  'signed_in_as': 'Signed in as {email} — {signout}', // {signout} is the "Sign out" button
  'sign_out': 'Sign out',

  // An expired poll ({count} is how many days after expiry it is deleted)
  'expired_one': "This poll's link has expired — it's read-only now, and it will be deleted {count} day after it expired, answers and all.",
  'expired_other': "This poll's link has expired — it's read-only now, and it will be deleted {count} days after it expired, answers and all.",

  // Answering the poll
  'respond_title_days': 'Are you free on these days?',
  'respond_title_times': 'Are you free at these times?',
  'respond_folded': 'A time is confirmed, so this is folded away. You can still change your answers.',
  'respond_intro_days': 'Add your name, answer each day, then save. No account needed.',
  'respond_intro_times': 'Add your name, answer each time, then save. No account needed.',
  'your_name': 'Your name', // field label
  'name_placeholder': 'e.g. Sam', // example name in the empty field
  'your_email': 'Your email', // field label
  'optional': '(optional)', // after "Your email"
  'email_placeholder': 'you@example.com', // example address in the empty field
  'edit_link_ok': 'Your edit link worked: these are your answers. Change them and save.',
  'edit_link_failed': 'That edit link doesn’t match an answer on this poll. It may have been removed. You can still answer below.',
  'name_claimed': '“{name}” has already answered this poll, and only they can change those answers. If that’s you, open the edit link you were given, or use the device you answered on. If not, add an initial or your surname.',
  'name_unclaimed': '“{name}” has already answered this poll. Saving will replace those answers — fine if they’re yours. If not, add an initial or your surname so you don’t overwrite someone else.',
  'name_similar': 'Someone has already answered as “{name}”. Add an initial or your surname so people can tell you apart.',
  'email_note': "Leave your email and you'll get the final date (with a calendar invite) once the host confirms it. Only the host can see it — never other respondents.",
  'all_day': 'All day', // in place of a time range, for a whole-day option
  'answer_yes': 'Yes 👍', // answer button, short; keep the emoji
  'answer_maybe': 'If need be', // answer button: available, but not ideal
  'answer_no': 'No 🙅‍♀️', // answer button, short; keep the emoji
  'saving': 'Saving…',
  'replace_answers': 'Replace {name}’s answers', // save button when the name has an older answer
  'save_availability': 'Save my availability', // save button
  'saved': 'Saved — thanks!',
  'removing': 'Removing…',
  'remove_my_answers': 'Remove my answers',
  'next_with_email': "The host picks the final time once everyone's answered — we'll email it to you then, with a calendar invite.",
  'next_without_email': "The host picks the final time once everyone's answered. Open this link again to see it, or add your email above and save again to have it sent to you.",

  // Errors while answering
  'err_name': 'Add your name so people know who you are.',
  'err_email': "That email doesn't look right — fix it or leave it blank.",
  'err_email_store_why': "Your availability was saved, but your email couldn't be stored — {why}.", // {why} is the server's reason
  'err_email_store': "Your availability was saved, but your email couldn't be stored — try saving again.",
  'err_save': 'Could not save your response.',

  // Removing answers
  'remove_confirm_host': 'Remove {name}’s answers from this poll? This can’t be undone.',
  'remove_confirm_own': 'Remove your answers from this poll? This can’t be undone.',
  'remove_confirm_button': 'Remove', // the confirm sheet's button
  'err_remove_host': 'That answer could not be removed — reload and try again.',
  'err_remove_own': 'Only the person who gave these answers can remove them.',
  'err_remove': 'Could not remove those answers.',
  'err_confirm': 'Could not confirm the time.',

  // A booking page: the guest picks one time
  'pick_day': 'Pick a day',
  'pick_time': 'Pick a time',
  'booking_intro': "Whichever you choose is booked straight away — there's nothing else to send back, and no account needed.",
  'booking_email_note': "Your calendar invite goes here. It's only ever used for this booking.",
  'booking': 'Booking…',
  'book_day': 'Book this day',
  'book_time': 'Book this time',
  'pick_day_above': 'Pick a day above', // the book button, before anything is picked
  'pick_time_above': 'Pick a time above',
  'offering_days': "Days you're offering", // the host's read-only view of their booking page
  'offering_times': "Times you're offering",
  'err_book_name': 'Add your name so they know who they’re meeting.',
  'err_book_email': 'Add the email address your invite should go to.',
  'err_book': 'Could not book that time.',
  'cancel_not_notified': "The booking is cancelled and the page is open again — but we couldn't email your guest. Please let them know yourself.",
  'err_cancel': 'Could not cancel that booking.',

  // A booking was made but an email bounced (host only)
  'notify_title': "This time is booked — but an email didn't get through.",
  'notify_your_guest': 'your guest', // stands in for the guest's name in the three lines below
  'notify_both': "Neither you nor {who} was emailed about it. The time is held either way, so it's worth contacting them directly to confirm it.",
  'notify_invitee': "We couldn't email {who}, so they may not know it's confirmed. The time is held — contacting them directly is the reliable fix.",
  'notify_host': "{who} was emailed and has the details, but our copy to you bounced. Check the address on your account if you'd expected it.",

  // Results
  'results': 'Results', // section heading once a time is confirmed
  'results_so_far': 'Results so far', // section heading before
  'results_nobody': 'Nobody responded.',
  'results_responded_one': '{count} person responded.',
  'results_responded_other': '{count} people responded.',
  'no_responses_host': 'No responses yet — share the link to get started.',
  'no_responses_guest': 'No responses yet — yours will be the first.',
  'confirmed_chip': '✓ Confirmed', // small chip on the confirmed option
  'best_chip': 'Best', // small chip on the option most people can make; very short
  'tally_maybe_one': '{count} maybe', // after the yes count: "3 · 1 maybe"
  'tally_maybe_other': '{count} maybe',
  'tally_no_one': '{count} not free', // after the yes count: "3 · 2 not free"
  'tally_no_other': '{count} not free',
  'names_maybe': 'maybe: {names}', // the names who said "if need be", after the yes names
  'names_no': 'not free: {names}',
  'confirm_this_time': '✓ Confirm this time', // host button on each option
  'unconfirm': 'Unconfirm', // host button on the confirmed option
  'remove_an_answer': 'Remove an answer', // host fold-out
  'remove_an_answer_hint': 'For junk, a duplicate, or someone who lost their edit link and wants to answer again.',
  'remove_name_aria': 'Remove {name}’s answers', // screen-reader label of a name chip

  // The confirmed banner
  'booked_by': '✓ Booked by {name}', // small caps label
  'booked': '✓ Booked',
  'confirmed_time': '✓ Confirmed time',
  'cancel_booking_named': "Cancel this booking?\n\n{name} will be emailed to say it's off, and the page opens for them to pick another time.", // keep the blank line
  'cancel_booking_unnamed': "Cancel this booking?\n\nYour guest will be emailed to say it's off, and the page opens for them to pick another time.",
  'cancel_booking_confirm': 'Cancel the booking', // confirm button
  'keep_it': 'Keep it', // cancel button of the same question
  'working': 'Working…',
  'change': 'Change', // host button: change (or cancel) the confirmed time
  'sending': 'Sending…',
  'resend': 'Resend the confirmation',
  'email_again': 'Email respondents again',
  'email_this_time': 'Email respondents this time',
  'sent_one': 'Sent to {count} person ✓',
  'sent_other': 'Sent to {count} people ✓',
  'no_one_email': 'No one has left an email address yet.',
  'guest_emailed_named': '{name} was emailed the invite when they booked ✓',
  'guest_emailed': 'Your guest was emailed the invite when they booked ✓',
  'respondents_emailed': 'Respondents have been emailed ✓',
  'notify_hint': 'Sends the confirmed date and a calendar invite to everyone who left an email.',

  // The host's own calendar ({provider} is "Google Calendar" or "Outlook")
  'adding': 'Adding…',
  'update_in_calendar': 'Update it in my calendar',
  'add_to_my_provider': 'Add to my {provider}',
  'add_to_my_calendars': 'Add to my calendars',
  'reconnect_to_add': 'Reconnect {provider} to add it',
  'added_to': 'Added to {providers} ✓', // {providers} is one name, or two joined by list_two
  'list_two': '{a} and {b}', // "Google Calendar and Outlook"
  'cal_stale': 'Your calendar was connected for availability only — reconnect it once to allow adding events.',
  'cal_stale_hint': 'Connected for availability only. One reconnect lets this put the time straight in your diary.',
  'cal_add_hint': 'Puts this time in your own calendar. Safe to click twice — it updates the same event.',
  'cal_expired': 'Your calendar connection expired — reconnect it on the create screen.',
  'cal_add_failed': "Couldn't add this to your calendar.",
  'cal_popups': 'Allow pop-ups for this site to reconnect your calendar.',
  'cal_claim_failed': 'Could not finish connecting your calendar.',
  'cal_reconnect_failed': 'Could not start the reconnect.',
  'err_send': 'Could not send the emails.',

  // The timezone bar
  'tz_poll_in': 'This poll is in {tz} {zone}.', // {tz} an abbreviation ("BST"), {zone} the zone's name in brackets ("(Europe/London)")
  'tz_show_mine': 'Show times in your timezone ({tz})', // button
  'tz_reset': "Reset to poll's timezone", // link
  'your_time': '{time} your time', // under a time, in the viewer's own zone: "10:00 your time"
  'your_time_dated': '{date}, {time} your time', // the same, when it is another day there: "Thu 11 Jun, 10:00 your time"

  // Folding sections
  'show': 'Show ▾', // opens a folded section; short
  'hide': 'Hide ▴', // folds it again; short

  'brand_alt': 'Brand', // alt text of a poll's logo when the brand has no name
}
