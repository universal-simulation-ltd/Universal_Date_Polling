// Turkish (tr) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'Anket yükleniyor…',
  'load_failed': 'Anket yüklenemedi.',
  'load_error_title': 'Bu anket yüklenemedi',
  'load_error_fallback': 'Bir şeyler ters gitti.',
  'not_found_title': 'Anket bulunamadı',
  'not_found_body': 'Bu anket kaldırılmış olabilir ya da bağlantı yanlış.',
  'not_found_create': 'Yeni bir anket oluşturun →',

  // The line under the poll's title
  'header_booked': 'Bu zaman için randevu alındı.',
  'header_waiting': 'Davetlinizin bir zaman seçmesi bekleniyor.',
  'header_pick': 'Size uyan zamanı seçin — randevu hemen alınır.',
  'header_first': 'İlk yanıt veren siz olun.',
  'header_responded_one': '{count} kişi yanıt verdi.',
  'header_responded_other': '{count} kişi yanıt verdi.',
  'times_in': 'Saatler: {tz}',

  // The host is changing the times
  'editing_title': 'Düzenleyen kişi zamanları değiştiriyor, lütfen biraz sonra tekrar bakın.',
  'editing_body': 'Değişiklikler bitince bu sayfa kendiliğinden güncellenir.',

  // The guest has just booked (booking page)
  'booked_title': 'Randevunuz alındı.',
  'booked_via_calendar': '{email} adresine bir takvim daveti gönderiliyor — kabul ettiğinizde toplantı takviminize eklenir.',
  'booked_emailed': 'Daveti {email} adresine e-postayla gönderdik — takviminize eklemek için eki açın.',
  'booked_not_emailed': 'Şu anda size bir kopya e-postayla gönderemedik; yukarıdaki düğmeden takviminize ekleyin — randevunun kendisi alındı.',

  // Hints for the host
  'host_hint': 'Düzenleyen sizsiniz — son zamanı aşağıda {button} ile seçin; bağlantıya sahip herkes bunu görecek.',
  'host_hint_button': 'Bu zamanı onayla',
  'host_booking_hint': 'Bu bir randevu sayfası. Bağlantıyı tek bir kişiye gönderin — hangi zamanı seçerse randevu hemen alınır ve ikiniz de bir takvim daveti alırsınız.',

  // The private admin link
  'admin_checking': 'Yönetici bağlantınız kontrol ediliyor…',
  'admin_failed': 'Bu yönetici bağlantısı bu ankette çalışmadı, bu yüzden anketi davetli olarak görüyorsunuz. Bağlantının tamamını kopyaladığınızdan emin olun.',
  'admin_unsupported': 'Yönetici bağlantıları henüz kullanılamıyor, bu yüzden bu anketi davetli olarak görüyorsunuz. Lütfen bağlantıyı daha sonra tekrar deneyin.',
  'admin_link_summary': 'Özel yönetici bağlantınız',
  'signed_in_as': '{email} olarak oturum açıldı — {signout}',
  'sign_out': 'Çıkış yap',

  // An expired poll
  'expired_one': 'Bu anketin bağlantısının süresi doldu — artık salt okunur ve sürenin dolmasından {count} gün sonra yanıtlarıyla birlikte silinecek.',
  'expired_other': 'Bu anketin bağlantısının süresi doldu — artık salt okunur ve sürenin dolmasından {count} gün sonra yanıtlarıyla birlikte silinecek.',

  // Answering the poll
  'respond_title_days': 'Bu günlerde uygun musunuz?',
  'respond_title_times': 'Bu saatlerde uygun musunuz?',
  'respond_folded': 'Bir zaman onaylandı, bu yüzden bu bölüm kapatıldı. Yanıtlarınızı yine de değiştirebilirsiniz.',
  'respond_intro_days': 'Adınızı yazın, her günü yanıtlayın, sonra kaydedin. Hesap gerekmez.',
  'respond_intro_times': 'Adınızı yazın, her saati yanıtlayın, sonra kaydedin. Hesap gerekmez.',
  'your_name': 'Adınız',
  'name_placeholder': 'ör. Ayşe',
  'your_email': 'E-postanız',
  'optional': '(isteğe bağlı)',
  'email_placeholder': 'siz@example.com',
  'edit_link_ok': 'Düzenleme bağlantınız çalıştı: bunlar sizin yanıtlarınız. Değiştirip kaydedin.',
  'edit_link_failed': 'Bu düzenleme bağlantısı bu anketteki bir yanıtla eşleşmiyor. Kaldırılmış olabilir. Yine de aşağıda yanıt verebilirsiniz.',
  'name_claimed': '“{name}” bu ankete zaten yanıt verdi ve bu yanıtları yalnızca o kişi değiştirebilir. Bu sizseniz size verilen düzenleme bağlantısını açın ya da yanıt verdiğiniz cihazı kullanın. Değilse adınıza bir baş harf veya soyadınızı ekleyin.',
  'name_unclaimed': '“{name}” bu ankete zaten yanıt verdi. Kaydederseniz o yanıtların yerine geçer — sizinse sorun değil. Değilse başkasının yanıtlarının üzerine yazmamak için adınıza bir baş harf veya soyadınızı ekleyin.',
  'name_similar': 'Biri zaten “{name}” adıyla yanıt verdi. Sizi ayırt edebilmeleri için adınıza bir baş harf veya soyadınızı ekleyin.',
  'email_note': 'E-postanızı bırakırsanız düzenleyen kişi son tarihi onayladığında bunu (bir takvim davetiyle birlikte) alırsınız. Adresinizi yalnızca düzenleyen kişi görebilir — diğer katılımcılar asla göremez.',
  'all_day': 'Tüm gün',
  'answer_yes': 'Evet 👍',
  'answer_maybe': 'Gerekirse',
  'answer_no': 'Hayır 🙅‍♀️',
  'saving': 'Kaydediliyor…',
  'replace_answers': 'Yanıtları değiştir: {name}',
  'save_availability': 'Uygunluğumu kaydet',
  'saved': 'Kaydedildi — teşekkürler!',
  'removing': 'Kaldırılıyor…',
  'remove_my_answers': 'Yanıtlarımı kaldır',
  'next_with_email': 'Herkes yanıt verdikten sonra düzenleyen kişi son zamanı seçer — o zaman bunu size bir takvim davetiyle birlikte e-postayla göndereceğiz.',
  'next_without_email': 'Herkes yanıt verdikten sonra düzenleyen kişi son zamanı seçer. Görmek için bu bağlantıyı yeniden açın ya da size gönderilmesi için yukarıya e-postanızı ekleyip yeniden kaydedin.',

  // Errors while answering
  'err_name': 'Kim olduğunuzu bilsinler diye adınızı ekleyin.',
  'err_email': 'Bu e-posta doğru görünmüyor — düzeltin ya da boş bırakın.',
  'err_email_store_why': 'Uygunluğunuz kaydedildi, ancak e-postanız saklanamadı — {why}.',
  'err_email_store': 'Uygunluğunuz kaydedildi, ancak e-postanız saklanamadı — yeniden kaydetmeyi deneyin.',
  'err_save': 'Yanıtınız kaydedilemedi.',

  // Removing answers
  'remove_confirm_host': '“{name}” adlı kişinin yanıtları bu anketten kaldırılsın mı? Bu işlem geri alınamaz.',
  'remove_confirm_own': 'Yanıtlarınız bu anketten kaldırılsın mı? Bu işlem geri alınamaz.',
  'remove_confirm_button': 'Kaldır',
  'err_remove_host': 'Bu yanıt kaldırılamadı — sayfayı yenileyip tekrar deneyin.',
  'err_remove_own': 'Bu yanıtları yalnızca veren kişi kaldırabilir.',
  'err_remove': 'Bu yanıtlar kaldırılamadı.',
  'err_confirm': 'Zaman onaylanamadı.',

  // A booking page: the guest picks one time
  'pick_day': 'Bir gün seçin',
  'pick_time': 'Bir saat seçin',
  'booking_intro': 'Hangisini seçerseniz randevu hemen alınır — geri göndermeniz gereken başka bir şey yok ve hesap gerekmez.',
  'booking_email_note': 'Takvim davetiniz bu adrese gelir. Yalnızca bu randevu için kullanılır.',
  'booking': 'Randevu alınıyor…',
  'book_day': 'Bu gün için randevu al',
  'book_time': 'Bu saat için randevu al',
  'pick_day_above': 'Yukarıdan bir gün seçin',
  'pick_time_above': 'Yukarıdan bir saat seçin',
  'offering_days': 'Sunduğunuz günler',
  'offering_times': 'Sunduğunuz saatler',
  'err_book_name': 'Kiminle görüşeceklerini bilsinler diye adınızı ekleyin.',
  'err_book_email': 'Davetinizin gideceği e-posta adresini ekleyin.',
  'err_book': 'Bu zaman için randevu alınamadı.',
  'cancel_not_notified': 'Randevu iptal edildi ve sayfa yeniden açıldı — ancak davetlinize e-posta gönderemedik. Lütfen kendisine siz haber verin.',
  'err_cancel': 'Bu randevu iptal edilemedi.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Bu zaman için randevu alındı — ancak bir e-posta ulaşmadı.',
  'notify_your_guest': 'davetliniz',
  'notify_both': 'Siz de {who} de bu konuda e-posta almadınız. Zaman her durumda ayrılmış durumda; onaylamak için doğrudan iletişime geçmeniz iyi olur.',
  'notify_invitee': '{who} e-postayla bilgilendirilemedi; bu yüzden onaylandığını bilmiyor olabilir. Zaman ayrılmış durumda — doğrudan iletişime geçmek en güvenilir çözüm.',
  'notify_host': '{who} e-postayı aldı ve ayrıntılar elinde, ancak size gönderdiğimiz kopya geri döndü. Bekliyorduysanız hesabınızdaki adresi kontrol edin.',

  // Results
  'results': 'Sonuçlar',
  'results_so_far': 'Şu ana kadarki sonuçlar',
  'results_nobody': 'Kimse yanıt vermedi.',
  'results_responded_one': '{count} kişi yanıt verdi.',
  'results_responded_other': '{count} kişi yanıt verdi.',
  'no_responses_host': 'Henüz yanıt yok — başlamak için bağlantıyı paylaşın.',
  'no_responses_guest': 'Henüz yanıt yok — ilk yanıt sizinki olacak.',
  'confirmed_chip': '✓ Onaylandı',
  'best_chip': 'En iyi',
  'tally_maybe_one': '{count} gerekirse',
  'tally_maybe_other': '{count} gerekirse',
  'tally_no_one': '{count} uygun değil',
  'tally_no_other': '{count} uygun değil',
  'names_maybe': 'gerekirse: {names}',
  'names_no': 'uygun değil: {names}',
  'confirm_this_time': '✓ Bu zamanı onayla',
  'unconfirm': 'Onayı kaldır',
  'remove_an_answer': 'Bir yanıtı kaldır',
  'remove_an_answer_hint': 'Gereksiz ya da yinelenen bir yanıt için veya düzenleme bağlantısını kaybedip yeniden yanıt vermek isteyen biri için.',
  'remove_name_aria': 'Yanıtları kaldır: {name}',

  // The confirmed banner
  'booked_by': '✓ Randevuyu alan: {name}',
  'booked': '✓ Randevu alındı',
  'confirmed_time': '✓ Onaylanan zaman',
  'cancel_booking_named': 'Bu randevu iptal edilsin mi?\n\n{name} iptal edildiğini bildiren bir e-posta alacak ve sayfa, başka bir zaman seçebilmesi için yeniden açılacak.',
  'cancel_booking_unnamed': 'Bu randevu iptal edilsin mi?\n\nDavetliniz iptal edildiğini bildiren bir e-posta alacak ve sayfa, başka bir zaman seçebilmesi için yeniden açılacak.',
  'cancel_booking_confirm': 'Randevuyu iptal et',
  'keep_it': 'Kalsın',
  'working': 'İşleniyor…',
  'change': 'Değiştir',
  'sending': 'Gönderiliyor…',
  'resend': 'Onayı yeniden gönder',
  'email_again': 'Katılımcılara yeniden e-posta gönder',
  'email_this_time': 'Bu zamanı katılımcılara e-postayla gönder',
  'sent_one': '{count} kişiye gönderildi ✓',
  'sent_other': '{count} kişiye gönderildi ✓',
  'no_one_email': 'Henüz kimse e-posta adresi bırakmadı.',
  'guest_emailed_named': '{name} randevu alırken daveti e-postayla aldı ✓',
  'guest_emailed': 'Davetliniz randevu alırken daveti e-postayla aldı ✓',
  'respondents_emailed': 'Katılımcılara e-posta gönderildi ✓',
  'notify_hint': 'Onaylanan tarihi ve bir takvim davetini e-posta bırakan herkese gönderir.',

  // The host's own calendar
  'adding': 'Ekleniyor…',
  'update_in_calendar': 'Takvimimde güncelle',
  'add_to_my_provider': 'Takvimime ekle ({provider})',
  'add_to_my_calendars': 'Takvimlerime ekle',
  'reconnect_to_add': 'Eklemek için yeniden bağlan ({provider})',
  'added_to': 'Eklendi: {providers} ✓',
  'list_two': '{a} ve {b}',
  'cal_stale': 'Takviminiz yalnızca uygunluk için bağlanmıştı — etkinlik eklemeye izin vermek için bir kez yeniden bağlayın.',
  'cal_stale_hint': 'Yalnızca uygunluk için bağlı. Bir kez yeniden bağlarsanız bu zaman doğrudan takviminize eklenebilir.',
  'cal_add_hint': 'Bu zamanı kendi takviminize ekler. İki kez tıklamak sorun değil — aynı etkinliği günceller.',
  'cal_expired': 'Takvim bağlantınızın süresi doldu — oluşturma ekranından yeniden bağlayın.',
  'cal_add_failed': 'Bu, takviminize eklenemedi.',
  'cal_popups': 'Takviminizi yeniden bağlamak için bu sitede açılır pencerelere izin verin.',
  'cal_claim_failed': 'Takviminizin bağlantısı tamamlanamadı.',
  'cal_reconnect_failed': 'Yeniden bağlanma başlatılamadı.',
  'err_send': 'E-postalar gönderilemedi.',

  // The timezone bar
  'tz_poll_in': 'Bu anket {tz} {zone} saat diliminde.',
  'tz_show_mine': 'Saatleri kendi saat diliminizde göster ({tz})',
  'tz_reset': 'Anketin saat dilimine dön',
  'your_time': '{time} sizin saatinizle',
  'your_time_dated': '{date}, {time} sizin saatinizle',

  // Folding sections
  'show': 'Göster ▾',
  'hide': 'Gizle ▴',

  'brand_alt': 'Marka',
}

export default poll
