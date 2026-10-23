// create: the create screen (components/CreatePoll.tsx).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
//
// "This poll's options" is the name of the options page (settings.title), and
// "Tune this app" the SDK's name for the app menu: keep both exactly as those
// are translated wherever a sentence names them.
export default {
  // Masthead
  'headline_line1': 'Find a time that', // the page's big headline, first line; the second line follows in colour
  'headline_line2': 'works for everyone', // second line of the same headline, in the accent colour
  'intro': 'Offer a few times, share the link, and everyone ticks the ones they can make. No account needed — for you or them.',
  'logo_alt': '{name} logo', // alt text of the host's logo beside the app mark; {name} is their brand or company
  'logo_alt_yours': 'Your logo',

  // Title and location
  'title_label': 'Poll title',
  'title_placeholder': 'e.g. Team catch-up — week of the 9th',
  'location_label': 'Location or meeting link',
  'optional': '(optional)', // after a field label
  'location_placeholder': 'e.g. Meeting room 5, or a Teams / Zoom / Meet link',
  'location_hint': 'Shown to everyone on the poll and added to the calendar invite.',

  // Times to offer
  'times_heading': 'Times to offer',
  'times_hint_none': 'How would you like to add them? Type them in, drag them on a calendar, or offer whole days.',
  'times_hint_days': 'Respondents tick whole days they\'re free — good for trips and multi-day plans.',
  'tz_line': 'It\'s {time}. You are in {zone}.', // {time} is the clock in the poll's timezone, {zone} its IANA name ("Europe/London")
  'tz_change': 'Change timezone?', // link after tz_line; opens the timezone setting

  // Suggest times (calendar view, with a calendar connected)
  'suggest_question': 'Not sure what to propose?', // bold lead-in before suggest_intro
  'suggest_intro_one': 'We\'ll pick {count} time you\'re free — weekdays, {from}–{to} {zone}, at most one morning and one afternoon a day.', // {from}/{to} are clock times, {zone} a short zone name ("BST")
  'suggest_intro_other': 'We\'ll pick {count} times you\'re free — weekdays, {from}–{to} {zone}, at most one morning and one afternoon a day.',
  'suggest_button_one': 'Suggest {count} time', // small button
  'suggest_button_other': 'Suggest {count} times',
  'suggest_finding': 'Finding free time…', // the same button while it works
  'suggest_finding_sr': 'Finding free time in your calendar.', // read out by screen readers
  'suggest_none_one': 'No free time between {from} and {to} on a weekday in the next {count} day — add times by hand, or free some space up and try again.',
  'suggest_none_other': 'No free time between {from} and {to} on a weekday in the next {count} days — add times by hand, or free some space up and try again.',
  'suggest_some': 'Added {found} of {total} — that was all the free time there was. Drag to move one, click to remove it.',
  'suggest_added_one': 'Added {count} time from your free space. Drag to move one, click to remove it.',
  'suggest_added_other': 'Added {count} times from your free space. Drag to move one, click to remove it.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'See when you\'re already busy', // bold lead-in of cal_prompt_connect and cal_prompt_guest
  'cal_prompt_connect': '{lead} — connect a calendar and your busy times shade the grid. Only you see them.',
  'cal_other_lead': 'Busy somewhere else too?', // bold lead-in of cal_prompt_other
  'cal_prompt_other': '{lead} Connect your other calendar and it shades the grid as well.',
  'cal_prompt_guest': '{lead} — verify your email (the same one that saves your poll), then connect your calendar. Only you see the shading.',
  'connect_google': 'Connect Google Calendar', // button
  'connect_outlook': 'Connect Outlook', // button
  'dont_show_again': 'Don\'t show again', // quiet link that hides the prompt for good
  'cal_later_web': 'You can still connect one any time from your profile menu (top right) → Tune this app → This poll\'s options.',
  'cal_later_phone': 'You can still connect one any time from Tune (top right) → This poll\'s options.', // phone app: "Tune" is the top-right button
  'verify': 'Verify', // button after typing the emailed code
  'verifying': 'Verifying…',
  'different_email': 'Different email', // link: go back and type another address
  'code_sent': 'We emailed a 6-digit code to {email}.',
  'sending': 'Sending…',
  'email_me_code': 'Email me a code', // button

  // Calendar errors
  'err_email_first': 'Enter a valid email address first.',
  'err_code': 'Enter the code from your email.',
  'cal_read_failed_google': 'Couldn\'t read your Google calendar — the connection works, but the availability lookup failed. Try again shortly, or disconnect and reconnect.',
  'cal_read_failed_outlook': 'Couldn\'t read your Outlook calendar — the connection works, but the availability lookup failed. Try again shortly, or disconnect and reconnect.',
  'cal_read_failed_both': 'Couldn\'t read your Google and Outlook calendar — the connection works, but the availability lookup failed. Try again shortly, or disconnect and reconnect.',
  'cal_expired': 'A calendar connection has expired — please connect it again.',
  'cal_expired_suggest': 'A calendar connection has expired — please connect it again, then suggest times.',
  'cal_read_failed_suggest': 'Couldn\'t read your calendar just now, so nothing was suggested — try again shortly.',
  'cal_cancelled': 'Calendar connection was cancelled or failed.',
  'popup_blocked': 'Your browser blocked the pop-up — allow pop-ups for this site and try again.',

  // Logo errors
  'logo_type': 'Logo must be a PNG, JPG or WebP image.',
  'logo_size': 'Logo must be 10 MB or smaller.',

  // Checks before creating
  'err_title': 'Give your poll a title.',
  'err_add_day': 'Add at least one day.',
  'err_add_time': 'Add at least one date and time.',
  'err_email': 'Enter a valid email address.',
  'err_booking_email': 'A booking page emails you each booking, so it needs your email address.',
  'err_alerts_email': 'Add your email address to get response alerts, or turn the alerts off in This poll\'s options.',
  'err_backend': 'Polling needs its Supabase backend configured to create polls.',
  'err_free_limit': 'You\'ve reached your free limit of active polls. Delete a poll or wait for one to finish to make room.',
  'err_free_limit_held': 'You\'ve reached your free limit of active polls (held by {what}). Delete a poll or wait for one to finish to make room.', // {what} names what holds the last place
  'err_generic': 'Something went wrong. Please try again.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Booking page', // small chip
  'link_valid': 'Link valid for {period}', // {period} is e.g. "30 days"; followed by " · " and the next item
  'link_valid_while': 'Link valid for a while',
  'alerts_on': 'response alerts on',
  'alerts_off': 'no response alerts',
  'change_these_web': '— change these in your profile menu (top right) → Tune this app → This poll\'s options.',
  'change_these_phone': '— change these in Tune (top right) → This poll\'s options.',

  // Changing the times on a live poll
  'editing_title': 'You\'re changing the times on your live poll.',
  'editing_body': 'Until you save, anyone who opens the link is told you\'re changing the times and to check back shortly. Nobody has answered yet, so nothing is lost. Your branding stays as it was.',
  'editing_cancel': 'Cancel — keep it as it was',

  // Free allowance
  'need_more': 'Need more? Tell us', // link
  'purchased_tokens_one': '{count} purchased token',
  'purchased_tokens_other': '{count} purchased tokens',

  // Who is creating
  'creating_as': 'Creating as {name} — no email verification needed.', // {name} is the account email
  'creating_as_org': 'Creating as {name}{email} — no email verification needed.', // {name} is the company; {email} is " (their email)" or nothing
  'signed_in_as': 'Signed in as {email} (verified).',
  'not_you': 'Not you? Sign out', // link
  'your_email': 'Your email', // field label
  'email_hint_booking': 'Needed for a booking page: it\'s where we email you each booking. We\'ll send a quick code to confirm it\'s you.',
  'email_hint_alerts': 'Where we\'ll send your response alerts. We\'ll send a quick code to confirm it\'s you.',
  'email_hint_optional': 'Only if you want response alerts or to find your polls from another device — we\'ll send a quick code to confirm it. Leave it blank and you\'ll get a private admin link to manage the poll instead.',
  'email_note_alerts': 'We\'ll send a quick code to confirm it\'s you — that\'s how you\'ll manage this poll later and where we\'ll send your response alerts.',
  'email_note_web': 'We\'ll send a quick code to confirm it\'s you — that\'s how you\'ll manage this poll later. Want an email each time a guest responds? Turn that on in your profile menu (top right) → Tune this app → This poll\'s options.',
  'email_note_phone': 'We\'ll send a quick code to confirm it\'s you — that\'s how you\'ll manage this poll later. Want an email each time a guest responds? Turn that on in Tune (top right) → This poll\'s options.',
  'code_label': 'Enter the 6-digit code we emailed to {email}',
  'code_note_alerts': 'Confirming creates your poll and turns on response alerts to this address.',
  'code_note': 'Confirming creates your poll and lets you manage it later from this address.',
  'use_different_email': 'Use a different email', // link

  // The main button
  'btn_sending': 'Sending code…',
  'btn_saving': 'Saving changes…',
  'btn_creating': 'Creating poll…',
  'btn_verify_create': 'Verify & create poll',
  'btn_save': 'Save changes',
  'btn_create': 'Create poll',

  // Branding card
  'branding': 'Branding', // card heading
  'branding_imported': 'Imported from your account — override it for this poll if you like.',
  'branding_guest': 'Add your colour and logo to the poll\'s create and share pages.',
  'sign_in_branding': 'Sign in to import your branding →', // small link
  'account_logo': 'Account logo', // alt text
  'your_account': 'Your account', // stands in for a company with no name
  'account_colour': 'Account colour',
  'default_colour': 'Default colour',
  'customise': 'Customise for this poll', // button
  'booking_colour': 'Booking-page colour', // section label, shown in capitals
  'colour_orange': 'Orange', // colour swatches (tooltips and screen readers)
  'colour_blue': 'Blue',
  'colour_pink': 'Pink',
  'colour_green': 'Green',
  'custom_colour': 'Custom colour',
  'brand_name': 'Brand name',
  'brand_placeholder': 'e.g. Acme Adventures',
  'logo': 'Logo',
  'logo_preview': 'Logo preview', // alt text
  'logo_change': 'Change…', // small button, a logo is already picked
  'logo_upload': 'Upload…', // small button, no logo yet
  'logo_hint': 'PNG, JPG or WebP · large images are resized for you.',
  'use_account_branding': 'Use my account branding instead', // link

  // "Your poll is live" panel
  'live_booking': 'Your booking page is live', // heading
  'live_poll': 'Your poll is live', // heading
  'live_booking_body': 'Send this link to the one person you want to meet. The first time they pick is booked, and you’ll both get a calendar invite.',
  'live_poll_body': 'Share this link with everyone you want to invite.',
  'copied': 'Copied!', // the Copy button just after it worked; keep short
  'open_poll': 'Open your poll →', // link
  'change_times': '← Change the times', // link back to the form
  'change_times_hint': 'You can go back and change them until someone answers.',
}
