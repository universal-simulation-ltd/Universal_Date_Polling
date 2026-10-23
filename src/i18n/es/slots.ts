// Spanish (es) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability
  'view_form': 'Escribir',
  'view_calendar': 'Calendario',
  'view_days': 'Días completos',
  'view_none': 'Sin elegir',

  // Slot lengths, abbreviated
  'duration_m': '{m} min',
  'duration_h': '{h} h',
  'duration_hm': '{h} h {m} min',

  // Whole days (a month calendar)
  'previous_month': 'Mes anterior',
  'next_month': 'Mes siguiente',
  'no_days_yet': 'Todavía no hay días: haz clic en los días que quieras proponer.',
  'days_selected_one': '{count} día seleccionado',
  'days_selected_other': '{count} días seleccionados',
  'remove_day': 'Quitar {day}',

  // Type in (date + time + length form)
  'date': 'Fecha',
  'time': 'Hora',
  'length': 'Duración',
  'add_time': 'Añadir hora',
  'no_times_yet': 'Todavía no hay horas: elige una fecha y una hora arriba y pulsa {button}.',
  'remove_time': 'Quitar {day} {time}',
  'past_moved': 'No puedes elegir una hora pasada: la hemos adelantado al {day}, {time}.',
  'dst_gap': 'Atención: las {time} no existen el {day} en {zone}, porque esa noche se adelantan los relojes, así que esta franja cae a las {lands}.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Semana anterior',
  'next_week': 'Semana siguiente',
  'this_week': 'Esta semana',
  'grid_help': 'Haz clic en un día para poner una franja de 1 hora, o arrastra hacia abajo en una columna para fijar la duración. Arrastra una franja para moverla dentro del día; haz clic en ella para quitarla.',
  'busy_legend': 'Rayado = ocupado en tu calendario conectado.',
  'syncing': 'Sincronizando tu calendario…',
  'syncing_sr': 'Sincronizando tu calendario.',
  'time_passed': 'Esa hora ya ha pasado: elige una franja futura.',
  'already_proposed': 'Ya has propuesto esa hora.',
  'slot_title': 'Arrastra para mover · haz clic para quitar {time} · {length}',

  // Timezone picker
  'show_times_in': 'Mostrar las horas en',
  'search_zones': 'Buscar zonas horarias',
  'search_zones_placeholder': 'Buscar zonas horarias…',
  'no_matching_zones': 'No hay zonas horarias que coincidan.',
}

export default slots
