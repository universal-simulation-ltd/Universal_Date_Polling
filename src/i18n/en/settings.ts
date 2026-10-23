// settings: This poll's options (components/SettingsDialog.tsx, and the
// options inside it, which components/CreatePoll.tsx draws).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  'title': 'This poll\'s options', // the dialog / page title; other sentences name it, keep them in step
  'description': 'These apply to the poll you\'re creating now.',
  'back_new_poll': 'New poll', // phone app: the back link at the top of this page, back to the create screen

  // Booking page
  'booking_lead': 'Just the two of us', // bold start of booking_label
  'booking_label': '{lead} — make this an instant booking page',
  'booking_on': 'Whoever you send the link to picks one time and it\'s booked on the spot — no votes, and nothing for you to confirm. You\'ll both get a calendar invite by email.',
  'booking_off': 'For a one-to-one. They pick a time, it books itself, and you both get a calendar invite — instead of collecting availability and confirming a time yourself.',

  // Link expiry
  'validity_label': 'Link stays valid for', // section label, shown in capitals
  'validity_hint_one': 'Then it\'s read-only for {count} day, and deleted with its answers.',
  'validity_hint_other': 'Then it\'s read-only for {count} days, and deleted with its answers.',

  // Response alerts
  'alerts_label': 'Want to be emailed when your guests respond?', // tick box
  'alerts_signed_in': 'We\'ll email {email} each time a new person responds.',
  'alerts_verified': 'We\'ll email {email} (confirmed) each time a new person responds.',
  'alerts_optional': 'Add your email below (we\'ll send a code to confirm it) and we\'ll alert you there each time someone responds.',
  'alerts_confirm': 'You\'ll confirm your email below to create your poll — check this and we\'ll also alert you there each time someone responds.',

  // Your calendar
  'calendar_label': 'Your calendar', // section label, shown in capitals
  // {calendar} is calendar_view in bold; {outlook} and {google} are the product
  // names "Outlook / Microsoft 365" and "Google Calendar" in bold
  'calendar_body': 'Connect a calendar and the {calendar} view shades the times you\'re already busy. Only you ever see the shading — nothing is shown to the people you send the poll to. {outlook} also labels each block with the event\'s name; {google} shades busy times only, and we never read your event names, guests, locations or descriptions there.',
  'calendar_view': 'Calendar', // the slot picker's Calendar tab, named in calendar_body
  'add_another': 'Add another:', // before the Connect buttons, when one calendar is connected
  'nothing_connected': 'Nothing connected yet.',
  'prompt_hidden': 'The connect prompt beside the calendar is hidden.',
  'show_again': 'Show it again', // link after prompt_hidden
  'connected': 'connected', // after a calendar's name: "Google Calendar connected"
  'connected_as': 'connected as {email}', // after a calendar's name
  'disconnect': 'Disconnect', // link
  'titles_offer': 'Busy times only — this connection predates event names.',
  'reconnect_titles': 'Reconnect to show them', // link after titles_offer

  // Timezone
  'timezone_label': 'Timezone', // section label, shown in capitals
  'timezone_hint': 'Every time on this poll is written in this zone; each guest sees it converted to theirs. It\'s {time} there now.', // {time} is the clock there, in bold
}
