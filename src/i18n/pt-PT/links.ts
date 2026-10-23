// European Portuguese (pt-PT) — links. Every key in ../en/links.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const links: Draft['links'] = {
  // The host's private admin link
  'admin_title': 'A sua ligação de administração privada',
  'admin_body_email': 'Guarde-a só para si. Abre a página de administração da sondagem em qualquer dispositivo em que tenha confirmado o mesmo endereço de e-mail, para aí confirmar um horário, alterar a sondagem ou eliminá-la.',
  'admin_body_no_email': 'Guarde-a só para si — quem a tiver pode gerir a sondagem: confirmar um horário, alterá-la ou eliminá-la. Guarde-a num local seguro: é a única forma de gerir a sondagem a partir de outro dispositivo, ou aqui, se os dados deste navegador forem apagados.',
  'admin_field': 'Ligação de administração privada',

  // A respondent's own edit link
  'edit_title': 'A sua ligação de edição',
  'edit_body': 'Este dispositivo pode alterar estas respostas. Para as alterar a partir de outro dispositivo, abra esta ligação nele. Guarde-a só para si: quem a tiver pode alterar ou remover as suas respostas.',

  'copied': 'Copiado!',
}

export default links
