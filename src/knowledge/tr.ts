import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Tarih anketi nasıl çalışır',
    summary: 'Birkaç seçenek önerin, tek bir bağlantı paylaşın ve en uygun zamanın öne çıkmasını izleyin.',
    group: 'Temel bilgiler',
    body: `Bir gruba uyan zamanı e-postayla bulmak çoğu zaman "Salı olur ama sabah olmaz" diye uzayıp giden bir yazışmaya dönüşür. Tarih anketi bu yazışmanın yerine herkesin doldurabileceği tek bir sayfa koyar.

## Fikir

1. Düzenleyen kişi birkaç olası tarih veya saat önerir.
2. Katılması gereken herkesle tek bir bağlantı paylaşır.
3. Herkes bağlantıyı açar, adını yazar ve her seçeneği **uygun**, **gerekirse** veya **uygun değil** olarak işaretler.
4. Sonuçlar her seçeneğin yanıtlarını toplar; böylece en çok kişiye uyan zamanlar öne çıkar.
5. Düzenleyen kişi kazanan zamanı onaylar ve bağlantıyı açan herkes bunu görür.

Yanıt vermek için kimsenin hesaba ihtiyacı yoktur. Yalnızca düzenleyen kişinin oturum açması veya e-posta adresini doğrulaması gerekir; bu nedenle anketler anonim olarak oluşturulamaz.

## İki tür anket

- **Saatli** anketler toplantılar ve görüşmeler içindir: her seçeneğin bir başlangıç saati ve süresi vardır.
- **Tam gün** anketleri geziler, etkinlikler ve yalnızca tarihin önemli olduğu her şey içindir.

## İyi bir anket için ipuçları

- Gerçek bir seçim sunacak kadar seçenek ekleyiniz, ancak yanıt vermeyi yorucu hâle getirecek kadar çok değil. Dört ile sekiz arası genellikle iyi sonuç verir.
- "Gerekirse" seçeneğini dürüstçe kullanınız. Bir zamanın mümkün ama ideal olmadığını gösterir ve düzenleyen kişinin eşitliği bozmasına yardımcı olur.
- Ankete açık bir başlık veriniz. Bağlantıyı açanların ilk gördüğü şey budur.
- Farklı ülkelerdeki kişilere soruyorsanız paylaşmadan önce saat dilimini kontrol ediniz ("Saat dilimleri, açıklamalı" makalesine bakınız).
- Bir zamanı onayladığınızda yanıt formu kapanır; böylece kimse oylamaya devam edip etmeyeceğini merak etmez.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Saat dilimleri, açıklamalı',
    summary: 'Saat 15.00 neden her yerde aynı an değildir ve uygulama herkesi nasıl aynı çizgide tutar.',
    group: 'Temel bilgiler',
    body: `"Salı saat 15.00" gibi tek başına bir saat, ancak nerede saatin 15.00 olduğunu bildiğinizde anlam taşır. Saat dilimleri, dünyanın bu konuda anlaşma biçimidir.

## Farklar ve adlar

Her saat dilimi, UTC (Eş Güdümlü Evrensel Zaman) adı verilen ortak bir referans saatin belirli sayıda saat ilerisinde veya gerisindedir. Londra kışın UTC+0, İstanbul UTC+3, New York ise UTC−5'tedir. Yani Londra'da saat 15.00 iken İstanbul'da 18.00, New York'ta 10.00'dır.

Fark tek başına yeterli değildir; çünkü birçok yer yaz saati uygulamasına geçer ve hepsi aynı gün geçmez. Bu yüzden bilgisayarlar Europe/Istanbul veya America/New_York gibi adlandırılmış saat dilimleri kullanır. Adlandırılmış bir saat dilimi o yerin saat değişikliklerinin tüm geçmişini taşır ve her tarih için doğru farkı verir.

## Bu uygulama nasıl ele alır

