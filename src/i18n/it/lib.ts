// Italian (it) — lib. Every key in ../en/lib.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const lib: Draft['lib'] = {
  // The poll's dates as a plain-text list a host pastes into an email
  'list_ask_times': 'Quali di questi orari vanno bene per te?',
  'list_ask_days': 'Quali di questi giorni vanno bene per te?',
  'list_book_time': 'Scegli l’orario che preferisci: viene prenotato appena lo scegli.',
  'list_book_day': 'Scegli il giorno che preferisci: viene prenotato appena lo scegli.',
  'list_all_times': 'Tutti gli orari sono in {tz}.',
  'list_line_timed': '{date} alle {time}',
  'list_link_poll': 'Puoi rispondere a questa email, oppure indicare le tue preferenze qui:',
  'list_link_booking': 'Prenota il tuo orario qui:',
  'where': 'Dove: {location}',

  // The confirmation email a host copies into their own mail client
  'email_subject': 'Orario confermato',
  'email_subject_title': 'Orario confermato: {title}',
  'email_greeting': 'Ciao a tutti,',
  'email_confirmed': 'Abbiamo confermato un orario:',
  'email_confirmed_title': 'L’orario per {title} è confermato:',
  'email_when_timed': '{date} alle {time} {tz}',
  'email_add_calendar': 'Puoi aggiungerlo al tuo calendario dal sondaggio:',
  'email_sign_off': 'A presto!',

  // The calendar event
  'event_title_fallback': 'Riunione',
  'event_description': 'Programmato con Universal Date Polling.',
  'event_view_poll': 'Vedi o aggiorna il sondaggio: {url}',

  // "Your polls" rows
  'summary_no_times': 'Nessun orario',
  'summary_no_dates': 'Nessuna data',
  'summary_times_one': '{count} orario',
  'summary_times_other': '{count} orari',
  'summary_dates_one': '{count} data',
  'summary_dates_other': '{count} date',
  'confirmed_at': '{date}, {time}',
  'booked': 'Prenotato',
  'not_booked': 'Non ancora prenotato',
  'no_responses': 'Ancora nessuna risposta',
  'expires_today': 'Scade oggi',
  'expires_tomorrow': 'Scade domani',
  'expires_in_one': 'Scade tra {count} giorno',
  'expires_in_other': 'Scade tra {count} giorni',
  'expired_deleted_today': 'Scaduto · eliminato oggi',
  'expired_deleted_tomorrow': 'Scaduto · eliminato domani',
  'expired_deleted_in_one': 'Scaduto · eliminato tra {count} giorno',
  'expired_deleted_in_other': 'Scaduto · eliminato tra {count} giorni',

  // What Delete asks first ("Your polls")
  'delete_booking_booked': 'Eliminare questa pagina di prenotazione? La prenotazione NON viene annullata: l’invito resta in entrambi i calendari.',
  'delete_booking': 'Eliminare questa pagina di prenotazione?',
  'delete_poll': 'Eliminare questo sondaggio?',
  'delete_poll_responses_one': 'Eliminare questo sondaggio e la sua {count} risposta?',
  'delete_poll_responses_other': 'Eliminare questo sondaggio e le sue {count} risposte?',
  'delete_expired_one': 'Eliminare questo sondaggio scaduto e le sue risposte? L’operazione non si può annullare.',
  'delete_expired_other': 'Eliminare tutti i {count} sondaggi scaduti e le loro risposte? L’operazione non si può annullare.',
  'cannot_undo': 'L’operazione non si può annullare.',
  'delete_active': 'Eliminare tutti i {polls} sondaggi attivi? I loro link smetteranno subito di funzionare e l’operazione non si può annullare.',
  'delete_active_responses_one': 'Eliminare tutti i {polls} sondaggi attivi e la loro {count} risposta? I loro link smetteranno subito di funzionare e l’operazione non si può annullare.',
  'delete_active_responses_other': 'Eliminare tutti i {polls} sondaggi attivi e le loro {count} risposte? I loro link smetteranno subito di funzionare e l’operazione non si può annullare.',
  'delete_active_booked': 'Una prenotazione già fatta NON viene annullata: quell’invito resta in entrambi i calendari.',

  // The free allowance banner on the create screen
  'near_limit_one': 'Hai usato {used} del tuo {count} sondaggio attivo gratuito.',
  'near_limit_other': 'Hai usato {used} dei tuoi {count} sondaggi attivi gratuiti.',
  'at_limit_one': 'Hai usato il tuo {count} sondaggio attivo gratuito. Elimina un sondaggio o aspetta che uno finisca per fare spazio.',
  'at_limit_other': 'Hai usato tutti i tuoi {count} sondaggi attivi gratuiti. Elimina un sondaggio o aspetta che uno finisca per fare spazio.',
  'at_limit_unknown': 'Hai usato i tuoi sondaggi attivi gratuiti. Elimina un sondaggio o aspetta che uno finisca per fare spazio.',

  // Error messages
  'err_verify': 'Verifica non riuscita: riprova.',
  'err_session': 'Impossibile avviare una sessione: riprova.',
  'err_logo_type': 'Il logo deve essere un’immagine PNG, JPG o WebP.',
  'err_logo_large': 'Questa immagine è troppo grande da caricare: provane una più piccola.',
  'err_send_emails_retry': 'Impossibile inviare le email: riprova.',
  'err_send_emails': 'Impossibile inviare le email.',
  'err_book_retry': 'Impossibile prenotare quell’orario: riprova.',
  'err_book': 'Impossibile prenotare quell’orario.',
  'err_cancel_booking_retry': 'Impossibile annullare quella prenotazione: riprova.',
  'err_cancel_booking': 'Impossibile annullare quella prenotazione.',
  'err_calendar_retry': 'Richiesta al calendario non riuscita: riprova.',
  'err_calendar': 'Richiesta al calendario non riuscita.',
  'err_busy_load': 'Impossibile caricare le disponibilità del tuo calendario.',
  'err_calendar_add': 'Impossibile aggiungere questo evento al tuo calendario.',
  'err_calendar_remove': 'Impossibile rimuovere questo evento dal tuo calendario.',
}

export default lib
