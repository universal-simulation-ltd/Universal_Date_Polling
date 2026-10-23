// Spanish (es) — native. Every key in ../en/native.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const native: Draft['native'] = {
  // Tune this app page — back link, ≤ 12 characters
  'back_poll': 'Encuesta',
  'back_new_poll': 'Nueva',

  // Tune this app ▸ the poll's own options row
  'poll_options': 'Opciones de esta encuesta',
  'poll_options_note': 'Página de reservas, caducidad del enlace, avisos de respuesta, calendario y zona horaria',
  // Tune this app ▸ which availability picker the create screen opens on
  'availability_opens_on': 'La disponibilidad se abre en',

  // About this app page
  'about_blurb': 'Propón algunas horas, comparte un solo enlace y mira cuándo están todos disponibles. Nadie necesita una cuenta para responder.',

  // Knowledge base page
  'search': 'Buscar',

  // Confirm sheet's default button
  'confirm_ok': 'Aceptar',
}

export default native
