// Italian (it) — settings. Every key in ../en/settings.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const settings: Draft['settings'] = {
  'title': 'Opzioni di questo sondaggio',
  'description': 'Valgono per il sondaggio che stai creando ora.',
  'back_new_poll': 'Nuovo sondaggio',

  // Booking page
  'booking_lead': 'Solo noi due',
  'booking_label': '{lead}: trasforma questo sondaggio in una pagina di prenotazione immediata',
  'booking_on': 'La persona a cui mandi il link sceglie un orario e l’appuntamento è prenotato all’istante: niente voti, e nulla da confermare. Riceverete entrambi un invito di calendario via email.',
  'booking_off': 'Per un incontro a due. L’altra persona sceglie un orario, la prenotazione avviene da sola e ricevete entrambi un invito di calendario, invece di raccogliere le disponibilità e confermare tu un orario.',

  // Link expiry
  'validity_label': 'Il link resta valido per',
  'validity_hint_one': 'Poi resta di sola lettura per {count} giorno, e viene eliminato insieme alle risposte.',
  'validity_hint_other': 'Poi resta di sola lettura per {count} giorni, e viene eliminato insieme alle risposte.',

  // Response alerts
  'alerts_label': 'Vuoi ricevere un’email quando i tuoi invitati rispondono?',
  'alerts_signed_in': 'Scriveremo a {email} ogni volta che una nuova persona risponde.',
  'alerts_verified': 'Scriveremo a {email} (confermato) ogni volta che una nuova persona risponde.',
  'alerts_optional': 'Aggiungi la tua email qui sotto (ti invieremo un codice per confermarla) e ti avviseremo lì ogni volta che qualcuno risponde.',
  'alerts_confirm': 'Confermerai la tua email qui sotto per creare il sondaggio: spunta questa casella e ti avviseremo lì anche ogni volta che qualcuno risponde.',

  // Your calendar
  'calendar_label': 'Il tuo calendario',
  'calendar_body': 'Collega un calendario e la vista {calendar} ombreggia gli orari in cui sei già occupato. L’ombreggiatura la vedi solo tu: alle persone a cui mandi il sondaggio non viene mostrato nulla. {outlook} indica anche il nome dell’evento su ogni blocco; {google} ombreggia solo gli orari occupati, e lì non leggiamo mai nomi, invitati, luoghi o descrizioni dei tuoi eventi.',
  'calendar_view': 'Calendario',
  'add_another': 'Aggiungine un altro:',
  'nothing_connected': 'Ancora nessun calendario collegato.',
  'prompt_hidden': 'L’invito a collegare un calendario accanto al calendario è nascosto.',
  'show_again': 'Mostralo di nuovo',
  'connected': 'collegato',
  'connected_as': 'collegato come {email}',
  'disconnect': 'Scollega',
  'titles_offer': 'Solo orari occupati: questa connessione è precedente ai nomi degli eventi.',
  'reconnect_titles': 'Ricollegalo per mostrarli',

  // Timezone
  'timezone_label': 'Fuso orario',
  'timezone_hint': 'Ogni orario di questo sondaggio è scritto in questo fuso; ogni invitato lo vede convertito nel proprio. Lì ora sono le {time}.',
}

export default settings
