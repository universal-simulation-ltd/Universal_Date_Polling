// German (de) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Finde einen Termin,',
  'headline_line2': 'der allen passt',
  'intro': 'Biete ein paar Zeiten an, teile den Link, und alle kreuzen an, was ihnen passt. Kein Konto nötig – weder für dich noch für sie.',
  'logo_alt': 'Logo von {name}',
  'logo_alt_yours': 'Dein Logo',

  // Title and location
  'title_label': 'Titel der Umfrage',
  'title_placeholder': 'z. B. Team-Treffen – Woche ab dem 9.',
  'location_label': 'Ort oder Meeting-Link',
  'optional': '(optional)',
  'location_placeholder': 'z. B. Besprechungsraum 5 oder ein Teams-/Zoom-/Meet-Link',
  'location_hint': 'Wird allen in der Umfrage angezeigt und in die Kalendereinladung übernommen.',

  // Times to offer
  'times_heading': 'Angebotene Zeiten',
  'times_hint_none': 'Wie möchtest du sie hinzufügen? Tippe sie ein, zieh sie in einen Kalender oder biete ganze Tage an.',
  'times_hint_days': 'Die Teilnehmer kreuzen die ganzen Tage an, an denen sie frei sind – gut für Reisen und mehrtägige Pläne.',
  'tz_line': 'Es ist {time}. Du bist in {zone}.',
  'tz_change': 'Zeitzone ändern?',

  // Suggest times
  'suggest_question': 'Unsicher, was du vorschlagen sollst?',
  'suggest_intro_one': 'Wir wählen {count} Zeit, in der du frei bist – werktags, {from}–{to} {zone}, höchstens ein Vormittag und ein Nachmittag pro Tag.',
  'suggest_intro_other': 'Wir wählen {count} Zeiten, in denen du frei bist – werktags, {from}–{to} {zone}, höchstens ein Vormittag und ein Nachmittag pro Tag.',
  'suggest_button_one': '{count} Zeit vorschlagen',
  'suggest_button_other': '{count} Zeiten vorschlagen',
  'suggest_finding': 'Suche freie Zeit…',
  'suggest_finding_sr': 'Suche freie Zeit in deinem Kalender.',
  'suggest_none_one': 'Keine freie Zeit zwischen {from} und {to} an einem Werktag innerhalb von {count} Tag – füge Zeiten von Hand hinzu oder schaffe etwas Platz und versuche es erneut.',
  'suggest_none_other': 'Keine freie Zeit zwischen {from} und {to} an einem Werktag in den nächsten {count} Tagen – füge Zeiten von Hand hinzu oder schaffe etwas Platz und versuche es erneut.',
  'suggest_some': '{found} von {total} hinzugefügt – mehr freie Zeit gab es nicht. Zum Verschieben ziehen, zum Entfernen anklicken.',
  'suggest_added_one': '{count} Zeit aus deiner freien Zeit hinzugefügt. Zum Verschieben ziehen, zum Entfernen anklicken.',
  'suggest_added_other': '{count} Zeiten aus deiner freien Zeit hinzugefügt. Zum Verschieben ziehen, zum Entfernen anklicken.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Sieh, wann du schon belegt bist',
  'cal_prompt_connect': '{lead} – verbinde einen Kalender, und deine belegten Zeiten werden im Raster schattiert. Nur du siehst sie.',
  'cal_other_lead': 'Auch anderswo belegt?',
  'cal_prompt_other': '{lead} Verbinde deinen anderen Kalender, dann schattiert er das Raster ebenfalls.',
  'cal_prompt_guest': '{lead} – bestätige deine E-Mail-Adresse (dieselbe, mit der deine Umfrage gespeichert wird) und verbinde dann deinen Kalender. Nur du siehst die Schattierung.',
  'connect_google': 'Google Calendar verbinden',
  'connect_outlook': 'Outlook verbinden',
  'dont_show_again': 'Nicht mehr anzeigen',
  'cal_later_web': 'Du kannst jederzeit einen verbinden: über dein Profilmenü (oben rechts) → Diese App anpassen → Optionen dieser Umfrage.',
  'cal_later_phone': 'Du kannst jederzeit einen verbinden: über Anpassen (oben rechts) → Optionen dieser Umfrage.',
  'verify': 'Bestätigen',
  'verifying': 'Wird bestätigt…',
  'different_email': 'Andere E-Mail-Adresse',
  'code_sent': 'Wir haben einen 6-stelligen Code an {email} geschickt.',
  'sending': 'Wird gesendet…',
  'email_me_code': 'Code per E-Mail senden',

  // Calendar errors
  'err_email_first': 'Gib zuerst eine gültige E-Mail-Adresse ein.',
  'err_code': 'Gib den Code aus deiner E-Mail ein.',
  'cal_read_failed_google': 'Dein Google-Kalender konnte nicht gelesen werden – die Verbindung steht, aber die Abfrage der Verfügbarkeit ist fehlgeschlagen. Versuche es gleich noch einmal oder trenne die Verbindung und verbinde ihn neu.',
  'cal_read_failed_outlook': 'Dein Outlook-Kalender konnte nicht gelesen werden – die Verbindung steht, aber die Abfrage der Verfügbarkeit ist fehlgeschlagen. Versuche es gleich noch einmal oder trenne die Verbindung und verbinde ihn neu.',
  'cal_read_failed_both': 'Deine Google- und Outlook-Kalender konnten nicht gelesen werden – die Verbindungen stehen, aber die Abfrage der Verfügbarkeit ist fehlgeschlagen. Versuche es gleich noch einmal oder trenne die Verbindungen und verbinde sie neu.',
  'cal_expired': 'Eine Kalenderverbindung ist abgelaufen – bitte verbinde sie erneut.',
  'cal_expired_suggest': 'Eine Kalenderverbindung ist abgelaufen – bitte verbinde sie erneut und lass dir dann Zeiten vorschlagen.',
  'cal_read_failed_suggest': 'Dein Kalender konnte gerade nicht gelesen werden, deshalb wurde nichts vorgeschlagen – versuche es gleich noch einmal.',
  'cal_cancelled': 'Die Kalenderverbindung wurde abgebrochen oder ist fehlgeschlagen.',
  'popup_blocked': 'Dein Browser hat das Pop-up blockiert – erlaube Pop-ups für diese Seite und versuche es erneut.',

  // Logo errors
  'logo_type': 'Das Logo muss ein PNG-, JPG- oder WebP-Bild sein.',
  'logo_size': 'Das Logo darf höchstens 10 MB groß sein.',

  // Checks before creating
  'err_title': 'Gib deiner Umfrage einen Titel.',
  'err_add_day': 'Füge mindestens einen Tag hinzu.',
  'err_add_time': 'Füge mindestens ein Datum mit Uhrzeit hinzu.',
  'err_email': 'Gib eine gültige E-Mail-Adresse ein.',
  'err_booking_email': 'Eine Buchungsseite schickt dir jede Buchung per E-Mail und braucht deshalb deine E-Mail-Adresse.',
  'err_alerts_email': 'Gib deine E-Mail-Adresse an, um Antwort-Benachrichtigungen zu erhalten, oder schalte sie unter Optionen dieser Umfrage aus.',
  'err_backend': 'Zum Erstellen von Umfragen muss das Supabase-Backend eingerichtet sein.',
  'err_free_limit': 'Du hast dein Limit an kostenlosen aktiven Umfragen erreicht. Lösche eine Umfrage oder warte, bis eine endet, um Platz zu schaffen.',
  'err_free_limit_held': 'Du hast dein Limit an kostenlosen aktiven Umfragen erreicht (belegt durch {what}). Lösche eine Umfrage oder warte, bis eine endet, um Platz zu schaffen.',
  'err_generic': 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Buchungsseite',
  'link_valid': 'Link gültig für {period}',
  'link_valid_while': 'Link eine Weile gültig',
  'alerts_on': 'Antwort-Benachrichtigungen an',
  'alerts_off': 'keine Antwort-Benachrichtigungen',
  'change_these_web': '– ändern kannst du das in deinem Profilmenü (oben rechts) → Diese App anpassen → Optionen dieser Umfrage.',
  'change_these_phone': '– ändern kannst du das unter Anpassen (oben rechts) → Optionen dieser Umfrage.',

  // Changing the times on a live poll
  'editing_title': 'Du änderst gerade die Zeiten deiner laufenden Umfrage.',
  'editing_body': 'Bis du speicherst, erfahren alle, die den Link öffnen, dass du die Zeiten änderst und sie gleich noch einmal vorbeischauen sollen. Es hat noch niemand geantwortet, also geht nichts verloren. Dein Branding bleibt, wie es war.',
  'editing_cancel': 'Abbrechen – so lassen, wie es war',

  // Free allowance
  'need_more': 'Brauchst du mehr? Sag uns Bescheid',
  'purchased_tokens_one': '{count} gekauftes Token',
  'purchased_tokens_other': '{count} gekaufte Tokens',

  // Who is creating
  'creating_as': 'Du erstellst als {name} – keine E-Mail-Bestätigung nötig.',
  'creating_as_org': 'Du erstellst als {name}{email} – keine E-Mail-Bestätigung nötig.',
  'signed_in_as': 'Angemeldet als {email} (bestätigt).',
  'not_you': 'Nicht du? Abmelden',
  'your_email': 'Deine E-Mail-Adresse',
  'email_hint_booking': 'Für eine Buchungsseite nötig: Dorthin schicken wir dir jede Buchung. Wir senden dir kurz einen Code, um zu bestätigen, dass du es bist.',
  'email_hint_alerts': 'Dorthin schicken wir deine Antwort-Benachrichtigungen. Wir senden dir kurz einen Code, um zu bestätigen, dass du es bist.',
  'email_hint_optional': 'Nur, wenn du Antwort-Benachrichtigungen möchtest oder deine Umfragen auf einem anderen Gerät wiederfinden willst – wir senden dir kurz einen Code zur Bestätigung. Lässt du das Feld leer, bekommst du stattdessen einen privaten Verwaltungslink, um die Umfrage zu verwalten.',
  'email_note_alerts': 'Wir senden dir kurz einen Code, um zu bestätigen, dass du es bist – so verwaltest du diese Umfrage später, und dorthin schicken wir deine Antwort-Benachrichtigungen.',
  'email_note_web': 'Wir senden dir kurz einen Code, um zu bestätigen, dass du es bist – so verwaltest du diese Umfrage später. Möchtest du jedes Mal eine E-Mail, wenn jemand antwortet? Schalte das in deinem Profilmenü (oben rechts) → Diese App anpassen → Optionen dieser Umfrage ein.',
  'email_note_phone': 'Wir senden dir kurz einen Code, um zu bestätigen, dass du es bist – so verwaltest du diese Umfrage später. Möchtest du jedes Mal eine E-Mail, wenn jemand antwortet? Schalte das unter Anpassen (oben rechts) → Optionen dieser Umfrage ein.',
  'code_label': 'Gib den 6-stelligen Code ein, den wir an {email} geschickt haben',
  'code_note_alerts': 'Mit der Bestätigung wird deine Umfrage erstellt, und die Antwort-Benachrichtigungen an diese Adresse werden eingeschaltet.',
  'code_note': 'Mit der Bestätigung wird deine Umfrage erstellt, und du kannst sie später über diese Adresse verwalten.',
  'use_different_email': 'Andere E-Mail-Adresse verwenden',

  // The main button
  'btn_sending': 'Code wird gesendet…',
  'btn_saving': 'Änderungen werden gespeichert…',
  'btn_creating': 'Umfrage wird erstellt…',
  'btn_verify_create': 'Bestätigen & Umfrage erstellen',
  'btn_save': 'Änderungen speichern',
  'btn_create': 'Umfrage erstellen',

  // Branding card
  'branding': 'Branding',
  'branding_imported': 'Aus deinem Konto übernommen – für diese Umfrage kannst du es gern ändern.',
  'branding_guest': 'Füge den Erstellungs- und Teilen-Seiten der Umfrage deine Farbe und dein Logo hinzu.',
  'sign_in_branding': 'Melde dich an, um dein Branding zu übernehmen →',
  'account_logo': 'Konto-Logo',
  'your_account': 'Dein Konto',
  'account_colour': 'Kontofarbe',
  'default_colour': 'Standardfarbe',
  'customise': 'Für diese Umfrage anpassen',
  'booking_colour': 'Farbe der Buchungsseite',
  'colour_orange': 'Orange',
  'colour_blue': 'Blau',
  'colour_pink': 'Pink',
  'colour_green': 'Grün',
  'custom_colour': 'Eigene Farbe',
  'brand_name': 'Markenname',
  'brand_placeholder': 'z. B. Acme Adventures',
  'logo': 'Logo',
  'logo_preview': 'Logo-Vorschau',
  'logo_change': 'Ändern…',
  'logo_upload': 'Hochladen…',
  'logo_hint': 'PNG, JPG oder WebP · große Bilder werden automatisch verkleinert.',
  'use_account_branding': 'Stattdessen mein Konto-Branding verwenden',

  // "Your poll is live" panel
  'live_booking': 'Deine Buchungsseite ist online',
  'live_poll': 'Deine Umfrage ist online',
  'live_booking_body': 'Schick diesen Link an die eine Person, die du treffen möchtest. Die erste Zeit, die sie wählt, wird gebucht, und ihr bekommt beide eine Kalendereinladung.',
  'live_poll_body': 'Teile diesen Link mit allen, die du einladen möchtest.',
  'copied': 'Kopiert!',
  'open_poll': 'Deine Umfrage öffnen →',
  'change_times': '← Zeiten ändern',
  'change_times_hint': 'Du kannst zurückgehen und sie ändern, bis jemand antwortet.',
}

export default create
