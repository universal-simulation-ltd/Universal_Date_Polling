// German (de) — common. Every key in ../en/common.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const common: Draft['common'] = {
  // Everyday buttons
  'cancel': 'Abbrechen',
  'close': 'Schließen',
  'done': 'Fertig',
  'back': 'Zurück',
  'copy': 'Kopieren',
  'delete': 'Löschen',
  'remove': 'Entfernen',
  'retry': 'Erneut versuchen',

  // Counts
  'responses_one': '{count} Antwort',
  'responses_other': '{count} Antworten',
  'days_one': '{count} Tag',
  'days_other': '{count} Tage',

  // Product name, never translated
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}

export default common
