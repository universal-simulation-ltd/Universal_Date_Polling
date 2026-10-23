// Spanish (es) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'Copiar una lista para un correo →',
  'text_hide': 'Ocultar el texto del correo',
  'text_intro': 'Pégalo directamente en un correo para quien prefiera contestar en lugar de hacer clic.',
  'text_include_link': 'Incluir el enlace a la encuesta',
  'text_copy': 'Copiar texto',
  'copied': '¡Copiado!',

  // Copy email (CopyEmail)
  'email_button': '📋 Copiar correo',
  'email_title': 'Copiar el correo de confirmación',
  'email_description': 'Envíalo desde tu propio correo y, antes, cambia lo que quieras.',
  'email_to': 'Para',
  'email_subject': 'Asunto',
  'email_message': 'Mensaje',
  'email_loading': 'Cargando direcciones…',
  'email_no_addresses': 'Nadie dejó una dirección de correo, así que añade tú los destinatarios en tu aplicación de correo.',
  'email_copy': 'Copiar',
  'email_copy_message': 'Copiar mensaje',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Añadir al calendario',
  'calendar_guests_one': 'Invita a la persona disponible a esa hora: está en el campo de invitados, y no se envía nada hasta que guardes.',
  'calendar_guests_other': 'Invita a las {count} personas disponibles a esa hora: están en el campo de invitados, y no se envía nada hasta que guardes.',
  'calendar_ics': 'Apple / otros (.ics)',
}

export default share
