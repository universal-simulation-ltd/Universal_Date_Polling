// Brazilian Portuguese (pt-BR) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'Suas enquetes ativas',
  'title': 'Suas enquetes',
  'nothing_active_one_poll': 'Nada ativo no momento: sua enquete expirou.',
  'nothing_active_polls': 'Nada ativo no momento: suas enquetes expiraram.',

  // Loading
  'load_failed': 'Não foi possível carregar suas enquetes. {retry}',
  'some_missing': 'Algumas das suas enquetes podem estar faltando nesta lista: {retry}.',
  'some_missing_retry': 'tente de novo',

  // A poll row
  'booking_page': 'Página de agendamento',
  'copy_link': 'Copiar link',
  'copied': 'Copiado!',
  'open': 'Abrir →',
  'booked_on': 'Agendado: {when}',
  'confirmed_on': 'Confirmado: {when}',

  // Deleting
  'delete_all': 'Excluir todas as {count}',
  'delete_it': 'Excluir',
  'show_expired_one': 'Mostrar {count} expirada',
  'show_expired_other': 'Mostrar {count} expiradas',
  'hide_expired_one': 'Ocultar {count} expirada',
  'hide_expired_other': 'Ocultar {count} expiradas',
  'deleting': 'Excluindo…',
  'delete_failed_one': 'Não foi possível excluir essa enquete. Tente de novo.',
  'delete_failed_some': 'Não foi possível excluir {failed} de {total} enquetes. Tente de novo.',
}

export default mypolls
