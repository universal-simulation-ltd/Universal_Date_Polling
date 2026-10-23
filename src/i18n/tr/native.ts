// Turkish (tr) — native. Every key in ../en/native.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const native: Draft['native'] = {
  // Tune this app page — back link (≤ 12 characters)
  'back_poll': 'Anket',
  'back_new_poll': 'Yeni anket',

  // Tune this app ▸ the poll's own options row
  'poll_options': 'Bu anketin seçenekleri',
  'poll_options_note': 'Randevu sayfası, bağlantının süresi, yanıt bildirimleri, takvim ve saat dilimi',
  // Tune this app ▸ which availability picker the create screen opens on
  'availability_opens_on': 'Uygunluk şu görünümde açılır',

  // About this app page
  'about_blurb': 'Birkaç zaman önerin, tek bir bağlantı paylaşın ve herkesin ne zaman uygun olduğunu görün. Yanıt vermek için kimsenin hesaba ihtiyacı yok.',

  // Knowledge base page — the search box
  'search': 'Ara',

  // Confirm sheet: the default confirm button
  'confirm_ok': 'Tamam',
}

export default native
