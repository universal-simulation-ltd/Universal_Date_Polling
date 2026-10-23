// common: words used all over the app — everyday buttons and counts.
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural(). `{count}` arrives
// already formatted for the language ("1,204" in English).
export default {
  // Everyday buttons
  'cancel': 'Cancel',
  'close': 'Close',
  'done': 'Done',
  'back': 'Back', // the phone app's back link, top left
  'copy': 'Copy',
  'delete': 'Delete',
  'remove': 'Remove',
  'retry': 'Try again',

  // Counts
  'responses_one': '{count} response',
  'responses_other': '{count} responses',
  'days_one': '{count} day',
  'days_other': '{count} days',

  // Product name, never translated, kept here so every screen spells it the same
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}