- Her anketin tek bir saat dilimi vardır. Başlangıçta düzenleyen kişinin saat dilimidir; düzenleyen kişi bunu başka herhangi bir dilimle değiştirebilir.
- Seçenekler o saat diliminin yerel saatiyle yazılır. "3 Mart saat 10.00, Europe/London", arada yaz saati başlasa bile her zaman aynı anı ifade eder.
- Anket sayfası, anketin hangi saat diliminde olduğunu belirtir. Cihazınız farklı bir saat dilimindeyse bir düğmeyle tüm saatleri kendi diliminizde gösterebilir, başka bir dilim seçebilir veya anketin dilimine geri dönebilirsiniz.
- Görüntüleme dilimini değiştirmek yalnızca saatlerin nasıl gösterildiğini değiştirir. Anların kendisi değişmez; herkes aynı anlar hakkında yanıt verir.
- Tam gün seçenekleri yalnızca tarihtir, bu yüzden dönüştürülmez.
- Bir zamanı takviminize eklediğinizde etkinlik tam olarak kararlaştırılan ana yerleştirilir ve takviminiz onu kendi yerel saatinizle gösterir.

## Sık yapılan bir hata

Seyahatteyken anket oluşturursanız cihazınız bulunduğunuz yerin saat dilimine ayarlı olabilir. Paylaşmadan önce anketin saat dilimini kontrol ediniz; böylece "09.00", toplantının gerçekten yapılacağı yerde 09.00 anlamına gelir.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Anket düzenlemek: ilk taslaktan onaylanan zamana',
    summary: 'Anket oluşturmak, değiştirmek, onaylamak ve anketlerinizi yeniden bulmak.',
    group: 'Nasıl çalışır',
    body: `## Anket oluşturmak

1. Ankete bir başlık veriniz ve saatli ya da tam gün türünü seçiniz.
2. Seçeneklerinizi ekleyiniz. Bir takvim bağladıysanız meşgul olduğunuz saatler gölgeli görünür ve **Suggest times**, anketi boş zamanınızdan dört seçenekle doldurabilir: yalnızca hafta içi, anketin saat diliminde 10.00 ile 16.00 arası ve bir günde en fazla bir sabah ile bir öğleden sonra.
3. E-posta adresinizi tek kullanımlık bir kodla doğrulayınız ya da Universal ID'nizle oturum açınız.
4. Bağlantıyı paylaşınız.

## Fikrinizi değiştirmek

Anketi oluşturduktan hemen sonra, henüz kimse yanıt vermediyse geri dönüp zamanları değiştirebilirsiniz. Siz düzenlerken bağlantıyı açanlara biraz sonra tekrar bakmaları söylenir ve siz kaydedene kadar yanıtlar kabul edilmez. Bir düzenlemeyi kaydetmeden on dakika açık bırakırsanız düzenleme kendiliğinden sona erer ve anket yeniden açılır.

## Bir zamanı onaylamak

Yanıtlar geldiğinde kazanan seçeneği **Confirm this time** ile seçiniz. Bunu yalnızca düzenleyen kişi yapabilir. Bağlantıyı açan herkes bundan sonra seçilen zamanı gösteren bir "Confirmed" bandı görür. Seçimi daha sonra değiştirebilir veya geri alabilirsiniz.

Bu banttan şunları yapabilirsiniz:

- Adres bırakan herkese onaylanan zamanı, ekinde bir takvim davetiyle e-postayla göndermek. Bu yalnızca siz tıkladığınızda olur, hiçbir zaman otomatik olarak olmaz.
- **Copy email** ile mesajı kendi e-posta kutunuzdan göndermek; alıcılar, konu ve metin kopyalanmaya hazırdır.
- Zamanı kendi takviminize eklemek.

## Takvime eklemek

Her sonuçta ve onay bandında Google Takvim, Outlook ya da Apple Takvim gibi uygulamalar için bir takvim dosyası seçenekleri sunan bir **Add to calendar** düğmesi bulunur. Takvim etkinliği cihazınızda hazırlanır.

## Anketlerinizi yeniden bulmak

Düzenleyen kişi olarak oturum açtığınızda, oluşturma sayfası etkin anketlerinizi listeler: kaç kişinin yanıt verdiği, varsa onaylanan zaman ve her bağlantının ne zaman sona ereceği. Bir bağlantıyı kopyalayabilir, bir anketi silebilir veya süresi dolan tüm anketlerinizi tek adımda silebilirsiniz.`,
  },
  {
    id: 'poll-options',
    title: 'Randevu sayfaları, bağlantı süresi, bildirimler ve takvimler',
    summary: '"This poll’s options" altındaki her seçeneğin ne işe yaradığı.',
    group: 'Nasıl çalışır',
    body: `Oluşturduğunuz anketin seçenekleri **Actions** menüsünde, **This poll's options** altında yer alır. Yalnızca o anket için geçerlidir.

## Randevu sayfası ("Just the two of us")

Bire bir görüşmeler içindir. Herkesin uygunluğunu toplamak yerine, bağlantıyı gönderdiğiniz kişi zamanlarınızdan birini seçer, adını ve e-posta adresini girer ve randevu anında alınır. Sizin onaylamanız gereken bir şey yoktur; ikiniz de e-postayla bir takvim daveti alırsınız. Buna izin veren bir takvim bağladıysanız davet kendi takviminizden de gönderilebilir. Bir randevuyu daha sonra iptal edebilirsiniz ve karşı taraf bilgilendirilir.

## Bağlantının geçerlilik süresi

Bir anketin bağlantısı 7, 30, 90 veya 180 gün çalışır. Bu bağlantılar serbestçe paylaşıldığı için bilerek "hiç sona ermesin" seçeneği yoktur. Bağlantının süresi dolduğunda anket salt okunur hâle gelir: görüntülenebilir, ancak yeni yanıt kabul edilmez. Bağlantının süresi dolduktan 30 gün sonra anket ve yanıtları silinir.

## Yanıt bildirimleri

Yeni bir kişi her yanıt verdiğinde e-posta almak için bu kutuyu işaretleyiniz. Daha önce verdiği yanıtı değiştiren biri yeni bir e-postaya yol açmaz. Randevu sayfasında bu seçenek sunulmaz; çünkü her randevu size zaten e-posta gönderir.

## Takviminiz

Bir Google veya Microsoft takvimi bağlayabilirsiniz. Uygulama bu takvimi, anket hazırlarken meşgul olduğunuz saatleri gölgelemek ve boş zamanlar önermek için kullanır. Sağlayıcıya ve verdiğiniz izne bağlı olarak etkinlik başlıklarını da gösterebilir ve onaylanan bir zamanı takviminize ekleyebilir. Bağlantıyı istediğiniz zaman kesebilirsiniz; bu işlem kayıtlı bağlantıyı siler.

## Saat dilimi

Her anketin tek bir saat dilimi vardır. Başlangıçta sizinkidir ve başka herhangi birini seçebilirsiniz. "Saat dilimleri, açıklamalı" makalesine bakınız.

## Ayrıca

Toplantı bağlantısı veya bir oda gibi bir konum ekleyebilir ve anket sayfası için bir renk seçebilirsiniz. Bir kuruluşla oturum açtıysanız kuruluşun logosu sayfada görünebilir ya da kendi logonuzu ekleyebilirsiniz.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Anketinizi ve yanıtlarınızı kimler görebilir',
    summary: 'Bağlantıya sahip herkesin gördükleri, yalnızca düzenleyenin gördükleri ve gizli kalanlar.',
    group: 'Gizlilik ve güvenlik',
    body: `Tarih anketi bağlantıyla paylaşılmak üzere tasarlanmıştır; bu yüzden bu bağlantının tam olarak neyi gösterdiğini bilmek yararlıdır.

## Bağlantıya sahip herkes görebilir

- Anketin başlığını, seçeneklerini, saat dilimini ve konumunu, ayrıca kullandığı renk veya logoyu.
- Her katılımcının adını ve her seçenek için uygun, gerekirse veya uygun değil mi dediğini.
- Düzenleyen kişi seçtikten sonra onaylanan zamanı.

Anket bağlantıları on rastgele karakterden oluşur ve bu da tahmin edilmelerini çok zorlaştırır. Ancak bağlantıyı ilettiğiniz herkes yukarıdakilerin tümünü görebilir; bu nedenle bağlantıyı kime gönderdiğinizi düşününüz.

## Yalnızca düzenleyen kişi görebilir

- Katılımcıların bırakmayı seçtiği e-posta adreslerini. Bunlar onaylanan zamanı göndermek ve takvim davetlerini doldurmak için kullanılır ve diğer katılımcılara hiçbir zaman gösterilmez.

## Başka kimse göremez

- Düzenleyen kişinin e-posta adresini. Bu adres düzenleyene bildirimleri ve randevu e-postalarını göndermek için saklanır ve anket sayfasında görünmez.

## Adınız anahtarınızdır

Yanıtlar yazdığınız adla kaydedilir. Tamamen aynı adla yeniden yanıt verirseniz önceki yanıtınız ikinci kez eklenmek yerine güncellenir. Bu, tamamen aynı adı kullanan başka birinin yanıtınızın üzerine yazabileceği anlamına da gelir; bu yüzden tam adınız gibi ayırt edici bir ad kullanınız.

Yeniden yazmanıza gerek kalmasın diye bu cihaz, son yanıtınızda kullandığınız adı ve e-posta adresini hatırlar. Bu bilgiler bu cihazda kalır.

## E-posta bırakmak isteğe bağlıdır

E-posta adresi vermeden yanıt verebilirsiniz. Bir adres bırakırsanız düzenleyen kişi onaylanan zamanı size gönderebilir. İstemiyorsanız alanı boş bırakınız; alan boşken yeniden yanıt vermek daha önce verdiğiniz adresi kaldırır.`,
  },
  {
    id: 'what-is-stored',
    title: 'Neler saklanır ve ne kadar süreyle',
    summary: 'Anket verilerinin nerede durduğu, sürenin dolmasının ne yaptığı ve neyin kime gönderildiği.',
    group: 'Gizlilik ve güvenlik',
    body: `## Sunucularımızda

Bir anketin herkesin erişebileceği bir yerde durması gerekir; bu yüzden anketler ve yanıtlar sunucularımızda saklanır. Bunlara şunlar dahildir:

- Anketin kendisi: başlığı, seçenekleri, saat dilimi, ayarları ve düzenleyen kişinin e-posta adresi.
- Her yanıt: verilen ad, yapılan seçimler ve kaydedildiği zaman.
- Katılımcıların bırakmayı seçtiği e-posta adresleri ile randevu sayfasında randevu alan kişinin adı ve e-posta adresi.
- Düzenleyen kişinin yüklediği bir logo. Anket sayfasının logoyu gösterebilmesi için logolar, anket bağlantısına sahip herkesin yükleyebileceği bir yerde saklanır.
- Düzenleyen kişi bir takvim bağladıysa o bağlantının erişim anahtarları. Bunlar yalnızca sunucuda tutulur, uygulamaya hiçbir zaman gönderilmez ve yalnızca düzenleyen kişinin istediği işler için kullanılır. Bağlantıyı kesmek bunları siler.

Her şey şifreli bağlantılar üzerinden iletilir ve erişim kurallarıyla korunur. Uçtan uca şifreli değildir; yani sistemlerimiz teknik olarak bunları okuyabilir.

## Ne kadar süreyle

Bir anketin bağlantısının süresi dolduğunda anket yanıt kabul etmeyi bırakır ve salt okunur hâle gelir. Düzenleyen kişi yanıtlara yine bakabilsin diye o anda silinmez. Bağlantının süresi dolduktan 30 gün sonra anket, aşağıda sayılan her şeyle birlikte otomatik olarak silinir. Düzenleyen kişi onu daha önce de silebilir ve düzenleyenin anket listesi, süresi dolan tüm anketleri tek adımda silmeye olanak tanır.

Bir anketi silmek; yanıtlarını, katılımcıların e-posta adreslerini ve ilgili takvim bilgilerini de siler. Bir randevuyu iptal etmek, uygulama karşı tarafa haber vermeyi denedikten sonra o kişinin e-posta adresini siler.

## E-postalar

Uygulama yalnızca şu durumlarda e-posta gönderir:

- Düzenleyen kişi e-posta adresini doğrularken tek kullanımlık bir kod.
- Bildirimleri açtıysa düzenleyen kişiye bir yanıt bildirimi.
- Adres bırakan katılımcılara onaylanan zaman; yalnızca düzenleyen kişi göndermek için tıkladığında.
- Randevu sayfasında randevu onayları ve iptalleri.

E-postalar bizim adımıza bir e-posta gönderim hizmeti aracılığıyla gönderilir.

## Cihazınızda

Bu cihaz; son yanıtınızdaki adı ve e-posta adresini, görüntüleme ayarlarınızı ve anket düzenliyorsanız oturumunuzu hatırlar. **Add to calendar** ile eklediğiniz takvim etkinlikleri cihazınızda hazırlanır. Google veya Outlook'u seçmek, etkinlik bilgileri doldurulmuş olarak o hizmeti açar.

## Universal ID'niz

Düzenleyenler, UNI·SIM uygulamalarının ortak kullandığı tek hesap olan Universal ID ile oturum açabilir ya da yalnızca bir e-posta adresini tek kullanımlık bir kodla doğrulayabilir. Bir ankete yanıt vermek hiçbir zaman hesap gerektirmez.`,
  },
]

export default articles
