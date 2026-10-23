// Spanish (es) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'Tu enlace de administración privado',
  'admin_body_email': 'No lo compartas. Abre la página de administración de la encuesta en cualquier dispositivo donde hayas confirmado el mismo correo electrónico, para que allí puedas confirmar una hora, cambiar la encuesta o eliminarla.',
  'admin_body_no_email': 'No lo compartas: cualquiera que lo tenga puede gestionar la encuesta, confirmar una hora, cambiarla o eliminarla. Guárdalo en un lugar seguro: es la única forma de gestionar la encuesta desde otro dispositivo, o desde aquí si se borran los datos de este navegador.',
  'admin_field': 'Enlace de administración privado',

  // A respondent's own edit link
  'edit_title': 'Tu enlace de edición',
  'edit_body': 'Este dispositivo puede cambiar estas respuestas. Para cambiarlas desde otro dispositivo, abre allí este enlace. No lo compartas: cualquiera que lo tenga puede cambiar o quitar tus respuestas.',

  'copied': '¡Copiado!',
}

export default links
