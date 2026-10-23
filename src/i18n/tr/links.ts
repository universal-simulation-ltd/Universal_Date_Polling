// Turkish (tr) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'Özel yönetici bağlantınız',
  'admin_body_email': 'Bunu kendinize saklayın. Aynı e-posta adresini doğruladığınız her cihazda anketin yönetim sayfasını açar; böylece orada bir zamanı onaylayabilir, anketi değiştirebilir veya silebilirsiniz.',
  'admin_body_no_email': 'Bunu kendinize saklayın — bu bağlantıya sahip olan herkes anketi yönetebilir: bir zamanı onaylayabilir, anketi değiştirebilir veya silebilir. Güvenli bir yere kaydedin: anketi başka bir cihazdan ya da bu tarayıcının verileri silinirse buradan yönetmenin tek yolu budur.',
  'admin_field': 'Özel yönetici bağlantısı',

  // A respondent's own edit link
  'edit_title': 'Düzenleme bağlantınız',
  'edit_body': 'Bu cihaz bu yanıtları değiştirebilir. Başka bir cihazdan değiştirmek için bu bağlantıyı orada açın. Bağlantıyı kendinize saklayın: ona sahip olan herkes yanıtlarınızı değiştirebilir veya kaldırabilir.',

  'copied': 'Kopyalandı!',
}

export default links
