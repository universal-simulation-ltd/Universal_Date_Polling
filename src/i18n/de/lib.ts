// German (de) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The poll's dates as a plain-text list a host pastes into an email
  'list_ask_times': 'Welche dieser Zeiten passen dir?',
  'list_ask_days': 'Welche dieser Tage passen dir?',
  'list_book_time': 'Wähle die Zeit, die dir passt – sie wird gebucht, sobald du sie auswählst.',
  'list_book_day': 'Wähle den Tag, der dir passt – er wird gebucht, sobald du ihn auswählst.',
  'list_all_times': 'Alle Zeiten in {tz}.',
  'list_line_timed': '{date} um {time}',
  'list_link_poll': 'Antworte gern per E-Mail oder trag deine Wünsche hier ein:',
  'list_link_booking': 'Buche deinen Termin hier:',
  'where': 'Ort: {location}',

  // The confirmation email a host copies into their own mail client
  'email_subject': 'Termin bestätigt',
  'email_subject_title': 'Termin bestätigt: {title}',
  'email_greeting': 'Hallo zusammen,',
  'email_confirmed': 'wir haben einen Termin bestätigt:',
  'email_confirmed_title': 'der Termin für {title} steht fest:',
  'email_when_timed': '{date} um {time} {tz}',
  'email_add_calendar': 'Über die Umfrage könnt ihr ihn in euren Kalender übernehmen:',
  'email_sign_off': 'Bis dann!',

  // The calendar event (.ics file, Google and Outlook "add event" links)
  'event_title_fallback': 'Besprechung',
  'event_description': 'Geplant mit Universal Date Polling.',
  'event_view_poll': 'Umfrage ansehen oder aktualisieren: {url}',

  // "Your polls" rows
  'summary_no_times': 'Keine Zeiten',
  'summary_no_dates': 'Keine Tage',
  'summary_times_one': '{count} Zeit',
  'summary_times_other': '{count} Zeiten',
  'summary_dates_one': '{count} Tag',
  'summary_dates_other': '{count} Tage',
  'confirmed_at': '{date}, {time}',
  'booked': 'Gebucht',
  'not_booked': 'Noch nicht gebucht',
  'no_responses': 'Noch keine Antworten',
  'expires_today': 'Läuft heute ab',
  'expires_tomorrow': 'Läuft morgen ab',
  'expires_in_one': 'Läuft in {count} Tag ab',
  'expires_in_other': 'Läuft in {count} Tagen ab',
  'expired_deleted_today': 'Abgelaufen · wird heute gelöscht',
  'expired_deleted_tomorrow': 'Abgelaufen · wird morgen gelöscht',
  'expired_deleted_in_one': 'Abgelaufen · wird in {count} Tag gelöscht',
  'expired_deleted_in_other': 'Abgelaufen · wird in {count} Tagen gelöscht',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Diese Buchungsseite löschen? Die Buchung wird NICHT storniert – die Einladung bleibt in beiden Kalendern.',
  'delete_booking': 'Diese Buchungsseite löschen?',
  'delete_poll': 'Diese Umfrage löschen?',
  'delete_poll_responses_one': 'Diese Umfrage und ihre {count} Antwort löschen?',
  'delete_poll_responses_other': 'Diese Umfrage und ihre {count} Antworten löschen?',
  'delete_expired_one': 'Diese abgelaufene Umfrage und ihre Antworten löschen? Das lässt sich nicht rückgängig machen.',
  'delete_expired_other': 'Alle {count} abgelaufenen Umfragen und ihre Antworten löschen? Das lässt sich nicht rückgängig machen.',
  'cannot_undo': 'Das lässt sich nicht rückgängig machen.',
  'delete_active': 'Alle {polls} aktiven Umfragen löschen? Ihre Links funktionieren sofort nicht mehr, und das lässt sich nicht rückgängig machen.',
  'delete_active_responses_one': 'Alle {polls} aktiven Umfragen und ihre {count} Antwort löschen? Ihre Links funktionieren sofort nicht mehr, und das lässt sich nicht rückgängig machen.',
  'delete_active_responses_other': 'Alle {polls} aktiven Umfragen und ihre {count} Antworten löschen? Ihre Links funktionieren sofort nicht mehr, und das lässt sich nicht rückgängig machen.',
  'delete_active_booked': 'Bereits gebuchte Termine werden NICHT storniert – deren Einladungen bleiben in beiden Kalendern.',

  // The free allowance banner on the create screen
  'near_limit_one': 'Du hast {used} von {count} kostenlosen aktiven Umfrage genutzt.',
  'near_limit_other': 'Du hast {used} von {count} kostenlosen aktiven Umfragen genutzt.',
  'at_limit_one': 'Du hast deine {count} kostenlose aktive Umfrage genutzt. Lösche eine Umfrage oder warte, bis eine endet, um Platz zu schaffen.',
  'at_limit_other': 'Du hast alle {count} kostenlosen aktiven Umfragen genutzt. Lösche eine Umfrage oder warte, bis eine endet, um Platz zu schaffen.',
  'at_limit_unknown': 'Du hast deine kostenlosen aktiven Umfragen aufgebraucht. Lösche eine Umfrage oder warte, bis eine endet, um Platz zu schaffen.',

  // Error messages
  'err_verify': 'Bestätigung fehlgeschlagen – bitte versuche es erneut.',
  'err_session': 'Die Sitzung konnte nicht gestartet werden – bitte versuche es erneut.',
  'err_logo_type': 'Das Logo muss ein PNG-, JPG- oder WebP-Bild sein.',
  'err_logo_large': 'Dieses Bild ist zu groß zum Hochladen – versuche es mit einem kleineren.',
  'err_send_emails_retry': 'Die E-Mails konnten nicht gesendet werden – bitte versuche es erneut.',
  'err_send_emails': 'Die E-Mails konnten nicht gesendet werden.',
  'err_book_retry': 'Diese Zeit konnte nicht gebucht werden – bitte versuche es erneut.',
  'err_book': 'Diese Zeit konnte nicht gebucht werden.',
  'err_cancel_booking_retry': 'Diese Buchung konnte nicht storniert werden – bitte versuche es erneut.',
  'err_cancel_booking': 'Diese Buchung konnte nicht storniert werden.',
  'err_calendar_retry': 'Kalenderanfrage fehlgeschlagen – bitte versuche es erneut.',
  'err_calendar': 'Kalenderanfrage fehlgeschlagen.',
  'err_busy_load': 'Deine Verfügbarkeit im Kalender konnte nicht geladen werden.',
  'err_calendar_add': 'Das konnte nicht in deinen Kalender eingetragen werden.',
  'err_calendar_remove': 'Das konnte nicht aus deinem Kalender entfernt werden.',
}

export default lib
