// German (de) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'Liste für eine E-Mail kopieren →',
  'text_hide': 'E-Mail-Text ausblenden',
  'text_intro': 'Füge das direkt in eine E-Mail ein – für alle, die lieber antworten als klicken.',
  'text_include_link': 'Link zur Umfrage einfügen',
  'text_copy': 'Text kopieren',
  'copied': 'Kopiert!',

  // Copy email (CopyEmail)
  'email_button': '📋 E-Mail kopieren',
  'email_title': 'Bestätigungs-E-Mail kopieren',
  'email_description': 'Schick sie aus deinem eigenen Postfach und ändere vorher, was du möchtest.',
  'email_to': 'An',
  'email_subject': 'Betreff',
  'email_message': 'Nachricht',
  'email_loading': 'Adressen werden geladen…',
  'email_no_addresses': 'Niemand hat eine E-Mail-Adresse hinterlassen – füge die Empfänger also selbst in deinem E-Mail-Programm hinzu.',
  'email_copy': 'Kopieren',
  'email_copy_message': 'Nachricht kopieren',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Zum Kalender hinzufügen',
  'calendar_guests_one': 'Lädt die Person ein, die dann frei ist – sie steht im Gäste-Feld, und nichts wird gesendet, bevor du speicherst.',
  'calendar_guests_other': 'Lädt die {count} Personen ein, die dann frei sind – sie stehen im Gäste-Feld, und nichts wird gesendet, bevor du speicherst.',
  'calendar_ics': 'Apple / andere (.ics)',
}

export default share
