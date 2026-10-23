// Spanish (es) — common. Every key in ../en/common.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const common: Draft['common'] = {
  // Everyday buttons
  'cancel': 'Cancelar',
  'close': 'Cerrar',
  'done': 'Hecho',
  'back': 'Atrás',
  'copy': 'Copiar',
  'delete': 'Eliminar',
  'remove': 'Quitar',
  'retry': 'Reintentar',

  // Counts
  'responses_one': '{count} respuesta',
  'responses_other': '{count} respuestas',
  'days_one': '{count} día',
  'days_other': '{count} días',

  // Product name, never translated
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}

export default common
