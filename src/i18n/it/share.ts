// Italian (it) — share. Every key in ../en/share.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const share: Draft['share'] = {
  // Copy a list for an email (CopyAsText)
  'text_show': 'Copia un elenco per un’email →',
  'text_hide': 'Nascondi il testo dell’email',
  'text_intro': 'Incollalo direttamente in un’email per chi preferisce rispondere invece di fare clic.',
  'text_include_link': 'Includi il link al sondaggio',
  'text_copy': 'Copia testo',
  'copied': 'Copiato!',

  // Copy email (CopyEmail)
  'email_button': '📋 Copia email',
  'email_title': 'Copia l’email di conferma',
  'email_description': 'Inviala dalla tua casella di posta, e prima modifica pure quello che vuoi.',
  'email_to': 'A',
  'email_subject': 'Oggetto',
  'email_message': 'Messaggio',
  'email_loading': 'Caricamento degli indirizzi…',
  'email_no_addresses': 'Nessuno ha lasciato un indirizzo email, quindi aggiungi tu i destinatari nella tua app di posta.',
  'email_copy': 'Copia',
  'email_copy_message': 'Copia messaggio',

  // Add to calendar (AddToCalendar)
  'calendar_button': 'Aggiungi al calendario',
  'calendar_guests_one': 'Invita la persona libera a quell’orario: è già nel campo degli invitati, e non viene inviato nulla finché non salvi.',
  'calendar_guests_other': 'Invita le {count} persone libere a quell’orario: sono già nel campo degli invitati, e non viene inviato nulla finché non salvi.',
  'calendar_ics': 'Apple / altro (.ics)',
}

export default share
