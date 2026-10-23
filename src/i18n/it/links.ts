// Italian (it) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'Il tuo link di amministrazione privato',
  'admin_body_email': 'Tienilo per te. Apre la pagina di amministrazione del sondaggio su qualsiasi dispositivo in cui hai confermato lo stesso indirizzo email, così da lì puoi confermare un orario, modificare il sondaggio o eliminarlo.',
  'admin_body_no_email': 'Tienilo per te: chiunque lo abbia può gestire il sondaggio, cioè confermare un orario, modificarlo o eliminarlo. Conservalo in un posto sicuro: è l’unico modo per gestire il sondaggio da un altro dispositivo, o da qui se i dati di questo browser vengono cancellati.',
  'admin_field': 'Link di amministrazione privato',

  // A respondent's own edit link
  'edit_title': 'Il tuo link di modifica',
  'edit_body': 'Questo dispositivo può modificare queste risposte. Per modificarle da un altro dispositivo, apri lì questo link. Tienilo per te: chiunque lo abbia può modificare o rimuovere le tue risposte.',

  'copied': 'Copiato!',
}

export default links
