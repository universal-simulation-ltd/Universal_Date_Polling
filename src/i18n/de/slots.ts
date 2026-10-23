// German (de) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability (tabs)
  'view_form': 'Eintippen',
  'view_calendar': 'Kalender',
  'view_days': 'Ganze Tage',
  'view_none': 'Nichts gewählt',

  // Slot lengths, abbreviated
  'duration_m': '{m} min',
  'duration_h': '{h} h',
  'duration_hm': '{h} h {m} min',

  // Whole days (a month calendar)
  'previous_month': 'Vorheriger Monat',
  'next_month': 'Nächster Monat',
  'no_days_yet': 'Noch keine Tage – klicke die Tage an, die du vorschlagen möchtest.',
  'days_selected_one': '{count} Tag ausgewählt',
  'days_selected_other': '{count} Tage ausgewählt',
  'remove_day': '{day} entfernen',

  // Type in (date + time + length form)
  'date': 'Datum',
  'time': 'Uhrzeit',
  'length': 'Dauer',
  'add_time': 'Zeit hinzufügen',
  'no_times_yet': 'Noch keine Zeiten – wähle oben Datum und Uhrzeit und klicke auf {button}.',
  'remove_time': '{day} {time} entfernen',
  'past_moved': 'Du kannst keine Zeit in der Vergangenheit wählen – sie wurde auf {day}, {time} verschoben.',
  'dst_gap': 'Achtung – {time} gibt es am {day} in {zone} nicht: In dieser Nacht werden die Uhren vorgestellt, deshalb liegt dieses Zeitfenster bei {lands}.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Vorherige Woche',
  'next_week': 'Nächste Woche',
  'this_week': 'Diese Woche',
  'grid_help': 'Klicke auf einen Tag, um ein einstündiges Zeitfenster zu setzen, oder zieh in einer Spalte nach unten, um die Dauer festzulegen. Zieh ein Zeitfenster, um es innerhalb des Tages zu verschieben; klicke darauf, um es zu entfernen.',
  'busy_legend': 'Gestreift = belegt in deinem verbundenen Kalender.',
  'syncing': 'Kalender wird synchronisiert…',
  'syncing_sr': 'Dein Kalender wird synchronisiert.',
  'time_passed': 'Diese Zeit ist schon vorbei – wähle ein späteres Zeitfenster.',
  'already_proposed': 'Diese Zeit hast du schon vorgeschlagen.',
  'slot_title': 'Ziehen zum Verschieben · klicken zum Entfernen {time} · {length}',

  // Timezone picker
  'show_times_in': 'Zeiten anzeigen in',
  'search_zones': 'Zeitzonen suchen',
  'search_zones_placeholder': 'Zeitzonen suchen…',
  'no_matching_zones': 'Keine passenden Zeitzonen.',
}

export default slots
