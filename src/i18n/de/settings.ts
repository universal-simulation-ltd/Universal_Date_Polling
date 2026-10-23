// German (de) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Optionen dieser Umfrage',
  'description': 'Sie gelten für die Umfrage, die du gerade erstellst.',
  'back_new_poll': 'Neue Umfrage',

  // Booking page
  'booking_lead': 'Nur wir zwei',
  'booking_label': '{lead} – mach daraus eine Sofort-Buchungsseite',
  'booking_on': 'Wer den Link von dir bekommt, wählt eine Zeit, und sie ist sofort gebucht – keine Abstimmung und nichts für dich zu bestätigen. Ihr bekommt beide eine Kalendereinladung per E-Mail.',
  'booking_off': 'Für ein Treffen zu zweit. Die andere Person wählt eine Zeit, sie wird automatisch gebucht, und ihr bekommt beide eine Kalendereinladung – statt Verfügbarkeiten zu sammeln und selbst einen Termin zu bestätigen.',

  // Link expiry
  'validity_label': 'Link bleibt gültig für',
  'validity_hint_one': 'Danach ist er {count} Tag lang schreibgeschützt und wird dann samt Antworten gelöscht.',
  'validity_hint_other': 'Danach ist er {count} Tage lang schreibgeschützt und wird dann samt Antworten gelöscht.',

  // Response alerts
  'alerts_label': 'Per E-Mail benachrichtigt werden, wenn deine Gäste antworten?',
  'alerts_signed_in': 'Wir schreiben an {email}, sobald eine neue Person antwortet.',
  'alerts_verified': 'Wir schreiben an {email} (bestätigt), sobald eine neue Person antwortet.',
  'alerts_optional': 'Gib unten deine E-Mail-Adresse an (wir schicken dir einen Code zur Bestätigung), dann benachrichtigen wir dich dort, sobald jemand antwortet.',
  'alerts_confirm': 'Zum Erstellen deiner Umfrage bestätigst du unten deine E-Mail-Adresse – kreuze dies an, dann benachrichtigen wir dich dort auch, sobald jemand antwortet.',

  // Your calendar
  'calendar_label': 'Dein Kalender',
  'calendar_body': 'Verbinde einen Kalender, und die Ansicht {calendar} schattiert die Zeiten, in denen du schon belegt bist. Nur du siehst die Schattierung – den Personen, denen du die Umfrage schickst, wird nichts angezeigt. {outlook} beschriftet jeden Block außerdem mit dem Namen des Termins; {google} schattiert nur belegte Zeiten, und dort lesen wir nie deine Terminnamen, Gäste, Orte oder Beschreibungen.',
  'calendar_view': 'Kalender',
  'add_another': 'Weiteren hinzufügen:',
  'nothing_connected': 'Noch nichts verbunden.',
  'prompt_hidden': 'Der Hinweis zum Verbinden neben dem Kalender ist ausgeblendet.',
  'show_again': 'Wieder anzeigen',
  'connected': 'verbunden',
  'connected_as': 'verbunden als {email}',
  'disconnect': 'Trennen',
  'titles_offer': 'Nur belegte Zeiten – diese Verbindung stammt aus der Zeit vor den Terminnamen.',
  'reconnect_titles': 'Neu verbinden, um sie anzuzeigen',

  // Timezone
  'timezone_label': 'Zeitzone',
  'timezone_hint': 'Alle Zeiten dieser Umfrage sind in dieser Zone angegeben; alle Gäste sehen sie in ihre eigene umgerechnet. Dort ist es gerade {time}.',
}

export default settings
