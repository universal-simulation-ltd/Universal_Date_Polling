// share: copy as text, copy email, add to calendar (CopyAsText, CopyEmail, AddToCalendar).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // Copy a list for an email (CopyAsText) — the poll's options as plain text
  'text_show': 'Copy a list for an email →', // a text link that opens the panel
  'text_hide': 'Hide the email text', // the same link once the panel is open
  'text_intro': "Paste this straight into an email for anyone who'd rather reply than click.",
  'text_include_link': 'Include the link to the poll', // checkbox
  'text_copy': 'Copy text', // button
  'copied': 'Copied!', // a Copy button just after it worked; keep short

  // Copy email (CopyEmail) — the confirmation email on a confirmed poll
  'email_button': '📋 Copy email', // small button in the confirmed banner; keep the emoji
  'email_title': 'Copy the confirmation email', // dialog / sheet title
  'email_description': 'Send it from your own email, and change anything you like first.',
  'email_to': 'To', // field label, as in an email app
  'email_subject': 'Subject', // field label, as in an email app
  'email_message': 'Message', // field label: the email's body
  'email_loading': 'Loading addresses…',
  'email_no_addresses': 'Nobody left an email address, so add your own recipients in your email app.',
  'email_copy': 'Copy', // the small copy button beside To and Subject
  'email_copy_message': 'Copy message', // the main copy button beside Message

  // Add to calendar (AddToCalendar) — the menu / bottom sheet on a slot
  'calendar_button': 'Add to calendar', // small button on each result slot; also the sheet's title
  // A note above the choices on a confirmed poll: the people free at that time are pre-filled as guests.
  'calendar_guests_one': "Invites the person free then — they're in the guests box, and nothing is sent until you save.",
  'calendar_guests_other': "Invites the {count} people free then — they're in the guests box, and nothing is sent until you save.",
  'calendar_ics': 'Apple / other (.ics)', // the .ics download choice; keep ".ics"
}
