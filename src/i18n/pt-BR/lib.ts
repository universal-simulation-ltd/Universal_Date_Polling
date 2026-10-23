// Brazilian Portuguese (pt-BR) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The poll's dates as a plain-text list a host pastes into an email
  'list_ask_times': 'Quais destes horários funcionam para você?',
  'list_ask_days': 'Quais destes dias funcionam para você?',
  'list_book_time': 'Escolha o horário que for melhor para você: ele é agendado assim que você escolher.',
  'list_book_day': 'Escolha o dia que for melhor para você: ele é agendado assim que você escolher.',
  'list_all_times': 'Todos os horários em {tz}.',
  'list_line_timed': '{date}, {time}',
  'list_link_poll': 'Fique à vontade para responder por e-mail ou deixar suas preferências aqui:',
  'list_link_booking': 'Agende seu horário aqui:',
  'where': 'Local: {location}',

  // The confirmation email a host copies into their own mail client
  'email_subject': 'Horário confirmado',
  'email_subject_title': 'Horário confirmado: {title}',
  'email_greeting': 'Oi, pessoal,',
  'email_confirmed': 'Confirmamos um horário:',
  'email_confirmed_title': 'O horário de {title} está confirmado:',
  'email_when_timed': '{date}, {time} {tz}',
  'email_add_calendar': 'Você pode adicioná-lo à sua agenda pela enquete:',
  'email_sign_off': 'Até lá!',

  // The calendar event
  'event_title_fallback': 'Reunião',
  'event_description': 'Agendado com o Universal Date Polling.',
  'event_view_poll': 'Ver ou atualizar a enquete: {url}',

  // "Your polls" rows
  'summary_no_times': 'Nenhum horário',
  'summary_no_dates': 'Nenhuma data',
  'summary_times_one': '{count} horário',
  'summary_times_other': '{count} horários',
  'summary_dates_one': '{count} data',
  'summary_dates_other': '{count} datas',
  'confirmed_at': '{date}, {time}',
  'booked': 'Agendado',
  'not_booked': 'Ainda não agendado',
  'no_responses': 'Nenhuma resposta ainda',
  'expires_today': 'Expira hoje',
  'expires_tomorrow': 'Expira amanhã',
  'expires_in_one': 'Expira em {count} dia',
  'expires_in_other': 'Expira em {count} dias',
  'expired_deleted_today': 'Expirada · excluída hoje',
  'expired_deleted_tomorrow': 'Expirada · excluída amanhã',
  'expired_deleted_in_one': 'Expirada · excluída em {count} dia',
  'expired_deleted_in_other': 'Expirada · excluída em {count} dias',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Excluir esta página de agendamento? O agendamento NÃO é cancelado: o convite continua nas duas agendas.',
  'delete_booking': 'Excluir esta página de agendamento?',
  'delete_poll': 'Excluir esta enquete?',
  'delete_poll_responses_one': 'Excluir esta enquete e sua {count} resposta?',
  'delete_poll_responses_other': 'Excluir esta enquete e suas {count} respostas?',
  'delete_expired_one': 'Excluir esta enquete expirada e suas respostas? Isso não pode ser desfeito.',
  'delete_expired_other': 'Excluir todas as {count} enquetes expiradas e suas respostas? Isso não pode ser desfeito.',
  'cannot_undo': 'Isso não pode ser desfeito.',
  // Deleting every live poll at once
  'delete_active': 'Excluir todas as {polls} enquetes ativas? Os links param de funcionar na hora, e isso não pode ser desfeito.',
  'delete_active_responses_one': 'Excluir todas as {polls} enquetes ativas e sua {count} resposta? Os links param de funcionar na hora, e isso não pode ser desfeito.',
  'delete_active_responses_other': 'Excluir todas as {polls} enquetes ativas e suas {count} respostas? Os links param de funcionar na hora, e isso não pode ser desfeito.',
  'delete_active_booked': 'Um agendamento já feito NÃO é cancelado: o convite continua nas duas agendas.',

  // The free allowance banner on the create screen
  'near_limit_one': 'Você usou {used} de {count} enquete ativa gratuita.',
  'near_limit_other': 'Você usou {used} das suas {count} enquetes ativas gratuitas.',
  'at_limit_one': 'Você usou sua {count} enquete ativa gratuita. Exclua uma enquete ou espere uma terminar para liberar espaço.',
  'at_limit_other': 'Você usou todas as suas {count} enquetes ativas gratuitas. Exclua uma enquete ou espere uma terminar para liberar espaço.',
  'at_limit_unknown': 'Você usou suas enquetes ativas gratuitas. Exclua uma enquete ou espere uma terminar para liberar espaço.',

  // Error messages
  'err_verify': 'A verificação falhou. Tente de novo.',
  'err_session': 'Não foi possível iniciar uma sessão. Tente de novo.',
  'err_logo_type': 'O logo precisa ser uma imagem PNG, JPG ou WebP.',
  'err_logo_large': 'Essa imagem é grande demais para enviar. Tente uma menor.',
  'err_send_emails_retry': 'Não foi possível enviar os e-mails. Tente de novo.',
  'err_send_emails': 'Não foi possível enviar os e-mails.',
  'err_book_retry': 'Não foi possível agendar esse horário. Tente de novo.',
  'err_book': 'Não foi possível agendar esse horário.',
  'err_cancel_booking_retry': 'Não foi possível cancelar esse agendamento. Tente de novo.',
  'err_cancel_booking': 'Não foi possível cancelar esse agendamento.',
  'err_calendar_retry': 'A solicitação à agenda falhou. Tente de novo.',
  'err_calendar': 'A solicitação à agenda falhou.',
  'err_busy_load': 'Não foi possível carregar a disponibilidade da sua agenda.',
  'err_calendar_add': 'Não foi possível adicionar isto à sua agenda.',
  'err_calendar_remove': 'Não foi possível remover isto da sua agenda.',
}

export default lib
