// Spanish (es) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Encuentra una hora que',
  'headline_line2': 'les venga bien a todos',
  'intro': 'Ofrece algunas horas, comparte el enlace y cada persona marca las que le vienen bien. Sin cuenta, ni para ti ni para ellos.',
  'logo_alt': 'Logotipo de {name}',
  'logo_alt_yours': 'Tu logotipo',

  // Title and location
  'title_label': 'Título de la encuesta',
  'title_placeholder': 'p. ej., Reunión de equipo: semana del 9',
  'location_label': 'Lugar o enlace de la reunión',
  'optional': '(opcional)',
  'location_placeholder': 'p. ej., Sala de reuniones 5, o un enlace de Teams / Zoom / Meet',
  'location_hint': 'Lo ven todos en la encuesta y se añade a la invitación de calendario.',

  // Times to offer
  'times_heading': 'Horas que ofreces',
  'times_hint_none': '¿Cómo quieres añadirlas? Escríbelas, arrástralas en un calendario u ofrece días completos.',
  'times_hint_days': 'Los participantes marcan los días completos en que están disponibles: ideal para viajes y planes de varios días.',
  'tz_line': 'Son las {time}. Estás en {zone}.',
  'tz_change': '¿Cambiar la zona horaria?',

  // Suggest times
  'suggest_question': '¿No sabes qué proponer?',
  'suggest_intro_one': 'Elegiremos {count} hora en la que estés libre: días laborables, de {from} a {to} {zone}, como mucho una por la mañana y otra por la tarde cada día.',
  'suggest_intro_other': 'Elegiremos {count} horas en las que estés libre: días laborables, de {from} a {to} {zone}, como mucho una por la mañana y otra por la tarde cada día.',
  'suggest_button_one': 'Sugerir {count} hora',
  'suggest_button_other': 'Sugerir {count} horas',
  'suggest_finding': 'Buscando tiempo libre…',
  'suggest_finding_sr': 'Buscando tiempo libre en tu calendario.',
  'suggest_none_one': 'No hay tiempo libre entre las {from} y las {to} en un día laborable en el próximo {count} día: añade horas a mano, o libera algo de espacio y vuelve a intentarlo.',
  'suggest_none_other': 'No hay tiempo libre entre las {from} y las {to} en un día laborable en los próximos {count} días: añade horas a mano, o libera algo de espacio y vuelve a intentarlo.',
  'suggest_some': 'Se han añadido {found} de {total}: no había más tiempo libre. Arrastra una para moverla, haz clic para quitarla.',
  'suggest_added_one': 'Se ha añadido {count} hora de tu tiempo libre. Arrastra una para moverla, haz clic para quitarla.',
  'suggest_added_other': 'Se han añadido {count} horas de tu tiempo libre. Arrastra una para moverla, haz clic para quitarla.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Mira cuándo ya estás ocupado',
  'cal_prompt_connect': '{lead}: conecta un calendario y tus horas ocupadas se sombrearán en la cuadrícula. Solo tú las ves.',
  'cal_other_lead': '¿También tienes compromisos en otro sitio?',
  'cal_prompt_other': '{lead} Conecta tu otro calendario y también sombreará la cuadrícula.',
  'cal_prompt_guest': '{lead}: verifica tu correo (el mismo que guarda tu encuesta) y luego conecta tu calendario. Solo tú ves el sombreado.',
  'connect_google': 'Conectar Google Calendar',
  'connect_outlook': 'Conectar Outlook',
  'dont_show_again': 'No volver a mostrar',
  'cal_later_web': 'Puedes conectar uno cuando quieras desde tu menú de perfil (arriba a la derecha) → Ajustar esta app → Opciones de esta encuesta.',
  'cal_later_phone': 'Puedes conectar uno cuando quieras desde Ajustar (arriba a la derecha) → Opciones de esta encuesta.',
  'verify': 'Verificar',
  'verifying': 'Verificando…',
  'different_email': 'Otro correo',
  'code_sent': 'Hemos enviado un código de 6 dígitos a {email}.',
  'sending': 'Enviando…',
  'email_me_code': 'Envíame un código',

  // Calendar errors
  'err_email_first': 'Primero introduce una dirección de correo válida.',
  'err_code': 'Introduce el código de tu correo.',
  'cal_read_failed_google': 'No se pudo leer tu calendario de Google: la conexión funciona, pero falló la consulta de disponibilidad. Vuelve a intentarlo en un momento, o desconéctalo y vuelve a conectarlo.',
  'cal_read_failed_outlook': 'No se pudo leer tu calendario de Outlook: la conexión funciona, pero falló la consulta de disponibilidad. Vuelve a intentarlo en un momento, o desconéctalo y vuelve a conectarlo.',
  'cal_read_failed_both': 'No se pudieron leer tus calendarios de Google y Outlook: la conexión funciona, pero falló la consulta de disponibilidad. Vuelve a intentarlo en un momento, o desconéctalos y vuelve a conectarlos.',
  'cal_expired': 'Ha caducado una conexión de calendario: vuelve a conectarla.',
  'cal_expired_suggest': 'Ha caducado una conexión de calendario: vuelve a conectarla y luego sugiere horas.',
  'cal_read_failed_suggest': 'No se pudo leer tu calendario en este momento, así que no se ha sugerido nada. Vuelve a intentarlo en un momento.',
  'cal_cancelled': 'La conexión del calendario se canceló o falló.',
  'popup_blocked': 'Tu navegador bloqueó la ventana emergente: permite las ventanas emergentes en este sitio y vuelve a intentarlo.',

  // Logo errors
  'logo_type': 'El logotipo debe ser una imagen PNG, JPG o WebP.',
  'logo_size': 'El logotipo debe ocupar 10 MB o menos.',

  // Checks before creating
  'err_title': 'Ponle un título a tu encuesta.',
  'err_add_day': 'Añade al menos un día.',
  'err_add_time': 'Añade al menos una fecha y una hora.',
  'err_email': 'Introduce una dirección de correo válida.',
  'err_booking_email': 'Una página de reservas te envía por correo cada reserva, así que necesita tu dirección de correo.',
  'err_alerts_email': 'Añade tu dirección de correo para recibir avisos de respuesta, o desactiva los avisos en Opciones de esta encuesta.',
  'err_backend': 'Date Polling necesita su backend de Supabase configurado para crear encuestas.',
  'err_free_limit': 'Has alcanzado tu límite de encuestas activas gratuitas. Elimina una encuesta o espera a que termine alguna para hacer sitio.',
  'err_free_limit_held': 'Has alcanzado tu límite de encuestas activas gratuitas (ocupado por {what}). Elimina una encuesta o espera a que termine alguna para hacer sitio.',
  'err_generic': 'Algo ha salido mal. Vuelve a intentarlo.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Página de reservas',
  'link_valid': 'Enlace válido durante {period}',
  'link_valid_while': 'Enlace válido durante un tiempo',
  'alerts_on': 'avisos de respuesta activados',
  'alerts_off': 'sin avisos de respuesta',
  'change_these_web': '— cámbialas en tu menú de perfil (arriba a la derecha) → Ajustar esta app → Opciones de esta encuesta.',
  'change_these_phone': '— cámbialas en Ajustar (arriba a la derecha) → Opciones de esta encuesta.',

  // Changing the times on a live poll
  'editing_title': 'Estás cambiando las horas de tu encuesta publicada.',
  'editing_body': 'Hasta que guardes, a quien abra el enlace se le dirá que estás cambiando las horas y que vuelva en un momento. Nadie ha respondido todavía, así que no se pierde nada. Tu marca se queda como estaba.',
  'editing_cancel': 'Cancelar y dejarla como estaba',

  // Free allowance
  'need_more': '¿Necesitas más? Dínoslo',
  'purchased_tokens_one': '{count} crédito comprado',
  'purchased_tokens_other': '{count} créditos comprados',

  // Who is creating
  'creating_as': 'Creando como {name}: no hace falta verificar el correo.',
  'creating_as_org': 'Creando como {name}{email}: no hace falta verificar el correo.',
  'signed_in_as': 'Has iniciado sesión como {email} (verificado).',
  'not_you': '¿No eres tú? Cerrar sesión',
  'your_email': 'Tu correo electrónico',
  'email_hint_booking': 'Necesario para una página de reservas: es adonde te enviamos cada reserva. Te enviaremos un código rápido para confirmar que eres tú.',
  'email_hint_alerts': 'Adonde enviaremos tus avisos de respuesta. Te enviaremos un código rápido para confirmar que eres tú.',
  'email_hint_optional': 'Solo si quieres avisos de respuesta o encontrar tus encuestas desde otro dispositivo; te enviaremos un código rápido para confirmarlo. Si lo dejas en blanco, recibirás un enlace de administración privado para gestionar la encuesta.',
  'email_note_alerts': 'Te enviaremos un código rápido para confirmar que eres tú: así gestionarás esta encuesta más adelante, y ahí te enviaremos los avisos de respuesta.',
  'email_note_web': 'Te enviaremos un código rápido para confirmar que eres tú: así gestionarás esta encuesta más adelante. ¿Quieres un correo cada vez que responda un invitado? Actívalo en tu menú de perfil (arriba a la derecha) → Ajustar esta app → Opciones de esta encuesta.',
  'email_note_phone': 'Te enviaremos un código rápido para confirmar que eres tú: así gestionarás esta encuesta más adelante. ¿Quieres un correo cada vez que responda un invitado? Actívalo en Ajustar (arriba a la derecha) → Opciones de esta encuesta.',
  'code_label': 'Introduce el código de 6 dígitos que enviamos a {email}',
  'code_note_alerts': 'Al confirmar se crea tu encuesta y se activan los avisos de respuesta a esta dirección.',
  'code_note': 'Al confirmar se crea tu encuesta y podrás gestionarla más adelante desde esta dirección.',
  'use_different_email': 'Usar otro correo',

  // The main button
  'btn_sending': 'Enviando código…',
  'btn_saving': 'Guardando cambios…',
  'btn_creating': 'Creando encuesta…',
  'btn_verify_create': 'Verificar y crear encuesta',
  'btn_save': 'Guardar cambios',
  'btn_create': 'Crear encuesta',

  // Branding card
  'branding': 'Marca',
  'branding_imported': 'Importada de tu cuenta: cámbiala para esta encuesta si quieres.',
  'branding_guest': 'Añade tu color y tu logotipo a las páginas de creación y de la encuesta compartida.',
  'sign_in_branding': 'Inicia sesión para importar tu marca →',
  'account_logo': 'Logotipo de la cuenta',
  'your_account': 'Tu cuenta',
  'account_colour': 'Color de la cuenta',
  'default_colour': 'Color predeterminado',
  'customise': 'Personalizar para esta encuesta',
  'booking_colour': 'Color de la página de reservas',
  'colour_orange': 'Naranja',
  'colour_blue': 'Azul',
  'colour_pink': 'Rosa',
  'colour_green': 'Verde',
  'custom_colour': 'Color personalizado',
  'brand_name': 'Nombre de la marca',
  'brand_placeholder': 'p. ej., Aventuras Acme',
  'logo': 'Logotipo',
  'logo_preview': 'Vista previa del logotipo',
  'logo_change': 'Cambiar…',
  'logo_upload': 'Subir…',
  'logo_hint': 'PNG, JPG o WebP · las imágenes grandes se reducen automáticamente.',
  'use_account_branding': 'Usar la marca de mi cuenta',

  // "Your poll is live" panel
  'live_booking': 'Tu página de reservas está publicada',
  'live_poll': 'Tu encuesta está publicada',
  'live_booking_body': 'Envía este enlace a la persona con la que quieres reunirte. La primera hora que elija queda reservada, y los dos recibiréis una invitación de calendario.',
  'live_poll_body': 'Comparte este enlace con todas las personas a las que quieras invitar.',
  'copied': '¡Copiado!',
  'open_poll': 'Abrir tu encuesta →',
  'change_times': '← Cambiar las horas',
  'change_times_hint': 'Puedes volver y cambiarlas hasta que alguien responda.',
}

export default create
