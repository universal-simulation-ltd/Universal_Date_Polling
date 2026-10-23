// Turkish (tr) — common. Every key in ../en/common.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const common: Draft['common'] = {
  // Everyday buttons
  'cancel': 'İptal',
  'close': 'Kapat',
  'done': 'Bitti',
  'back': 'Geri',
  'copy': 'Kopyala',
  'delete': 'Sil',
  'remove': 'Kaldır',
  'retry': 'Tekrar dene',

  // Counts
  'responses_one': '{count} yanıt',
  'responses_other': '{count} yanıt',
  'days_one': '{count} gün',
  'days_other': '{count} gün',

  // Product name, never translated
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}

export default common
