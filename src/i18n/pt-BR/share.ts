// Brazilian Portuguese (pt-BR) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'Copiar uma lista para e-mail →',
  'text_hide': 'Ocultar o texto do e-mail',
  'text_intro': 'Cole isto direto em um e-mail para quem prefere responder a clicar.',
  'text_include_link': 'Incluir o link da enquete',
  'text_copy': 'Copiar texto',
  'copied': 'Copiado!',

  // Copy email (CopyEmail)
  'email_button': '📋 Copiar e-mail',
  'email_title': 'Copiar o e-mail de confirmação',
  'email_description': 'Envie do seu próprio e-mail e mude o que quiser antes.',
  'email_to': 'Para',
  'email_subject': 'Assunto',
  'email_message': 'Mensagem',
  'email_loading': 'Carregando endereços…',
  'email_no_addresses': 'Ninguém deixou um e-mail, então adicione os destinatários no seu app de e-mail.',
  'email_copy': 'Copiar',
  'email_copy_message': 'Copiar mensagem',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Adicionar à agenda',
  'calendar_guests_one': 'Convida a pessoa livre nesse horário: ela está no campo de convidados, e nada é enviado até você salvar.',
  'calendar_guests_other': 'Convida as {count} pessoas livres nesse horário: elas estão no campo de convidados, e nada é enviado até você salvar.',
  'calendar_ics': 'Apple / outros (.ics)',
}

export default share
