// Brazilian Portuguese (pt-BR) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'Seu link de administração privado',
  'admin_body_email': 'Guarde este link só para você. Ele abre a página de administração da enquete em qualquer dispositivo em que você confirmou o mesmo e-mail, para você confirmar um horário, alterar a enquete ou excluí-la por lá.',
  'admin_body_no_email': 'Guarde este link só para você: qualquer pessoa que o tiver pode gerenciar a enquete, confirmar um horário, alterá-la ou excluí-la. Salve-o em um lugar seguro: ele é a única forma de gerenciar a enquete de outro dispositivo, ou daqui se os dados deste navegador forem apagados.',
  'admin_field': 'Link de administração privado',

  // A respondent's own edit link
  'edit_title': 'Seu link de edição',
  'edit_body': 'Este dispositivo pode mudar estas respostas. Para mudá-las de outro dispositivo, abra este link nele. Guarde-o só para você: qualquer pessoa que o tiver pode mudar ou remover suas respostas.',

  'copied': 'Copiado!',
}

export default links
