// Spanish (es) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'Tus encuestas activas',
  'title': 'Tus encuestas',
  'nothing_active_one_poll': 'No hay nada activo ahora mismo: tu encuesta ha caducado.',
  'nothing_active_polls': 'No hay nada activo ahora mismo: tus encuestas han caducado.',

  // Loading
  'load_failed': 'No se pudieron cargar tus encuestas. {retry}',
  'some_missing': 'Puede que falten algunas de tus encuestas en esta lista: {retry}.',
  'some_missing_retry': 'vuelve a intentarlo',

  // A poll row
  'booking_page': 'Página de reservas',
  'copy_link': 'Copiar enlace',
  'copied': '¡Copiado!',
  'open': 'Abrir →',
  'booked_on': 'Reservada: {when}',
  'confirmed_on': 'Confirmada: {when}',

  // Deleting
  'delete_all': 'Eliminar las {count}',
  'delete_it': 'Eliminarla',
  'show_expired_one': 'Mostrar {count} caducada',
  'show_expired_other': 'Mostrar {count} caducadas',
  'hide_expired_one': 'Ocultar {count} caducada',
  'hide_expired_other': 'Ocultar {count} caducadas',
  'deleting': 'Eliminando…',
  'delete_failed_one': 'No se pudo eliminar esa encuesta. Inténtalo de nuevo.',
  'delete_failed_some': 'No se pudieron eliminar {failed} de {total} encuestas. Inténtalo de nuevo.',
}

export default mypolls
