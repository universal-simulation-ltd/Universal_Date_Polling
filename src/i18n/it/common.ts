// Italian (it) — common. Every key in ../en/common.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const common: Draft['common'] = {
  // Everyday buttons
  'cancel': 'Annulla',
  'close': 'Chiudi',
  'done': 'Fatto',
  'back': 'Indietro',
  'copy': 'Copia',
  'delete': 'Elimina',
  'remove': 'Rimuovi',
  'retry': 'Riprova',

  // Counts
  'responses_one': '{count} risposta',
  'responses_other': '{count} risposte',
  'days_one': '{count} giorno',
  'days_other': '{count} giorni',

  // Product name, never translated
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}

export default common
