// Turkish (tr) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Bir zaman bulun,',
  'headline_line2': 'herkese uysun',
  'intro': 'Birkaç zaman önerin, bağlantıyı paylaşın; herkes katılabileceklerini işaretlesin. Hesap gerekmez — ne size ne de onlara.',
  'logo_alt': '{name} logosu',
  'logo_alt_yours': 'Logonuz',

  // Title and location
  'title_label': 'Anket başlığı',
  'title_placeholder': 'ör. Ekip buluşması — 9 Haziran haftası',
  'location_label': 'Konum veya toplantı bağlantısı',
  'optional': '(isteğe bağlı)',
  'location_placeholder': 'ör. 5 numaralı toplantı odası ya da bir Teams / Zoom / Meet bağlantısı',
  'location_hint': 'Ankette herkese gösterilir ve takvim davetine eklenir.',

  // Times to offer
  'times_heading': 'Önerilecek zamanlar',
  'times_hint_none': 'Nasıl eklemek istersiniz? Elle yazın, bir takvimde sürükleyin ya da tam günler önerin.',
  'times_hint_days': 'Katılımcılar uygun oldukları tam günleri işaretler — geziler ve birkaç günlük planlar için ideal.',
  'tz_line': 'Saat {time}. Saat diliminiz: {zone}.',
  'tz_change': 'Saat dilimini değiştirin',

  // Suggest times
  'suggest_question': 'Ne önereceğinizden emin değil misiniz?',
  'suggest_intro_one': 'Boş olduğunuz {count} zaman seçeceğiz — hafta içi, {from}–{to} {zone}, günde en fazla bir sabah ve bir öğleden sonra.',
  'suggest_intro_other': 'Boş olduğunuz {count} zaman seçeceğiz — hafta içi, {from}–{to} {zone}, günde en fazla bir sabah ve bir öğleden sonra.',
  'suggest_button_one': '{count} zaman öner',
  'suggest_button_other': '{count} zaman öner',
  'suggest_finding': 'Boş zaman aranıyor…',
  'suggest_finding_sr': 'Takviminizde boş zaman aranıyor.',
  'suggest_none_one': 'Önümüzdeki {count} gün içinde hafta içi {from} ile {to} arasında boş zaman yok — zamanları elle ekleyin ya da biraz yer açıp tekrar deneyin.',
  'suggest_none_other': 'Önümüzdeki {count} gün içinde hafta içi {from} ile {to} arasında boş zaman yok — zamanları elle ekleyin ya da biraz yer açıp tekrar deneyin.',
  'suggest_some': '{total} zamandan {found} tanesi eklendi — bulunan boş zamanın tamamı buydu. Birini taşımak için sürükleyin, kaldırmak için tıklayın.',
  'suggest_added_one': 'Boş zamanınızdan {count} zaman eklendi. Birini taşımak için sürükleyin, kaldırmak için tıklayın.',
  'suggest_added_other': 'Boş zamanınızdan {count} zaman eklendi. Birini taşımak için sürükleyin, kaldırmak için tıklayın.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Ne zaman dolu olduğunuzu görün',
  'cal_prompt_connect': '{lead} — bir takvim bağlayın, dolu saatleriniz tabloyu gölgelesin. Bunları yalnızca siz görürsünüz.',
  'cal_other_lead': 'Başka bir takviminiz de mi var?',
  'cal_prompt_other': '{lead} Diğer takviminizi de bağlayın; o da tabloyu gölgelesin.',
  'cal_prompt_guest': '{lead} — e-postanızı doğrulayın (anketinizi kaydeden adresle aynı), ardından takviminizi bağlayın. Gölgelendirmeyi yalnızca siz görürsünüz.',
  'connect_google': "Google Calendar'ı bağla",
  'connect_outlook': "Outlook'u bağla",
  'dont_show_again': 'Bir daha gösterme',
  'cal_later_web': 'İstediğiniz zaman yine de bağlayabilirsiniz: profil menünüz (sağ üst) → Bu uygulamayı ayarla → Bu anketin seçenekleri.',
  'cal_later_phone': 'İstediğiniz zaman yine de bağlayabilirsiniz: Ayarla (sağ üst) → Bu anketin seçenekleri.',
  'verify': 'Doğrula',
  'verifying': 'Doğrulanıyor…',
  'different_email': 'Başka bir e-posta',
  'code_sent': '{email} adresine 6 haneli bir kod gönderdik.',
  'sending': 'Gönderiliyor…',
  'email_me_code': 'Bana kod gönder',

  // Calendar errors
  'err_email_first': 'Önce geçerli bir e-posta adresi girin.',
  'err_code': 'E-postanızdaki kodu girin.',
  'cal_read_failed_google': 'Google takviminiz okunamadı — bağlantı çalışıyor, ancak uygunluk sorgusu başarısız oldu. Biraz sonra tekrar deneyin ya da bağlantıyı kesip yeniden bağlayın.',
  'cal_read_failed_outlook': 'Outlook takviminiz okunamadı — bağlantı çalışıyor, ancak uygunluk sorgusu başarısız oldu. Biraz sonra tekrar deneyin ya da bağlantıyı kesip yeniden bağlayın.',
  'cal_read_failed_both': 'Google ve Outlook takviminiz okunamadı — bağlantı çalışıyor, ancak uygunluk sorgusu başarısız oldu. Biraz sonra tekrar deneyin ya da bağlantıyı kesip yeniden bağlayın.',
  'cal_expired': 'Bir takvim bağlantısının süresi doldu — lütfen yeniden bağlayın.',
  'cal_expired_suggest': 'Bir takvim bağlantısının süresi doldu — lütfen yeniden bağlayın, ardından zaman önerin.',
  'cal_read_failed_suggest': 'Takviminiz şu anda okunamadı, bu yüzden hiçbir şey önerilmedi — biraz sonra tekrar deneyin.',
  'cal_cancelled': 'Takvim bağlantısı iptal edildi veya başarısız oldu.',
  'popup_blocked': 'Tarayıcınız açılır pencereyi engelledi — bu site için açılır pencerelere izin verip tekrar deneyin.',

  // Logo errors
  'logo_type': 'Logo PNG, JPG veya WebP biçiminde bir görsel olmalıdır.',
  'logo_size': 'Logo en fazla 10 MB olmalıdır.',

  // Checks before creating
  'err_title': 'Anketinize bir başlık verin.',
  'err_add_day': 'En az bir gün ekleyin.',
  'err_add_time': 'En az bir tarih ve saat ekleyin.',
  'err_email': 'Geçerli bir e-posta adresi girin.',
  'err_booking_email': 'Randevu sayfası her randevuyu size e-postayla bildirir, bu yüzden e-posta adresiniz gerekir.',
  'err_alerts_email': 'Yanıt bildirimleri almak için e-posta adresinizi ekleyin ya da “Bu anketin seçenekleri” bölümünden bildirimleri kapatın.',
  'err_backend': 'Anket oluşturmak için Supabase arka ucunun yapılandırılmış olması gerekir.',
  'err_free_limit': 'Etkin anketler için ücretsiz sınırınıza ulaştınız. Yer açmak için bir anketi silin ya da birinin bitmesini bekleyin.',
  'err_free_limit_held': 'Etkin anketler için ücretsiz sınırınıza ulaştınız (son yeri tutan: {what}). Yer açmak için bir anketi silin ya da birinin bitmesini bekleyin.',
  'err_generic': 'Bir şeyler ters gitti. Lütfen tekrar deneyin.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Randevu sayfası',
  'link_valid': 'Bağlantı {period} geçerli',
  'link_valid_while': 'Bağlantı bir süre geçerli',
  'alerts_on': 'yanıt bildirimleri açık',
  'alerts_off': 'yanıt bildirimi yok',
  'change_these_web': '— bunları profil menünüzden (sağ üst) → Bu uygulamayı ayarla → Bu anketin seçenekleri bölümünden değiştirin.',
  'change_these_phone': '— bunları Ayarla (sağ üst) → Bu anketin seçenekleri bölümünden değiştirin.',

  // Changing the times on a live poll
  'editing_title': 'Yayındaki anketinizin zamanlarını değiştiriyorsunuz.',
  'editing_body': 'Siz kaydedene kadar bağlantıyı açan herkese zamanları değiştirdiğiniz ve biraz sonra tekrar bakmaları söylenir. Henüz kimse yanıt vermedi, yani hiçbir şey kaybolmaz. Markanız olduğu gibi kalır.',
  'editing_cancel': 'İptal — olduğu gibi kalsın',

  // Free allowance
  'need_more': 'Daha fazlası mı lazım? Bize yazın',
  'purchased_tokens_one': '{count} satın alınmış jeton',
  'purchased_tokens_other': '{count} satın alınmış jeton',

  // Who is creating
  'creating_as': '{name} olarak oluşturuluyor — e-posta doğrulaması gerekmez.',
  'creating_as_org': '{name}{email} olarak oluşturuluyor — e-posta doğrulaması gerekmez.',
  'signed_in_as': '{email} olarak oturum açıldı (doğrulandı).',
  'not_you': 'Siz değil misiniz? Çıkış yapın',
  'your_email': 'E-postanız',
  'email_hint_booking': 'Randevu sayfası için gerekli: her randevuyu bu adrese e-postayla göndeririz. Siz olduğunuzu doğrulamak için kısa bir kod göndereceğiz.',
  'email_hint_alerts': 'Yanıt bildirimlerinizi göndereceğimiz adres. Siz olduğunuzu doğrulamak için kısa bir kod göndereceğiz.',
  'email_hint_optional': 'Yalnızca yanıt bildirimleri istiyorsanız ya da anketlerinizi başka bir cihazdan bulmak istiyorsanız — doğrulamak için kısa bir kod göndereceğiz. Boş bırakırsanız anketi yönetmek için özel bir yönetici bağlantısı alırsınız.',
  'email_note_alerts': 'Siz olduğunuzu doğrulamak için kısa bir kod göndereceğiz — bu anketi daha sonra bu şekilde yöneteceksiniz ve yanıt bildirimlerinizi de bu adrese göndereceğiz.',
  'email_note_web': 'Siz olduğunuzu doğrulamak için kısa bir kod göndereceğiz — bu anketi daha sonra bu şekilde yöneteceksiniz. Bir davetli her yanıt verdiğinde e-posta ister misiniz? Bunu profil menünüzden (sağ üst) → Bu uygulamayı ayarla → Bu anketin seçenekleri bölümünden açın.',
  'email_note_phone': 'Siz olduğunuzu doğrulamak için kısa bir kod göndereceğiz — bu anketi daha sonra bu şekilde yöneteceksiniz. Bir davetli her yanıt verdiğinde e-posta ister misiniz? Bunu Ayarla (sağ üst) → Bu anketin seçenekleri bölümünden açın.',
  'code_label': '{email} adresine gönderdiğimiz 6 haneli kodu girin',
  'code_note_alerts': 'Doğrulamak anketinizi oluşturur ve bu adrese yanıt bildirimlerini açar.',
  'code_note': 'Doğrulamak anketinizi oluşturur ve onu daha sonra bu adresle yönetmenizi sağlar.',
  'use_different_email': 'Başka bir e-posta kullan',

  // The main button
  'btn_sending': 'Kod gönderiliyor…',
  'btn_saving': 'Değişiklikler kaydediliyor…',
  'btn_creating': 'Anket oluşturuluyor…',
  'btn_verify_create': 'Doğrula ve anketi oluştur',
  'btn_save': 'Değişiklikleri kaydet',
  'btn_create': 'Anket oluştur',

  // Branding card
  'branding': 'Marka',
  'branding_imported': 'Hesabınızdan alındı — isterseniz bu anket için değiştirin.',
  'branding_guest': 'Anketin oluşturma ve paylaşma sayfalarına renginizi ve logonuzu ekleyin.',
  'sign_in_branding': 'Markanızı almak için giriş yapın →',
  'account_logo': 'Hesap logosu',
  'your_account': 'Hesabınız',
  'account_colour': 'Hesap rengi',
  'default_colour': 'Varsayılan renk',
  'customise': 'Bu anket için özelleştir',
  'booking_colour': 'Randevu sayfası rengi',
  'colour_orange': 'Turuncu',
  'colour_blue': 'Mavi',
  'colour_pink': 'Pembe',
  'colour_green': 'Yeşil',
  'custom_colour': 'Özel renk',
  'brand_name': 'Marka adı',
  'brand_placeholder': 'ör. Acme Turizm',
  'logo': 'Logo',
  'logo_preview': 'Logo önizlemesi',
  'logo_change': 'Değiştir…',
  'logo_upload': 'Yükle…',
  'logo_hint': 'PNG, JPG veya WebP · büyük görseller sizin için yeniden boyutlandırılır.',
  'use_account_branding': 'Bunun yerine hesabımın markasını kullan',

  // "Your poll is live" panel
  'live_booking': 'Randevu sayfanız yayında',
  'live_poll': 'Anketiniz yayında',
  'live_booking_body': 'Bu bağlantıyı görüşmek istediğiniz tek kişiye gönderin. Seçtiği ilk zaman için randevu alınır ve ikiniz de bir takvim daveti alırsınız.',
  'live_poll_body': 'Bu bağlantıyı davet etmek istediğiniz herkesle paylaşın.',
  'copied': 'Kopyalandı!',
  'open_poll': 'Anketinizi açın →',
  'change_times': '← Zamanları değiştir',
  'change_times_hint': 'Biri yanıt verene kadar geri dönüp zamanları değiştirebilirsiniz.',
}

export default create
