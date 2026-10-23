// app: the website shell (App.tsx): footer, Tune this app rows.
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // Footer
  'footer_credit': 'With {heart} from {link}', // {heart} = a ♥ symbol, {link} = "UNISIM.co.uk"
  'footer_love': 'love', // what screen readers say for the ♥
  'github_label': 'Universal Date Polling on GitHub', // screen-reader label of the GitHub link
  'github_title': 'View source on GitHub', // hover text of the GitHub link

  // Tune this app rows
  'poll_options': "This poll's options", // opens the poll's options panel
  'poll_options_info': 'Booking page, link expiry, response alerts, calendar and timezone', // the row's one-line description
  'slot_view_label': 'Availability opens on', // which availability picker the create page opens on
}
