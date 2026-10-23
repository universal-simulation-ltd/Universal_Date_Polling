// European Portuguese (pt-PT) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The poll's dates as a plain-text list a host pastes into an email
  'list_ask_times': 'Quais destes horários lhe dão jeito?',
  'list_ask_days': 'Quais destes dias lhe dão jeito?',
  'list_book_time': 'Escolha o horário que lhe convier — fica marcado assim que o escolher.',
  'list_book_day': 'Escolha o dia que lhe convier — fica marcado assim que o escolher.',
  'list_all_times': 'Todas as horas em {tz}.',
  'list_line_timed': '{date} às {time}',
  'list_link_poll': 'Pode responder por e-mail, ou deixar as suas preferências aqui:',
  'list_link_booking': 'Marque o seu horário aqui:',
  'where': 'Local: {location}',

  // The confirmation email a host copies into their own mail client
  'email_subject': 'Horário confirmado',
  'email_subject_title': 'Horário confirmado: {title}',
  'email_greeting': 'Olá a todos,',
  'email_confirmed': 'Confirmámos um horário:',
  'email_confirmed_title': 'O horário de {title} está confirmado:',
  'email_when_timed': '{date} às {time} {tz}',
  'email_add_calendar': 'Pode adicioná-lo ao seu calendário a partir da sondagem:',
  'email_sign_off': 'Até lá!',

  // The calendar event
  'event_title_fallback': 'Reunião',
  'event_description': 'Agendado com Universal Date Polling.',
  'event_view_poll': 'Ver ou atualizar a sondagem: {url}',

  // "Your polls" rows
  'summary_no_times': 'Sem horários',
  'summary_no_dates': 'Sem datas',
  'summary_times_one': '{count} horário',
  'summary_times_other': '{count} horários',
  'summary_dates_one': '{count} data',
  'summary_dates_other': '{count} datas',
  'confirmed_at': '{date}, {time}',
  'booked': 'Marcado',
  'not_booked': 'Ainda não marcado',
  'no_responses': 'Ainda sem respostas',
  'expires_today': 'Expira hoje',
  'expires_tomorrow': 'Expira amanhã',
  'expires_in_one': 'Expira dentro de {count} dia',
  'expires_in_other': 'Expira dentro de {count} dias',
  'expired_deleted_today': 'Expirada · apagada hoje',
  'expired_deleted_tomorrow': 'Expirada · apagada amanhã',
  'expired_deleted_in_one': 'Expirada · apagada dentro de {count} dia',
  'expired_deleted_in_other': 'Expirada · apagada dentro de {count} dias',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Eliminar esta página de marcação? A marcação NÃO é cancelada — o convite mantém-se nos dois calendários.',
  'delete_booking': 'Eliminar esta página de marcação?',
  'delete_poll': 'Eliminar esta sondagem?',
  'delete_poll_responses_one': 'Eliminar esta sondagem e a sua {count} resposta?',
  'delete_poll_responses_other': 'Eliminar esta sondagem e as suas {count} respostas?',
  'delete_expired_one': 'Eliminar esta sondagem expirada e as respetivas respostas? Não é possível anular.',
  'delete_expired_other': 'Eliminar as {count} sondagens expiradas e as respetivas respostas? Não é possível anular.',
  'cannot_undo': 'Não é possível anular.',
  'delete_active': 'Eliminar as {polls} sondagens ativas? As ligações deixam de funcionar de imediato e não é possível anular.',
  'delete_active_responses_one': 'Eliminar as {polls} sondagens ativas e a sua {count} resposta? As ligações deixam de funcionar de imediato e não é possível anular.',
  'delete_active_responses_other': 'Eliminar as {polls} sondagens ativas e as suas {count} respostas? As ligações deixam de funcionar de imediato e não é possível anular.',
  'delete_active_booked': 'Uma marcação já feita NÃO é cancelada — esse convite mantém-se nos dois calendários.',

  // The free allowance banner on the create screen
  'near_limit_one': 'Já usou {used} da sua {count} sondagem ativa gratuita.',
  'near_limit_other': 'Já usou {used} das suas {count} sondagens ativas gratuitas.',
  'at_limit_one': 'Já usou a sua {count} sondagem ativa gratuita. Elimine uma sondagem ou espere que uma termine para libertar espaço.',
  'at_limit_other': 'Já usou as {count} sondagens ativas gratuitas. Elimine uma sondagem ou espere que uma termine para libertar espaço.',
  'at_limit_unknown': 'Já usou as suas sondagens ativas gratuitas. Elimine uma sondagem ou espere que uma termine para libertar espaço.',

  // Error messages
  'err_verify': 'A verificação falhou — tente novamente.',
  'err_session': 'Não foi possível iniciar uma sessão — tente novamente.',
  'err_logo_type': 'O logótipo tem de ser uma imagem PNG, JPG ou WebP.',
  'err_logo_large': 'Essa imagem é demasiado grande para carregar — experimente uma mais pequena.',
  'err_send_emails_retry': 'Não foi possível enviar os e-mails — tente novamente.',
  'err_send_emails': 'Não foi possível enviar os e-mails.',
  'err_book_retry': 'Não foi possível marcar esse horário — tente novamente.',
  'err_book': 'Não foi possível marcar esse horário.',
  'err_cancel_booking_retry': 'Não foi possível cancelar essa marcação — tente novamente.',
  'err_cancel_booking': 'Não foi possível cancelar essa marcação.',
  'err_calendar_retry': 'O pedido ao calendário falhou — tente novamente.',
  'err_calendar': 'O pedido ao calendário falhou.',
  'err_busy_load': 'Não foi possível carregar a disponibilidade do seu calendário.',
  'err_calendar_add': 'Não foi possível adicionar isto ao seu calendário.',
  'err_calendar_remove': 'Não foi possível remover isto do seu calendário.',
}

export default lib
