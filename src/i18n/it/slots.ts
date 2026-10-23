// Italian (it) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability
  'view_form': 'Digita',
  'view_calendar': 'Calendario',
  'view_days': 'Giorni interi',
  'view_none': 'Nessuna scelta',

  // Slot lengths, abbreviated
  'duration_m': '{m} min',
  'duration_h': '{h} h',
  'duration_hm': '{h} h {m} min',

  // Whole days (a month calendar)
  'previous_month': 'Mese precedente',
  'next_month': 'Mese successivo',
  'no_days_yet': 'Ancora nessun giorno: fai clic sui giorni che vuoi proporre.',
  'days_selected_one': '{count} giorno selezionato',
  'days_selected_other': '{count} giorni selezionati',
  'remove_day': 'Rimuovi {day}',

  // Type in (date + time + length form)
  'date': 'Data',
  'time': 'Ora',
  'length': 'Durata',
  'add_time': 'Aggiungi orario',
  'no_times_yet': 'Ancora nessun orario: scegli una data e un’ora qui sopra e premi {button}.',
  'remove_time': 'Rimuovi {day} {time}',
  'past_moved': 'Non puoi scegliere un orario nel passato: è stato spostato in avanti a {day}, {time}.',
  'dst_gap': 'Attenzione: le {time} non esistono il {day} nel fuso {zone}, perché quella notte le lancette vanno avanti, quindi questa fascia oraria cade alle {lands}.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Settimana precedente',
  'next_week': 'Settimana successiva',
  'this_week': 'Oggi',
  'grid_help': 'Fai clic su un giorno per inserire una fascia di 1 ora, oppure trascina verso il basso in una colonna per impostarne la durata. Trascina una fascia per spostarla nello stesso giorno; fai clic su di essa per rimuoverla.',
  'busy_legend': 'A righe = occupato nel calendario collegato.',
  'syncing': 'Sincronizzazione del calendario…',
  'syncing_sr': 'Sincronizzazione del calendario in corso.',
  'time_passed': 'Quell’orario è già passato: scegli una fascia futura.',
  'already_proposed': 'Hai già proposto quell’orario.',
  'slot_title': 'Trascina per spostare · fai clic per rimuovere {time} · {length}',

  // Timezone picker
  'show_times_in': 'Mostra gli orari in',
  'search_zones': 'Cerca fusi orari',
  'search_zones_placeholder': 'Cerca fusi orari…',
  'no_matching_zones': 'Nessun fuso orario corrispondente.',
}

export default slots
