// European Portuguese (pt-PT) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'Copiar uma lista para um e-mail →',
  'text_hide': 'Ocultar o texto do e-mail',
  'text_intro': 'Cole isto diretamente num e-mail para quem prefira responder em vez de clicar.',
  'text_include_link': 'Incluir a ligação para a sondagem',
  'text_copy': 'Copiar texto',
  'copied': 'Copiado!',

  // Copy email (CopyEmail)
  'email_button': '📋 Copiar e-mail',
  'email_title': 'Copiar o e-mail de confirmação',
  'email_description': 'Envie-o a partir do seu próprio e-mail e, antes, altere o que quiser.',
  'email_to': 'Para',
  'email_subject': 'Assunto',
  'email_message': 'Mensagem',
  'email_loading': 'A carregar endereços…',
  'email_no_addresses': 'Ninguém deixou um endereço de e-mail, por isso adicione os destinatários na sua aplicação de e-mail.',
  'email_copy': 'Copiar',
  'email_copy_message': 'Copiar mensagem',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Adicionar ao calendário',
  'calendar_guests_one': 'Convida a pessoa disponível nesse horário — está na caixa de convidados, e nada é enviado até guardar.',
  'calendar_guests_other': 'Convida as {count} pessoas disponíveis nesse horário — estão na caixa de convidados, e nada é enviado até guardar.',
  'calendar_ics': 'Apple / outro (.ics)',
}

export default share
