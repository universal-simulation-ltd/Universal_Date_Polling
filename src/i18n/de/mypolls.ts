// German (de) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'Deine aktiven Umfragen',
  'title': 'Deine Umfragen',
  'nothing_active_one_poll': 'Gerade ist nichts aktiv – deine Umfrage ist abgelaufen.',
  'nothing_active_polls': 'Gerade ist nichts aktiv – deine Umfragen sind abgelaufen.',

  // Loading
  'load_failed': 'Deine Umfragen konnten nicht geladen werden. {retry}',
  'some_missing': 'Möglicherweise fehlen einige deiner Umfragen in dieser Liste – {retry}.',
  'some_missing_retry': 'erneut versuchen',

  // A poll row
  'booking_page': 'Buchungsseite',
  'copy_link': 'Link kopieren',
  'copied': 'Kopiert!',
  'open': 'Öffnen →',
  'booked_on': 'Gebucht: {when}',
  'confirmed_on': 'Bestätigt: {when}',

  // Deleting
  'delete_all': 'Alle {count} löschen',
  'delete_it': 'Löschen',
  'show_expired_one': '{count} abgelaufene anzeigen',
  'show_expired_other': '{count} abgelaufene anzeigen',
  'hide_expired_one': '{count} abgelaufene ausblenden',
  'hide_expired_other': '{count} abgelaufene ausblenden',
  'deleting': 'Wird gelöscht…',
  'select_poll': '{title} auswählen',
  'delete_failed_one': 'Diese Umfrage konnte nicht gelöscht werden – bitte versuche es erneut.',
  'delete_failed_some': '{failed} von {total} Umfragen konnten nicht gelöscht werden – bitte versuche es erneut.',
  'select': 'Auswählen',
  'delete_poll': '{title} löschen',
  'deleted': '„{title}“ gelöscht.',
  'undo': 'Rückgängig',

  'on_device_title': 'Auf diesem Gerät gespeichert',
  'on_device_note': 'Deine Sitzung ist beendet, daher öffnen sich diese mit ihrem privaten Verwaltungslink. Öffne eine, um sie wieder zu verwalten.',
  'copy_admin': 'Verwaltungslink kopieren',
  'forget': 'Vergessen',
}

export default mypolls
