// German (de) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'Umfrage wird geladen…',
  'load_failed': 'Die Umfrage konnte nicht geladen werden.',
  'load_error_title': 'Diese Umfrage konnte nicht geladen werden',
  'load_error_fallback': 'Etwas ist schiefgelaufen.',
  'not_found_title': 'Umfrage nicht gefunden',
  'not_found_body': 'Diese Umfrage wurde vielleicht entfernt, oder der Link ist falsch.',
  'not_found_create': 'Neue Umfrage erstellen →',

  // The line under the poll's title
  'header_booked': 'Dieser Termin ist gebucht.',
  'header_waiting': 'Warten, bis dein Gast eine Zeit wählt.',
  'header_pick': 'Wähle die Zeit, die dir passt – sie wird sofort gebucht.',
  'header_first': 'Gib die erste Antwort ab.',
  'header_responded_one': '{count} Person hat geantwortet.',
  'header_responded_other': '{count} Personen haben geantwortet.',
  'times_in': 'Zeiten in {tz}',

  // The host is changing the times
  'editing_title': 'Die einladende Person ändert gerade die Zeiten, bitte schau gleich noch einmal vorbei.',
  'editing_body': 'Diese Seite aktualisiert sich von selbst, sobald sie fertig ist.',

  // The guest has just booked (booking page)
  'booked_title': 'Dein Termin ist gebucht.',
  'booked_via_calendar': 'Eine Kalendereinladung ist unterwegs an {email} – nimm sie an, dann landet das Treffen in deinem Kalender.',
  'booked_emailed': 'Wir haben die Einladung an {email} geschickt – öffne den Anhang, um sie in deinen Kalender zu übernehmen.',
  'booked_not_emailed': 'Wir konnten dir gerade keine Kopie schicken, also übernimm den Termin über die Schaltfläche oben in deinen Kalender – die Zeit selbst ist gebucht.',

  // Hints for the host
  'host_hint': 'Du lädst ein – wähle unten mit {button} den endgültigen Termin, dann sehen ihn alle mit dem Link.',
  'host_hint_button': 'Diesen Termin bestätigen',
  'host_booking_hint': 'Das ist eine Buchungsseite. Schick den Link an eine Person – welche Zeit sie auch wählt, wird sofort gebucht, und ihr bekommt beide eine Kalendereinladung.',

  // The private admin link
  'admin_checking': 'Dein Verwaltungslink wird geprüft…',
  'admin_failed': 'Dieser Verwaltungslink hat für diese Umfrage nicht funktioniert, deshalb siehst du sie als Gast. Prüfe, ob du den ganzen Link kopiert hast.',
  'admin_unsupported': 'Verwaltungslinks sind noch nicht verfügbar, deshalb siehst du diese Umfrage als Gast. Bitte versuche es später noch einmal mit dem Link.',
  'admin_link_summary': 'Dein privater Verwaltungslink',
  'signed_in_as': 'Angemeldet als {email} – {signout}',
  'sign_out': 'Abmelden',

  // An expired poll
  'expired_one': 'Der Link dieser Umfrage ist abgelaufen – sie ist jetzt schreibgeschützt und wird {count} Tag nach Ablauf gelöscht, samt allen Antworten.',
  'expired_other': 'Der Link dieser Umfrage ist abgelaufen – sie ist jetzt schreibgeschützt und wird {count} Tage nach Ablauf gelöscht, samt allen Antworten.',

  // Answering the poll
  'respond_title_days': 'Bist du an diesen Tagen frei?',
  'respond_title_times': 'Bist du zu diesen Zeiten frei?',
  'respond_folded': 'Ein Termin ist bestätigt, deshalb ist das hier eingeklappt. Du kannst deine Antworten trotzdem noch ändern.',
  'respond_intro_days': 'Gib deinen Namen ein, beantworte jeden Tag und speichere dann. Kein Konto nötig.',
  'respond_intro_times': 'Gib deinen Namen ein, beantworte jede Zeit und speichere dann. Kein Konto nötig.',
  'your_name': 'Dein Name',
  'name_placeholder': 'z. B. Sam',
  'your_email': 'Deine E-Mail-Adresse',
  'optional': '(optional)',
  'email_placeholder': 'du@example.com',
  'edit_link_ok': 'Dein Bearbeitungslink hat funktioniert: Das sind deine Antworten. Ändere sie und speichere.',
  'edit_link_failed': 'Dieser Bearbeitungslink passt zu keiner Antwort in dieser Umfrage. Vielleicht wurde sie entfernt. Du kannst unten trotzdem antworten.',
  'name_claimed': '„{name}“ hat diese Umfrage schon beantwortet, und nur diese Person kann die Antworten ändern. Wenn du das bist, öffne den Bearbeitungslink, den du bekommen hast, oder nutze das Gerät, mit dem du geantwortet hast. Wenn nicht, ergänze einen Anfangsbuchstaben oder deinen Nachnamen.',
  'name_unclaimed': '„{name}“ hat diese Umfrage schon beantwortet. Beim Speichern werden diese Antworten ersetzt – in Ordnung, wenn es deine sind. Wenn nicht, ergänze einen Anfangsbuchstaben oder deinen Nachnamen, damit du nicht die Antworten von jemand anderem überschreibst.',
  'name_similar': 'Jemand hat schon als „{name}“ geantwortet. Ergänze einen Anfangsbuchstaben oder deinen Nachnamen, damit man euch auseinanderhalten kann.',
  'email_note': 'Hinterlasse deine E-Mail-Adresse, dann bekommst du den endgültigen Termin (mit Kalendereinladung), sobald die einladende Person ihn bestätigt. Nur sie kann die Adresse sehen – nie die anderen Teilnehmer.',
  'all_day': 'Ganztägig',
  'answer_yes': 'Ja 👍',
  'answer_maybe': 'Notfalls',
  'answer_no': 'Nein 🙅‍♀️',
  'saving': 'Wird gespeichert…',
  'replace_answers': 'Antworten von {name} ersetzen',
  'save_availability': 'Meine Verfügbarkeit speichern',
  'saved': 'Gespeichert – danke!',
  'removing': 'Wird entfernt…',
  'remove_my_answers': 'Meine Antworten entfernen',
  'next_with_email': 'Die einladende Person wählt den endgültigen Termin, sobald alle geantwortet haben – wir schicken ihn dir dann per E-Mail, mit Kalendereinladung.',
  'next_without_email': 'Die einladende Person wählt den endgültigen Termin, sobald alle geantwortet haben. Öffne diesen Link dann wieder, um ihn zu sehen, oder gib oben deine E-Mail-Adresse an und speichere erneut, damit er dir geschickt wird.',

  // Errors while answering
  'err_name': 'Gib deinen Namen an, damit alle wissen, wer du bist.',
  'err_email': 'Diese E-Mail-Adresse sieht nicht richtig aus – korrigiere sie oder lass das Feld leer.',
  'err_email_store_why': 'Deine Verfügbarkeit wurde gespeichert, aber deine E-Mail-Adresse konnte nicht gespeichert werden – {why}.',
  'err_email_store': 'Deine Verfügbarkeit wurde gespeichert, aber deine E-Mail-Adresse konnte nicht gespeichert werden – speichere bitte noch einmal.',
  'err_save': 'Deine Antwort konnte nicht gespeichert werden.',

  // Removing answers
  'remove_confirm_host': 'Die Antworten von {name} aus dieser Umfrage entfernen? Das lässt sich nicht rückgängig machen.',
  'remove_confirm_own': 'Deine Antworten aus dieser Umfrage entfernen? Das lässt sich nicht rückgängig machen.',
  'remove_confirm_button': 'Entfernen',
  'err_remove_host': 'Diese Antwort konnte nicht entfernt werden – lade die Seite neu und versuche es erneut.',
  'err_remove_own': 'Nur die Person, die diese Antworten gegeben hat, kann sie entfernen.',
  'err_remove': 'Diese Antworten konnten nicht entfernt werden.',
  'err_confirm': 'Der Termin konnte nicht bestätigt werden.',

  // A booking page: the guest picks one time
  'pick_day': 'Wähle einen Tag',
  'pick_time': 'Wähle eine Zeit',
  'booking_intro': 'Was du wählst, wird sofort gebucht – du musst nichts weiter zurückschicken und brauchst kein Konto.',
  'booking_email_note': 'Hierhin geht deine Kalendereinladung. Die Adresse wird nur für diese Buchung verwendet.',
  'booking': 'Wird gebucht…',
  'book_day': 'Diesen Tag buchen',
  'book_time': 'Diese Zeit buchen',
  'pick_day_above': 'Wähle oben einen Tag',
  'pick_time_above': 'Wähle oben eine Zeit',
  'offering_days': 'Tage, die du anbietest',
  'offering_times': 'Zeiten, die du anbietest',
  'err_book_name': 'Gib deinen Namen an, damit die andere Person weiß, wen sie trifft.',
  'err_book_email': 'Gib die E-Mail-Adresse an, an die deine Einladung gehen soll.',
  'err_book': 'Diese Zeit konnte nicht gebucht werden.',
  'cancel_not_notified': 'Die Buchung ist storniert und die Seite wieder offen – aber wir konnten deinem Gast keine E-Mail schicken. Bitte gib selbst Bescheid.',
  'err_cancel': 'Diese Buchung konnte nicht storniert werden.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Dieser Termin ist gebucht – aber eine E-Mail ist nicht angekommen.',
  'notify_your_guest': 'dein Gast',
  'notify_both': 'Weder du noch {who} hat dazu eine E-Mail bekommen. Der Termin bleibt so oder so reserviert, deshalb lohnt es sich, direkt Kontakt aufzunehmen und ihn zu bestätigen.',
  'notify_invitee': 'Möglicherweise weiß {who} nicht, dass der Termin bestätigt ist, denn unsere E-Mail kam nicht an. Der Termin ist reserviert – direkt Kontakt aufzunehmen ist der zuverlässige Weg.',
  'notify_host': 'Die Details hat {who} per E-Mail bekommen, aber unsere Kopie an dich kam zurück. Prüfe die Adresse in deinem Konto, falls du sie erwartet hast.',

  // Results
  'results': 'Ergebnisse',
  'results_so_far': 'Bisherige Ergebnisse',
  'results_nobody': 'Niemand hat geantwortet.',
  'results_responded_one': '{count} Person hat geantwortet.',
  'results_responded_other': '{count} Personen haben geantwortet.',
  'no_responses_host': 'Noch keine Antworten – teile den Link, um loszulegen.',
  'no_responses_guest': 'Noch keine Antworten – deine wird die erste sein.',
  'confirmed_chip': '✓ Bestätigt',
  'best_chip': 'Top',
  'tally_maybe_one': '{count} notfalls',
  'tally_maybe_other': '{count} notfalls',
  'tally_no_one': '{count} nicht frei',
  'tally_no_other': '{count} nicht frei',
  'names_maybe': 'notfalls: {names}',
  'names_no': 'nicht frei: {names}',
  'confirm_this_time': '✓ Diesen Termin bestätigen',
  'unconfirm': 'Bestätigung aufheben',
  'remove_an_answer': 'Eine Antwort entfernen',
  'remove_an_answer_hint': 'Für Unsinn, Doppeltes oder jemanden, der den Bearbeitungslink verloren hat und neu antworten möchte.',
  'remove_name_aria': 'Antworten von {name} entfernen',

  // The confirmed banner
  'booked_by': '✓ Gebucht von {name}',
  'booked': '✓ Gebucht',
  'confirmed_time': '✓ Bestätigter Termin',
  'cancel_booking_named': 'Diese Buchung stornieren?\n\n{name} wird per E-Mail informiert, dass der Termin abgesagt ist, und die Seite öffnet sich wieder, damit eine andere Zeit gewählt werden kann.',
  'cancel_booking_unnamed': 'Diese Buchung stornieren?\n\nDein Gast wird per E-Mail informiert, dass der Termin abgesagt ist, und die Seite öffnet sich wieder, damit eine andere Zeit gewählt werden kann.',
  'cancel_booking_confirm': 'Buchung stornieren',
  'keep_it': 'Behalten',
  'working': 'Wird bearbeitet…',
  'change': 'Ändern',
  'sending': 'Wird gesendet…',
  'resend': 'Bestätigung erneut senden',
  'email_again': 'Erneut an Teilnehmer senden',
  'email_this_time': 'Termin an Teilnehmer senden',
  'sent_one': 'An {count} Person gesendet ✓',
  'sent_other': 'An {count} Personen gesendet ✓',
  'no_one_email': 'Noch hat niemand eine E-Mail-Adresse hinterlassen.',
  'guest_emailed_named': '{name} hat die Einladung bei der Buchung per E-Mail bekommen ✓',
  'guest_emailed': 'Dein Gast hat die Einladung bei der Buchung per E-Mail bekommen ✓',
  'respondents_emailed': 'Die Teilnehmer wurden per E-Mail informiert ✓',
  'notify_hint': 'Schickt den bestätigten Termin und eine Kalendereinladung an alle, die eine E-Mail-Adresse hinterlassen haben.',

  // The host's own calendar
  'adding': 'Wird hinzugefügt…',
  'update_in_calendar': 'In meinem Kalender aktualisieren',
  'add_to_my_provider': 'Zu meinem {provider} hinzufügen',
  'add_to_my_calendars': 'Zu meinen Kalendern hinzufügen',
  'reconnect_to_add': '{provider} neu verbinden, um ihn hinzuzufügen',
  'added_to': 'Zu {providers} hinzugefügt ✓',
  'list_two': '{a} und {b}',
  'cal_stale': 'Dein Kalender wurde nur für die Verfügbarkeit verbunden – verbinde ihn einmal neu, damit Termine eingetragen werden können.',
  'cal_stale_hint': 'Nur für die Verfügbarkeit verbunden. Einmal neu verbinden, dann landet die Zeit direkt in deinem Kalender.',
  'cal_add_hint': 'Trägt diesen Termin in deinen eigenen Kalender ein. Zweimal klicken schadet nicht – derselbe Eintrag wird aktualisiert.',
  'cal_expired': 'Deine Kalenderverbindung ist abgelaufen – verbinde sie auf der Erstellungsseite neu.',
  'cal_add_failed': 'Das konnte nicht in deinen Kalender eingetragen werden.',
  'cal_popups': 'Erlaube Pop-ups für diese Seite, um deinen Kalender neu zu verbinden.',
  'cal_claim_failed': 'Die Verbindung zu deinem Kalender konnte nicht abgeschlossen werden.',
  'cal_reconnect_failed': 'Das erneute Verbinden konnte nicht gestartet werden.',
  'err_send': 'Die E-Mails konnten nicht gesendet werden.',

  // The timezone bar
  'tz_poll_in': 'Diese Umfrage verwendet {tz} {zone}.',
  'tz_show_mine': 'Zeiten in deiner Zeitzone anzeigen ({tz})',
  'tz_reset': 'Auf die Zeitzone der Umfrage zurücksetzen',
  'your_time': '{time} deiner Zeit',
  'your_time_dated': '{date}, {time} deiner Zeit',

  // Folding sections
  'show': 'Anzeigen ▾',
  'hide': 'Ausblenden ▴',

  'brand_alt': 'Marke',
}

export default poll
