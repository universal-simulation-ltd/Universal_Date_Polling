// Turkish (tr) — mypolls. Every key in ../en/mypolls.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const mypolls: Draft['mypolls'] = {
  // Heading
  'title_active': 'Etkin anketleriniz',
  'title': 'Anketleriniz',
  'nothing_active_one_poll': 'Şu anda etkin anket yok — anketinizin süresi doldu.',
  'nothing_active_polls': 'Şu anda etkin anket yok — anketlerinizin süresi doldu.',

  // Loading
  'load_failed': 'Anketleriniz yüklenemedi. {retry}',
  'some_missing': 'Anketlerinizden bazıları bu listede eksik olabilir — {retry}.',
  'some_missing_retry': 'tekrar deneyin',

  // A poll row
  'booking_page': 'Randevu sayfası',
  'copy_link': 'Bağlantıyı kopyala',
  'copied': 'Kopyalandı!',
  'open': 'Aç →',
  'booked_on': 'Randevu: {when}',
  'confirmed_on': 'Onaylandı: {when}',

  // Deleting
  'delete_all': 'Tümünü sil ({count})',
  'delete_it': 'Sil',
  'show_expired_one': 'Süresi dolan {count} anketi göster',
  'show_expired_other': 'Süresi dolan {count} anketi göster',
  'hide_expired_one': 'Süresi dolan {count} anketi gizle',
  'hide_expired_other': 'Süresi dolan {count} anketi gizle',
  'deleting': 'Siliniyor…',
  'delete_failed_one': 'Bu anket silinemedi — lütfen tekrar deneyin.',
  'delete_failed_some': '{total} anketten {failed} tanesi silinemedi — lütfen tekrar deneyin.',
}

export default mypolls
