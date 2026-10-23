// European Portuguese (pt-PT) — common. Every key in ../en/common.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const common: Draft['common'] = {
  // Everyday buttons
  'cancel': 'Cancelar',
  'close': 'Fechar',
  'done': 'Concluído',
  'back': 'Voltar',
  'copy': 'Copiar',
  'delete': 'Eliminar',
  'remove': 'Remover',
  'retry': 'Tentar novamente',

  // Counts
  'responses_one': '{count} resposta',
  'responses_other': '{count} respostas',
  'days_one': '{count} dia',
  'days_other': '{count} dias',

  // Product name, never translated
  'product_name': 'Universal Date Polling',
  'product_short': 'Date Polling',
}

export default common
