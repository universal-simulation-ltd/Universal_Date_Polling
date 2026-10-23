// European Portuguese (pt-PT) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'As suas sondagens ativas',
  'title': 'As suas sondagens',
  'nothing_active_one_poll': 'Nada ativo de momento — a sua sondagem expirou.',
  'nothing_active_polls': 'Nada ativo de momento — as suas sondagens expiraram.',

  // Loading
  'load_failed': 'Não foi possível carregar as suas sondagens. {retry}',
  'some_missing': 'Podem faltar algumas das suas sondagens nesta lista — {retry}.',
  'some_missing_retry': 'tentar novamente',

  // A poll row
  'booking_page': 'Página de marcação',
  'copy_link': 'Copiar ligação',
  'copied': 'Copiado!',
  'open': 'Abrir →',
  'booked_on': 'Marcado: {when}',
  'confirmed_on': 'Confirmado: {when}',

  // Deleting
  'delete_all': 'Eliminar todas ({count})',
  'delete_it': 'Eliminá-la',
  'show_expired_one': 'Mostrar {count} expirada',
  'show_expired_other': 'Mostrar {count} expiradas',
  'hide_expired_one': 'Ocultar {count} expirada',
  'hide_expired_other': 'Ocultar {count} expiradas',
  'deleting': 'A eliminar…',
  'delete_failed_one': 'Não foi possível eliminar essa sondagem — tente novamente.',
  'delete_failed_some': 'Não foi possível eliminar {failed} de {total} sondagens — tente novamente.',
}

export default mypolls
