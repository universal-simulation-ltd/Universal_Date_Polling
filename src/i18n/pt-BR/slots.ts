// Brazilian Portuguese (pt-BR) — slots. Every key in ../en/slots.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const slots: Draft['slots'] = {
  // The three ways to propose availability
  'view_form': 'Digitar',
  'view_calendar': 'Calendário',
  'view_days': 'Dias inteiros',
  'view_none': 'Nada escolhido',

  // Slot lengths, abbreviated
  'duration_m': '{m}min',
  'duration_h': '{h}h',
  'duration_hm': '{h}h{m}',

  // Whole days (a month calendar)
  'previous_month': 'Mês anterior',
  'next_month': 'Próximo mês',
  'no_days_yet': 'Nenhum dia ainda: clique nos dias que quer propor.',
  'days_selected_one': '{count} dia selecionado',
  'days_selected_other': '{count} dias selecionados',
  'remove_day': 'Remover {day}',

  // Type in (date + time + length form)
  'date': 'Data',
  'time': 'Horário',
  'length': 'Duração',
  'add_time': 'Adicionar horário',
  'no_times_yet': 'Nenhum horário ainda: escolha uma data e um horário acima e clique em {button}.',
  'remove_time': 'Remover {day} {time}',
  'past_moved': 'Não é possível escolher um horário no passado. Ele foi adiantado para {day}, {time}.',
  'dst_gap': 'Atenção: {time} não existe em {day} no fuso {zone}. Os relógios são adiantados nessa noite, então este horário cai às {lands}.',

  // Calendar (a week grid you drag on)
  'previous_week': 'Semana anterior',
  'next_week': 'Próxima semana',
  'this_week': 'Esta semana',
  'grid_help': 'Clique em um dia para criar um horário de 1 hora, ou arraste para baixo em uma coluna para definir a duração. Arraste um horário para movê-lo no mesmo dia; clique nele para remover.',
  'busy_legend': 'Listrado = ocupado na agenda conectada.',
  'syncing': 'Sincronizando sua agenda…',
  'syncing_sr': 'Sincronizando sua agenda.',
  'time_passed': 'Esse horário já passou. Escolha um horário futuro.',
  'already_proposed': 'Você já propôs esse horário.',
  'slot_title': 'Arraste para mover · clique para remover {time} · {length}',

  // Timezone picker
  'show_times_in': 'Mostrar horários em',
  'search_zones': 'Pesquisar fusos horários',
  'search_zones_placeholder': 'Pesquisar fusos horários…',
  'no_matching_zones': 'Nenhum fuso horário encontrado.',
}

export default slots
