// links: the admin and edit link boxes (AdminLinkBox, EditLinkBox).
// English (en-GB) is the source; every other language is typed against this
// file. Keys are snake_case; a comment after a key tells the translator where
// it shows and any length limit. Placeholders are {name}; a plural is a stem
// with `_one` / `_other` keys, read through t.plural().
export default {
  // The host's private admin link
  'admin_title': 'Your private admin link',
  'admin_body_email': "Keep this one to yourself. It opens the poll's admin page on any device where you've confirmed the same email address, so you can confirm a time, change the poll or delete it there.",
  'admin_body_no_email': "Keep this one to yourself — anyone who has it can manage the poll: confirm a time, change it or delete it. Save it somewhere safe: it's the only way to manage the poll from another device, or here if this browser's data is cleared.",
  'admin_field': 'Private admin link', // screen-reader label of the link field

  // A respondent's own edit link
  'edit_title': 'Your edit link', // heading, and the link field's screen-reader label
  'edit_body': 'This device can change these answers. To change them from another device, open this link there. Keep it to yourself: anyone who has it can change or remove your answers.',

  'copied': 'Copied!', // the Copy button just after it worked
}
