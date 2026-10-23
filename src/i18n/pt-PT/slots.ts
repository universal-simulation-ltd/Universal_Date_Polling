// European Portuguese (pt-PT) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability
  'view_form': 'Escrever',
  'view_calendar': 'Calendário',
  'view_days': 'Dias inteiros',
  'view_none': 'Nada escolhido',

  // Slot lengths, abbreviated
  'duration_m': '{m} min',
  'duration_h': '{h} h',
  'duration_hm': '{h}h{m}',

  // Whole days (a month calendar)
  'previous_month': 'Mês anterior',
  'next_month': 'Mês seguinte',
  'no_days_yet': 'Ainda sem dias — clique nos dias que quer propor.',
  'days_selected_one': '{count} dia selecionado',
  'days_selected_other': '{count} dias selecionados',
  'remove_day': 'Remover {day}',

  // Type in (date + time + length form)
  'date': 'Data',
  'time': 'Hora',
  'length': 'Duração',
  'add_time': 'Adicionar horário',
  'no_times_yet': 'Ainda sem horários — escolha uma data e uma hora acima e prima {button}.',
  'remove_time': 'Remover {day} {time}',
  'past_moved': 'Não é possível escolher uma hora no passado — foi adiada para {day}, {time}.',
  'dst_gap': 'Atenção — {time} não existe em {day} no fuso {zone}: os relógios adiantam nessa noite, por isso este horário fica às {lands}.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Semana anterior',
  'next_week': 'Semana seguinte',
  'this_week': 'Esta semana',
  'grid_help': 'Clique num dia para colocar um horário de 1 hora, ou arraste ao longo de uma coluna para definir a duração. Arraste um horário para o mover dentro do dia; clique nele para o remover.',
  'busy_legend': 'Riscado = ocupado no seu calendário ligado.',
  'syncing': 'A sincronizar o seu calendário…',
  'syncing_sr': 'A sincronizar o seu calendário.',
  'time_passed': 'Essa hora já passou — escolha um horário futuro.',
  'already_proposed': 'Já propôs esse horário.',
  'slot_title': 'Arraste para mover · clique para remover {time} · {length}',

  // Timezone picker
  'show_times_in': 'Mostrar horas em',
  'search_zones': 'Pesquisar fusos horários',
  'search_zones_placeholder': 'Pesquisar fusos horários…',
  'no_matching_zones': 'Nenhum fuso horário corresponde.',
}

export default slots
