// Spanish (es) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'Cargando encuesta…',
  'load_failed': 'No se pudo cargar la encuesta.',
  'load_error_title': 'No se pudo cargar esta encuesta',
  'load_error_fallback': 'Algo ha salido mal.',
  'not_found_title': 'Encuesta no encontrada',
  'not_found_body': 'Puede que esta encuesta se haya eliminado, o que el enlace sea incorrecto.',
  'not_found_create': 'Crear una encuesta nueva →',

  // The line under the poll's title
  'header_booked': 'Esta hora está reservada.',
  'header_waiting': 'Esperando a que tu invitado elija una hora.',
  'header_pick': 'Elige la hora que te venga bien: se reserva al instante.',
  'header_first': 'Sé el primero en responder.',
  'header_responded_one': 'Ha respondido {count} persona.',
  'header_responded_other': 'Han respondido {count} personas.',
  'times_in': 'Horas en {tz}',

  // The host is changing the times
  'editing_title': 'El organizador está cambiando las horas; vuelve en un momento.',
  'editing_body': 'Esta página se actualizará sola cuando termine.',

  // The guest has just booked (booking page)
  'booked_title': 'Tu cita está reservada.',
  'booked_via_calendar': 'Va de camino una invitación de calendario a {email}: acéptala y la reunión aparecerá en tu calendario.',
  'booked_emailed': 'Hemos enviado la invitación a {email}: abre el archivo adjunto para añadirla a tu calendario.',
  'booked_not_emailed': 'No hemos podido enviarte una copia por correo ahora mismo, así que añádela a tu calendario con el botón de arriba. La hora en sí ya está reservada.',

  // Hints for the host
  'host_hint': 'Eres el organizador: elige abajo la hora final con {button} y todos los que tengan el enlace la verán.',
  'host_hint_button': 'Confirmar esta hora',
  'host_booking_hint': 'Esta es una página de reservas. Envía el enlace a una persona: la hora que elija se reserva al instante y los dos recibiréis una invitación de calendario.',

  // The private admin link
  'admin_checking': 'Comprobando tu enlace de administración…',
  'admin_failed': 'Ese enlace de administración no ha funcionado para esta encuesta, así que la ves como invitado. Comprueba que copiaste el enlace completo.',
  'admin_unsupported': 'Los enlaces de administración aún no están disponibles, así que ves esta encuesta como invitado. Vuelve a probar el enlace más tarde.',
  'admin_link_summary': 'Tu enlace de administración privado',
  'signed_in_as': 'Has iniciado sesión como {email} · {signout}',
  'sign_out': 'Cerrar sesión',

  // An expired poll
  'expired_one': 'El enlace de esta encuesta ha caducado: ahora es de solo lectura y se eliminará, con todas sus respuestas, {count} día después de caducar.',
  'expired_other': 'El enlace de esta encuesta ha caducado: ahora es de solo lectura y se eliminará, con todas sus respuestas, {count} días después de caducar.',

  // Answering the poll
  'respond_title_days': '¿Estás disponible estos días?',
  'respond_title_times': '¿Estás disponible a estas horas?',
  'respond_folded': 'Ya hay una hora confirmada, así que esto está plegado. Aún puedes cambiar tus respuestas.',
  'respond_intro_days': 'Escribe tu nombre, responde a cada día y guarda. No necesitas cuenta.',
  'respond_intro_times': 'Escribe tu nombre, responde a cada hora y guarda. No necesitas cuenta.',
  'your_name': 'Tu nombre',
  'name_placeholder': 'p. ej., Sara',
  'your_email': 'Tu correo electrónico',
  'optional': '(opcional)',
  'email_placeholder': 'tu@ejemplo.com',
  'edit_link_ok': 'Tu enlace de edición ha funcionado: estas son tus respuestas. Cámbialas y guarda.',
  'edit_link_failed': 'Ese enlace de edición no coincide con ninguna respuesta de esta encuesta. Puede que se haya quitado. Aún puedes responder abajo.',
  'name_claimed': '«{name}» ya ha respondido a esta encuesta, y solo esa persona puede cambiar esas respuestas. Si eres tú, abre el enlace de edición que recibiste o usa el dispositivo con el que respondiste. Si no, añade una inicial o tu apellido.',
  'name_unclaimed': '«{name}» ya ha respondido a esta encuesta. Al guardar se sustituirán esas respuestas, lo cual está bien si son tuyas. Si no, añade una inicial o tu apellido para no sobrescribir las de otra persona.',
  'name_similar': 'Alguien ya ha respondido como «{name}». Añade una inicial o tu apellido para que se os pueda distinguir.',
  'email_note': 'Deja tu correo y recibirás la fecha final (con una invitación de calendario) cuando el organizador la confirme. Solo lo ve el organizador, nunca los demás participantes.',
  'all_day': 'Todo el día',
  'answer_yes': 'Sí 👍',
  'answer_maybe': 'Si es necesario',
  'answer_no': 'No 🙅‍♀️',
  'saving': 'Guardando…',
  'replace_answers': 'Sustituir las respuestas de {name}',
  'save_availability': 'Guardar mi disponibilidad',
  'saved': 'Guardado. ¡Gracias!',
  'removing': 'Quitando…',
  'remove_my_answers': 'Quitar mis respuestas',
  'next_with_email': 'El organizador elegirá la hora final cuando todos hayan respondido; entonces te la enviaremos por correo, con una invitación de calendario.',
  'next_without_email': 'El organizador elegirá la hora final cuando todos hayan respondido. Vuelve a abrir este enlace para verla, o añade tu correo arriba y guarda de nuevo para que te la enviemos.',

  // Errors while answering
  'err_name': 'Escribe tu nombre para que sepan quién eres.',
  'err_email': 'Ese correo no parece correcto: corrígelo o déjalo en blanco.',
  'err_email_store_why': 'Tu disponibilidad se ha guardado, pero no se pudo guardar tu correo: {why}.',
  'err_email_store': 'Tu disponibilidad se ha guardado, pero no se pudo guardar tu correo. Vuelve a guardar.',
  'err_save': 'No se pudo guardar tu respuesta.',

  // Removing answers
  'remove_confirm_host': '¿Quitar las respuestas de {name} de esta encuesta? No se puede deshacer.',
  'remove_confirm_own': '¿Quitar tus respuestas de esta encuesta? No se puede deshacer.',
  'remove_confirm_button': 'Quitar',
  'err_remove_host': 'No se pudo quitar esa respuesta. Recarga la página y vuelve a intentarlo.',
  'err_remove_own': 'Solo la persona que dio estas respuestas puede quitarlas.',
  'err_remove': 'No se pudieron quitar esas respuestas.',
  'err_confirm': 'No se pudo confirmar la hora.',

  // A booking page: the guest picks one time
  'pick_day': 'Elige un día',
  'pick_time': 'Elige una hora',
  'booking_intro': 'Lo que elijas se reserva al instante: no hay que enviar nada más ni hace falta cuenta.',
  'booking_email_note': 'Aquí llega tu invitación de calendario. Solo se usa para esta reserva.',
  'booking': 'Reservando…',
  'book_day': 'Reservar este día',
  'book_time': 'Reservar esta hora',
  'pick_day_above': 'Elige un día arriba',
  'pick_time_above': 'Elige una hora arriba',
  'offering_days': 'Días que ofreces',
  'offering_times': 'Horas que ofreces',
  'err_book_name': 'Escribe tu nombre para que sepan con quién se reúnen.',
  'err_book_email': 'Añade la dirección de correo a la que debe ir tu invitación.',
  'err_book': 'No se pudo reservar esa hora.',
  'cancel_not_notified': 'La reserva está cancelada y la página vuelve a estar abierta, pero no pudimos enviar un correo a tu invitado. Avísale tú.',
  'err_cancel': 'No se pudo cancelar esa reserva.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Esta hora está reservada, pero un correo no ha llegado.',
  'notify_your_guest': 'tu invitado',
  'notify_both': 'No se ha enviado ningún correo sobre ello ni a ti ni a {who}. La hora queda reservada de todos modos, así que conviene contactar directamente para confirmarla.',
  'notify_invitee': 'No pudimos enviar un correo a {who}, así que puede que no sepa que está confirmada. La hora queda reservada: contactar directamente es la solución fiable.',
  'notify_host': '{who} recibió el correo y tiene los detalles, pero tu copia rebotó. Comprueba la dirección de tu cuenta si la esperabas.',

  // Results
  'results': 'Resultados',
  'results_so_far': 'Resultados hasta ahora',
  'results_nobody': 'Nadie respondió.',
  'results_responded_one': 'Respondió {count} persona.',
  'results_responded_other': 'Respondieron {count} personas.',
  'no_responses_host': 'Todavía no hay respuestas: comparte el enlace para empezar.',
  'no_responses_guest': 'Todavía no hay respuestas: la tuya será la primera.',
  'confirmed_chip': '✓ Confirmada',
  'best_chip': 'Mejor',
  'tally_maybe_one': '{count} si es necesario',
  'tally_maybe_other': '{count} si es necesario',
  'tally_no_one': '{count} no disponible',
  'tally_no_other': '{count} no disponibles',
  'names_maybe': 'si es necesario: {names}',
  'names_no': 'no disponibles: {names}',
  'confirm_this_time': '✓ Confirmar esta hora',
  'unconfirm': 'Anular confirmación',
  'remove_an_answer': 'Quitar una respuesta',
  'remove_an_answer_hint': 'Para respuestas basura, duplicadas o de alguien que perdió su enlace de edición y quiere volver a responder.',
  'remove_name_aria': 'Quitar las respuestas de {name}',

  // The confirmed banner
  'booked_by': '✓ Reservada por {name}',
  'booked': '✓ Reservada',
  'confirmed_time': '✓ Hora confirmada',
  'cancel_booking_named': '¿Cancelar esta reserva?\n\n{name} recibirá un correo avisando de que se anula, y la página se abrirá para que elija otra hora.',
  'cancel_booking_unnamed': '¿Cancelar esta reserva?\n\nTu invitado recibirá un correo avisando de que se anula, y la página se abrirá para que elija otra hora.',
  'cancel_booking_confirm': 'Cancelar la reserva',
  'keep_it': 'Mantenerla',
  'working': 'Procesando…',
  'change': 'Cambiar',
  'sending': 'Enviando…',
  'resend': 'Reenviar la confirmación',
  'email_again': 'Volver a enviar a los participantes',
  'email_this_time': 'Enviar esta hora a los participantes',
  'sent_one': 'Enviado a {count} persona ✓',
  'sent_other': 'Enviado a {count} personas ✓',
  'no_one_email': 'Todavía nadie ha dejado una dirección de correo.',
  'guest_emailed_named': '{name} recibió la invitación por correo al reservar ✓',
  'guest_emailed': 'Tu invitado recibió la invitación por correo al reservar ✓',
  'respondents_emailed': 'Se ha enviado un correo a los participantes ✓',
  'notify_hint': 'Envía la fecha confirmada y una invitación de calendario a todos los que dejaron un correo.',

  // The host's own calendar
  'adding': 'Añadiendo…',
  'update_in_calendar': 'Actualizarla en mi calendario',
  'add_to_my_provider': 'Añadir a mi {provider}',
  'add_to_my_calendars': 'Añadir a mis calendarios',
  'reconnect_to_add': 'Vuelve a conectar {provider} para añadirla',
  'added_to': 'Añadida a {providers} ✓',
  'list_two': '{a} y {b}',
  'cal_stale': 'Tu calendario se conectó solo para la disponibilidad: vuelve a conectarlo una vez para permitir añadir eventos.',
  'cal_stale_hint': 'Conectado solo para la disponibilidad. Con volver a conectarlo una vez, esto pondrá la hora directamente en tu agenda.',
  'cal_add_hint': 'Pone esta hora en tu propio calendario. Puedes hacer clic dos veces sin problema: actualiza el mismo evento.',
  'cal_expired': 'Ha caducado la conexión de tu calendario: vuelve a conectarlo en la pantalla de creación.',
  'cal_add_failed': 'No se pudo añadir esto a tu calendario.',
  'cal_popups': 'Permite las ventanas emergentes en este sitio para volver a conectar tu calendario.',
  'cal_claim_failed': 'No se pudo terminar de conectar tu calendario.',
  'cal_reconnect_failed': 'No se pudo iniciar la reconexión.',
  'err_send': 'No se pudieron enviar los correos.',

  // The timezone bar
  'tz_poll_in': 'Esta encuesta está en {tz} {zone}.',
  'tz_show_mine': 'Mostrar las horas en tu zona horaria ({tz})',
  'tz_reset': 'Volver a la zona horaria de la encuesta',
  'your_time': '{time} tu hora',
  'your_time_dated': '{date}, {time} tu hora',

  // Folding sections
  'show': 'Mostrar ▾',
  'hide': 'Ocultar ▴',

  'brand_alt': 'Marca',
}

export default poll
