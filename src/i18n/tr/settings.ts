// Turkish (tr) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Bu anketin seçenekleri',
  'description': 'Bunlar şu anda oluşturduğunuz anket için geçerlidir.',
  'back_new_poll': 'Yeni anket',

  // Booking page
  'booking_lead': 'Yalnızca ikimiz',
  'booking_label': '{lead} — bunu anında randevu sayfası yap',
  'booking_on': 'Bağlantıyı gönderdiğiniz kişi bir zaman seçer ve randevu anında alınır — oylama yok, sizin onaylamanız gereken bir şey yok. İkiniz de e-postayla bir takvim daveti alırsınız.',
  'booking_off': 'Bire bir görüşmeler için. Karşı taraf bir zaman seçer, randevu kendiliğinden alınır ve ikiniz de bir takvim daveti alırsınız — uygunlukları toplayıp zamanı kendiniz onaylamanız gerekmez.',

  // Link expiry
  'validity_label': 'Bağlantının geçerlilik süresi',
  'validity_hint_one': 'Ardından {count} gün salt okunur kalır ve yanıtlarıyla birlikte silinir.',
  'validity_hint_other': 'Ardından {count} gün salt okunur kalır ve yanıtlarıyla birlikte silinir.',

  // Response alerts
  'alerts_label': 'Davetlileriniz yanıt verdiğinde e-posta almak ister misiniz?',
  'alerts_signed_in': 'Yeni biri her yanıt verdiğinde {email} adresine e-posta göndereceğiz.',
  'alerts_verified': 'Yeni biri her yanıt verdiğinde {email} (doğrulandı) adresine e-posta göndereceğiz.',
  'alerts_optional': 'E-postanızı aşağıya ekleyin (doğrulamak için bir kod göndereceğiz); biri her yanıt verdiğinde size oradan haber verelim.',
  'alerts_confirm': 'Anketinizi oluşturmak için e-postanızı aşağıda doğrulayacaksınız — bunu işaretlerseniz biri her yanıt verdiğinde size oradan da haber veririz.',

  // Your calendar
  'calendar_label': 'Takviminiz',
  'calendar_body': 'Bir takvim bağlayın; {calendar} görünümü zaten dolu olduğunuz saatleri gölgelesin. Gölgelendirmeyi yalnızca siz görürsünüz — anketi gönderdiğiniz kişilere hiçbir şey gösterilmez. {outlook} her bloğu etkinliğin adıyla da etiketler; {google} yalnızca dolu saatleri gölgeler ve oradaki etkinlik adlarınızı, davetlilerinizi, konumlarınızı veya açıklamalarınızı asla okumayız.',
  'calendar_view': 'Takvim',
  'add_another': 'Bir tane daha ekleyin:',
  'nothing_connected': 'Henüz bağlı bir şey yok.',
  'prompt_hidden': 'Takvimin yanındaki bağlanma önerisi gizlendi.',
  'show_again': 'Yeniden göster',
  'connected': 'bağlandı',
  'connected_as': '{email} olarak bağlandı',
  'disconnect': 'Bağlantıyı kes',
  'titles_offer': 'Yalnızca dolu saatler — bu bağlantı etkinlik adlarından önce kuruldu.',
  'reconnect_titles': 'Göstermek için yeniden bağlanın',

  // Timezone
  'timezone_label': 'Saat dilimi',
  'timezone_hint': 'Bu anketteki her saat bu dilime göre yazılır; her davetli kendi dilimine çevrilmiş hâlini görür. Orada saat şu an {time}.',
}

export default settings
