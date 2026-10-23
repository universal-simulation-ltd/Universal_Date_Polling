// Turkish (tr) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'E-posta için liste kopyala →',
  'text_hide': 'E-posta metnini gizle',
  'text_intro': 'Tıklamak yerine yanıt yazmayı tercih edenler için bunu doğrudan bir e-postaya yapıştırın.',
  'text_include_link': 'Anketin bağlantısını ekle',
  'text_copy': 'Metni kopyala',
  'copied': 'Kopyalandı!',

  // Copy email (CopyEmail)
  'email_button': '📋 E-postayı kopyala',
  'email_title': 'Onay e-postasını kopyala',
  'email_description': 'Kendi e-postanızdan gönderin; isterseniz önce dilediğiniz her şeyi değiştirin.',
  'email_to': 'Kime',
  'email_subject': 'Konu',
  'email_message': 'Mesaj',
  'email_loading': 'Adresler yükleniyor…',
  'email_no_addresses': 'Kimse e-posta adresi bırakmadı; alıcıları e-posta uygulamanızda kendiniz ekleyin.',
  'email_copy': 'Kopyala',
  'email_copy_message': 'Mesajı kopyala',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Takvime ekle',
  'calendar_guests_one': 'O saatte uygun olan kişiyi davet eder — davetliler kutusunda yer alır ve siz kaydedene kadar hiçbir şey gönderilmez.',
  'calendar_guests_other': 'O saatte uygun olan {count} kişiyi davet eder — davetliler kutusunda yer alırlar ve siz kaydedene kadar hiçbir şey gönderilmez.',
  'calendar_ics': 'Apple / diğer (.ics)',
}

export default share
