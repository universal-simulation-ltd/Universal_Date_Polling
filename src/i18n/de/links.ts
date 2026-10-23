// German (de) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'Dein privater Verwaltungslink',
  'admin_body_email': 'Behalte ihn für dich. Er öffnet die Verwaltungsseite der Umfrage auf jedem Gerät, auf dem du dieselbe E-Mail-Adresse bestätigt hast – dort kannst du einen Termin bestätigen, die Umfrage ändern oder sie löschen.',
  'admin_body_no_email': 'Behalte ihn für dich – wer ihn hat, kann die Umfrage verwalten: einen Termin bestätigen, sie ändern oder sie löschen. Bewahre ihn sicher auf: Nur damit kannst du die Umfrage von einem anderen Gerät aus verwalten – oder hier, falls die Daten dieses Browsers gelöscht werden.',
  'admin_field': 'Privater Verwaltungslink',

  // A respondent's own edit link
  'edit_title': 'Dein Bearbeitungslink',
  'edit_body': 'Mit diesem Gerät kannst du diese Antworten ändern. Um sie auf einem anderen Gerät zu ändern, öffne diesen Link dort. Behalte ihn für dich: Wer ihn hat, kann deine Antworten ändern oder entfernen.',

  'copied': 'Kopiert!',
}

export default links
