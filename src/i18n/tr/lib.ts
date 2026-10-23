// Turkish (tr) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The poll's dates as a plain-text list a host pastes into an email
  'list_ask_times': 'Bu saatlerden hangileri size uyar?',
  'list_ask_days': 'Bu günlerden hangileri size uyar?',
  'list_book_time': 'Size uyan herhangi bir saati seçin — seçtiğiniz anda randevu alınır.',
  'list_book_day': 'Size uyan herhangi bir günü seçin — seçtiğiniz anda randevu alınır.',
  'list_all_times': 'Tüm saatler {tz} saat dilimindedir.',
  'list_line_timed': '{date}, {time}',
  'list_link_poll': 'E-postayla yanıt verebilir ya da tercihlerinizi buraya bırakabilirsiniz:',
  'list_link_booking': 'Randevunuzu buradan alın:',
  'where': 'Yer: {location}',

  // The confirmation email a host copies into their own mail client
  'email_subject': 'Zaman onaylandı',
  'email_subject_title': 'Zaman onaylandı: {title}',
  'email_greeting': 'Herkese merhaba,',
  'email_confirmed': 'Bir zaman onayladık:',
  'email_confirmed_title': '{title} için zaman onaylandı:',
  'email_when_timed': '{date}, {time} {tz}',
  'email_add_calendar': 'Anketten takviminize ekleyebilirsiniz:',
  'email_sign_off': 'Görüşmek üzere!',

  // The calendar event
  'event_title_fallback': 'Toplantı',
  'event_description': 'Universal Date Polling ile planlandı.',
  'event_view_poll': 'Anketi görüntüleyin veya güncelleyin: {url}',

  // "Your polls" rows
  'summary_no_times': 'Saat yok',
  'summary_no_dates': 'Tarih yok',
  'summary_times_one': '{count} saat',
  'summary_times_other': '{count} saat',
  'summary_dates_one': '{count} tarih',
  'summary_dates_other': '{count} tarih',
  'confirmed_at': '{date}, {time}',
  'booked': 'Randevu alındı',
  'not_booked': 'Henüz randevu alınmadı',
  'no_responses': 'Henüz yanıt yok',
  'expires_today': 'Bugün sona eriyor',
  'expires_tomorrow': 'Yarın sona eriyor',
  'expires_in_one': '{count} gün içinde sona eriyor',
  'expires_in_other': '{count} gün içinde sona eriyor',
  'expired_deleted_today': 'Süresi doldu · bugün silinecek',
  'expired_deleted_tomorrow': 'Süresi doldu · yarın silinecek',
  'expired_deleted_in_one': 'Süresi doldu · {count} gün içinde silinecek',
  'expired_deleted_in_other': 'Süresi doldu · {count} gün içinde silinecek',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Bu randevu sayfası silinsin mi? Randevu iptal EDİLMEZ — davet iki takvimde de kalır.',
  'delete_booking': 'Bu randevu sayfası silinsin mi?',
  'delete_poll': 'Bu anket silinsin mi?',
  'delete_poll_responses_one': 'Bu anket ve {count} yanıtı silinsin mi?',
  'delete_poll_responses_other': 'Bu anket ve {count} yanıtı silinsin mi?',
  'delete_expired_one': 'Süresi dolan bu anket ve yanıtları silinsin mi? Bu işlem geri alınamaz.',
  'delete_expired_other': 'Süresi dolan {count} anketin tümü ve yanıtları silinsin mi? Bu işlem geri alınamaz.',
  'cannot_undo': 'Bu işlem geri alınamaz.',
  'delete_active': 'Etkin {polls} anketin tümü silinsin mi? Bağlantıları hemen çalışmayı durdurur ve bu işlem geri alınamaz.',
  'delete_active_responses_one': 'Etkin {polls} anketin tümü ve {count} yanıtı silinsin mi? Bağlantıları hemen çalışmayı durdurur ve bu işlem geri alınamaz.',
  'delete_active_responses_other': 'Etkin {polls} anketin tümü ve {count} yanıtı silinsin mi? Bağlantıları hemen çalışmayı durdurur ve bu işlem geri alınamaz.',
  'delete_active_booked': 'Önceden alınmış bir randevu iptal EDİLMEZ — o davet iki takvimde de kalır.',

  // The free allowance banner on the create screen
  'near_limit_one': '{count} ücretsiz etkin anketinizden {used} tanesini kullandınız.',
  'near_limit_other': '{count} ücretsiz etkin anketinizden {used} tanesini kullandınız.',
  'at_limit_one': '{count} ücretsiz etkin anketinizin tümünü kullandınız. Yer açmak için bir anketi silin ya da birinin bitmesini bekleyin.',
  'at_limit_other': '{count} ücretsiz etkin anketinizin tümünü kullandınız. Yer açmak için bir anketi silin ya da birinin bitmesini bekleyin.',
  'at_limit_unknown': 'Ücretsiz etkin anketlerinizi kullandınız. Yer açmak için bir anketi silin ya da birinin bitmesini bekleyin.',

  // Error messages
  'err_verify': 'Doğrulama başarısız oldu — lütfen tekrar deneyin.',
  'err_session': 'Oturum başlatılamadı — lütfen tekrar deneyin.',
  'err_logo_type': 'Logo PNG, JPG veya WebP biçiminde bir görsel olmalıdır.',
  'err_logo_large': 'Bu görsel yüklemek için çok büyük — daha küçük bir tane deneyin.',
  'err_send_emails_retry': 'E-postalar gönderilemedi — lütfen tekrar deneyin.',
  'err_send_emails': 'E-postalar gönderilemedi.',
  'err_book_retry': 'Bu zaman için randevu alınamadı — lütfen tekrar deneyin.',
  'err_book': 'Bu zaman için randevu alınamadı.',
  'err_cancel_booking_retry': 'Bu randevu iptal edilemedi — lütfen tekrar deneyin.',
  'err_cancel_booking': 'Bu randevu iptal edilemedi.',
  'err_calendar_retry': 'Takvim isteği başarısız oldu — lütfen tekrar deneyin.',
  'err_calendar': 'Takvim isteği başarısız oldu.',
  'err_busy_load': 'Takvim uygunluğunuz yüklenemedi.',
  'err_calendar_add': 'Bu, takviminize eklenemedi.',
  'err_calendar_remove': 'Bu, takviminizden kaldırılamadı.',
}

export default lib
