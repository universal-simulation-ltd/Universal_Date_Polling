// Spanish (es) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The pasted list (lib/textExport.ts). Plain text.
  'list_ask_times': '¿Cuáles de estas horas te vienen bien?',
  'list_ask_days': '¿Cuáles de estos días te vienen bien?',
  'list_book_time': 'Elige la hora que mejor te venga: se reserva en cuanto la eliges.',
  'list_book_day': 'Elige el día que mejor te venga: se reserva en cuanto lo eliges.',
  'list_all_times': 'Todas las horas en {tz}.',
  'list_line_timed': '{date}, {time}',
  'list_link_poll': 'Puedes contestar a este correo o dejar tus preferencias aquí:',
  'list_link_booking': 'Reserva tu hora aquí:',
  'where': 'Lugar: {location}',

  // The confirmation email (lib/confirmedEmail.ts). Plain text.
  'email_subject': 'Hora confirmada',
  'email_subject_title': 'Hora confirmada: {title}',
  'email_greeting': 'Hola a todos:',
  'email_confirmed': 'Hemos confirmado una hora:',
  'email_confirmed_title': 'La hora de {title} está confirmada:',
  'email_when_timed': '{date}, {time} {tz}',
  'email_add_calendar': 'Puedes añadirla a tu calendario desde la encuesta:',
  'email_sign_off': '¡Nos vemos!',

  // The calendar event (lib/calendar.ts)
  'event_title_fallback': 'Reunión',
  'event_description': 'Programada con Universal Date Polling.',
  'event_view_poll': 'Ver o actualizar la encuesta: {url}',

  // "Your polls" rows (lib/myPolls.ts)
  'summary_no_times': 'Sin horas',
  'summary_no_dates': 'Sin fechas',
  'summary_times_one': '{count} hora',
  'summary_times_other': '{count} horas',
  'summary_dates_one': '{count} fecha',
  'summary_dates_other': '{count} fechas',
  'confirmed_at': '{date}, {time}',
  'booked': 'Reservada',
  'not_booked': 'Aún sin reservar',
  'no_responses': 'Aún no hay respuestas',
  'expires_today': 'Caduca hoy',
  'expires_tomorrow': 'Caduca mañana',
  'expires_in_one': 'Caduca en {count} día',
  'expires_in_other': 'Caduca en {count} días',
  'expired_deleted_today': 'Caducada · se elimina hoy',
  'expired_deleted_tomorrow': 'Caducada · se elimina mañana',
  'expired_deleted_in_one': 'Caducada · se elimina en {count} día',
  'expired_deleted_in_other': 'Caducada · se elimina en {count} días',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': '¿Eliminar esta página de reservas? La reserva NO se cancela: la invitación sigue en los dos calendarios.',
  'delete_booking': '¿Eliminar esta página de reservas?',
  'delete_poll': '¿Eliminar esta encuesta?',
  'delete_poll_responses_one': '¿Eliminar esta encuesta y su {count} respuesta?',
  'delete_poll_responses_other': '¿Eliminar esta encuesta y sus {count} respuestas?',
  'delete_expired_one': '¿Eliminar esta encuesta caducada y sus respuestas? No se puede deshacer.',
  'delete_expired_other': '¿Eliminar las {count} encuestas caducadas y sus respuestas? No se puede deshacer.',
  'cannot_undo': 'No se puede deshacer.',
  'delete_active': '¿Eliminar las {polls} encuestas activas? Sus enlaces dejarán de funcionar al instante y no se puede deshacer.',
  'delete_active_responses_one': '¿Eliminar las {polls} encuestas activas y su {count} respuesta? Sus enlaces dejarán de funcionar al instante y no se puede deshacer.',
  'delete_active_responses_other': '¿Eliminar las {polls} encuestas activas y sus {count} respuestas? Sus enlaces dejarán de funcionar al instante y no se puede deshacer.',
  'delete_active_booked': 'Una reserva ya hecha NO se cancela: esa invitación sigue en los dos calendarios.',

  // The free allowance banner (lib/freeAllowance.ts)
  'near_limit_one': 'Has usado {used} de tu {count} encuesta activa gratuita.',
  'near_limit_other': 'Has usado {used} de tus {count} encuestas activas gratuitas.',
  'at_limit_one': 'Has usado tu {count} encuesta activa gratuita. Elimina una encuesta o espera a que termine alguna para hacer sitio.',
  'at_limit_other': 'Has usado las {count} encuestas activas gratuitas. Elimina una encuesta o espera a que termine alguna para hacer sitio.',
  'at_limit_unknown': 'Has usado tus encuestas activas gratuitas. Elimina una encuesta o espera a que termine alguna para hacer sitio.',

  // Error messages (lib/api.ts, lib/hostCalendar.ts)
  'err_verify': 'La verificación ha fallado. Vuelve a intentarlo.',
  'err_session': 'No se pudo iniciar una sesión. Vuelve a intentarlo.',
  'err_logo_type': 'El logotipo debe ser una imagen PNG, JPG o WebP.',
  'err_logo_large': 'Esa imagen es demasiado grande para subirla: prueba con una más pequeña.',
  'err_send_emails_retry': 'No se pudieron enviar los correos. Vuelve a intentarlo.',
  'err_send_emails': 'No se pudieron enviar los correos.',
  'err_book_retry': 'No se pudo reservar esa hora. Vuelve a intentarlo.',
  'err_book': 'No se pudo reservar esa hora.',
  'err_cancel_booking_retry': 'No se pudo cancelar esa reserva. Vuelve a intentarlo.',
  'err_cancel_booking': 'No se pudo cancelar esa reserva.',
  'err_calendar_retry': 'La solicitud al calendario ha fallado. Vuelve a intentarlo.',
  'err_calendar': 'La solicitud al calendario ha fallado.',
  'err_busy_load': 'No se pudo cargar la disponibilidad de tu calendario.',
  'err_calendar_add': 'No se pudo añadir esto a tu calendario.',
  'err_calendar_remove': 'No se pudo quitar esto de tu calendario.',
}

export default lib
