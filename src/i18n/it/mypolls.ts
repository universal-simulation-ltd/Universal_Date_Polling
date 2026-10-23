// Italian (it) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'I tuoi sondaggi attivi',
  'title': 'I tuoi sondaggi',
  'nothing_active_one_poll': 'Al momento non c’è nulla di attivo: il tuo sondaggio è scaduto.',
  'nothing_active_polls': 'Al momento non c’è nulla di attivo: i tuoi sondaggi sono scaduti.',

  // Loading
  'load_failed': 'Impossibile caricare i tuoi sondaggi. {retry}',
  'some_missing': 'Alcuni dei tuoi sondaggi potrebbero mancare da questo elenco: {retry}.',
  'some_missing_retry': 'riprova',

  // A poll row
  'booking_page': 'Pagina di prenotazione',
  'copy_link': 'Copia link',
  'copied': 'Copiato!',
  'open': 'Apri →',
  'booked_on': 'Prenotato: {when}',
  'confirmed_on': 'Confermato: {when}',

  // Deleting
  'delete_all': 'Elimina tutti e {count}',
  'delete_it': 'Eliminalo',
  'show_expired_one': 'Mostra {count} scaduto',
  'show_expired_other': 'Mostra {count} scaduti',
  'hide_expired_one': 'Nascondi {count} scaduto',
  'hide_expired_other': 'Nascondi {count} scaduti',
  'deleting': 'Eliminazione…',
  'delete_failed_one': 'Non è stato possibile eliminare quel sondaggio: riprova.',
  'delete_failed_some': 'Non è stato possibile eliminare {failed} sondaggi su {total}: riprova.',
}

export default mypolls
