// native: the phone app chrome (native/PhoneChrome.tsx, native/parts.tsx).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
//
// The SDK's own rows on these pages (Tune this app, Colour scheme, Language,
// Knowledge base, About this app, Reset to defaults…) come translated from the
// SDK and are not here.
export default {
  // Tune this app page — the back link at its top left names the screen
  // underneath it. Short: ≤ 12 characters.
  'back_poll': 'Poll', // back to the poll page
  'back_new_poll': 'New poll', // back to the create screen

  // Tune this app ▸ the poll's own options row (opens the create screen's
  // options panel)
  'poll_options': "This poll's options",
  'poll_options_note': 'Booking page, link expiry, response alerts, calendar and timezone',
  // Tune this app ▸ which availability picker the create screen opens on
  'availability_opens_on': 'Availability opens on',

  // About this app page
  'about_blurb': 'Propose some times, share one link, and see when everyone is free. Nobody needs an account to answer.',

  // Knowledge base page — the search box above the article list
  'search': 'Search',

  // A yes/no question shown as a bottom sheet in place of the browser's
  // confirm box: the default confirm button
  'confirm_ok': 'OK',
}
