// Italian (it) — poll. Every key in ../en/poll.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const poll: Draft['poll'] = {
  // Loading, not found, load error
  'loading': 'Caricamento del sondaggio…',
  'load_failed': 'Impossibile caricare il sondaggio.',
  'load_error_title': 'Impossibile caricare questo sondaggio',
  'load_error_fallback': 'Qualcosa è andato storto.',
  'not_found_title': 'Sondaggio non trovato',
  'not_found_body': 'Questo sondaggio potrebbe essere stato rimosso, oppure il link è sbagliato.',
  'not_found_create': 'Crea un nuovo sondaggio →',

  // The line under the poll's title
  'header_booked': 'Questo orario è prenotato.',
  'header_waiting': 'In attesa che il tuo invitato scelga un orario.',
  'header_pick': 'Scegli l’orario che preferisci: viene prenotato subito.',
  'header_first': 'Rispondi per primo.',
  'header_responded_one': '{count} persona ha risposto.',
  'header_responded_other': '{count} persone hanno risposto.',
  'times_in': 'Orari in {tz}',

  // The host is changing the times
  'editing_title': 'L’organizzatore sta modificando gli orari, riprova tra poco.',
  'editing_body': 'Questa pagina si aggiornerà da sola quando avrà finito.',

  // The guest has just booked (booking page)
  'booked_title': 'Prenotazione fatta.',
  'booked_via_calendar': 'Un invito di calendario sta arrivando a {email}: accettalo e la riunione finirà nel tuo calendario.',
  'booked_emailed': 'Abbiamo inviato l’invito a {email}: apri l’allegato per aggiungerlo al tuo calendario.',
  'booked_not_emailed': 'Al momento non è stato possibile inviarti una copia via email, quindi aggiungilo al tuo calendario con il pulsante qui sopra: l’orario è comunque prenotato.',

  // Hints for the host
  'host_hint': 'Sei l’organizzatore: scegli l’orario definitivo qui sotto con {button}, e chiunque abbia il link lo vedrà.',
  'host_hint_button': 'Conferma questo orario',
  'host_booking_hint': 'Questa è una pagina di prenotazione. Manda il link a una sola persona: l’orario che sceglie viene prenotato subito, e riceverete entrambi un invito di calendario.',

  // The private admin link
  'admin_checking': 'Verifica del link di amministrazione…',
  'admin_failed': 'Quel link di amministrazione non funziona per questo sondaggio, quindi lo stai vedendo come ospite. Controlla di aver copiato il link per intero.',
  'admin_unsupported': 'I link di amministrazione non sono ancora disponibili, quindi stai vedendo questo sondaggio come ospite. Riprova il link più tardi.',
  'admin_link_summary': 'Il tuo link di amministrazione privato',
  'signed_in_as': 'Accesso effettuato come {email} — {signout}',
  'sign_out': 'Esci',

  // An expired poll
  'expired_one': 'Il link di questo sondaggio è scaduto: ora è di sola lettura, e verrà eliminato, risposte comprese, {count} giorno dopo la scadenza.',
  'expired_other': 'Il link di questo sondaggio è scaduto: ora è di sola lettura, e verrà eliminato, risposte comprese, {count} giorni dopo la scadenza.',

  // Answering the poll
  'respond_title_days': 'Sei libero in questi giorni?',
  'respond_title_times': 'Sei libero in questi orari?',
  'respond_folded': 'Un orario è stato confermato, quindi questa sezione è chiusa. Puoi comunque modificare le tue risposte.',
  'respond_intro_days': 'Aggiungi il tuo nome, rispondi per ogni giorno, poi salva. Nessun account necessario.',
  'respond_intro_times': 'Aggiungi il tuo nome, rispondi per ogni orario, poi salva. Nessun account necessario.',
  'your_name': 'Il tuo nome',
  'name_placeholder': 'es. Giulia',
  'your_email': 'La tua email',
  'optional': '(facoltativa)',
  'email_placeholder': 'tu@esempio.it',
  'edit_link_ok': 'Il tuo link di modifica ha funzionato: queste sono le tue risposte. Modificale e salva.',
  'edit_link_failed': 'Quel link di modifica non corrisponde a nessuna risposta di questo sondaggio. Potrebbe essere stata rimossa. Puoi comunque rispondere qui sotto.',
  'name_claimed': '«{name}» ha già risposto a questo sondaggio, e solo quella persona può modificare quelle risposte. Se sei tu, apri il link di modifica che hai ricevuto, o usa il dispositivo con cui hai risposto. Altrimenti, aggiungi un’iniziale o il cognome.',
  'name_unclaimed': '«{name}» ha già risposto a questo sondaggio. Salvando sostituirai quelle risposte: va bene se sono tue. Altrimenti, aggiungi un’iniziale o il cognome per non sovrascrivere le risposte di qualcun altro.',
  'name_similar': 'Qualcuno ha già risposto come «{name}». Aggiungi un’iniziale o il cognome, così gli altri potranno distinguervi.',
  'email_note': 'Lascia la tua email e riceverai la data definitiva (con un invito di calendario) quando l’organizzatore la conferma. Può vederla solo l’organizzatore, mai gli altri partecipanti.',
  'all_day': 'Tutto il giorno',
  'answer_yes': 'Sì 👍',
  'answer_maybe': 'Se necessario',
  'answer_no': 'No 🙅‍♀️',
  'saving': 'Salvataggio…',
  'replace_answers': 'Sostituisci le risposte di {name}',
  'save_availability': 'Salva la mia disponibilità',
  'saved': 'Salvato, grazie!',
  'removing': 'Rimozione…',
  'remove_my_answers': 'Rimuovi le mie risposte',
  'next_with_email': 'L’organizzatore sceglie l’orario definitivo quando tutti hanno risposto: allora te lo invieremo via email, con un invito di calendario.',
  'next_without_email': 'L’organizzatore sceglie l’orario definitivo quando tutti hanno risposto. Riapri questo link per vederlo, oppure aggiungi la tua email qui sopra e salva di nuovo per riceverlo.',

  // Errors while answering
  'err_name': 'Aggiungi il tuo nome, così gli altri sanno chi sei.',
  'err_email': 'Quell’email non sembra corretta: correggila o lascia il campo vuoto.',
  'err_email_store_why': 'La tua disponibilità è stata salvata, ma non è stato possibile memorizzare la tua email: {why}.',
  'err_email_store': 'La tua disponibilità è stata salvata, ma non è stato possibile memorizzare la tua email: prova a salvare di nuovo.',
  'err_save': 'Impossibile salvare la tua risposta.',

  // Removing answers
  'remove_confirm_host': 'Rimuovere le risposte di {name} da questo sondaggio? L’operazione non si può annullare.',
  'remove_confirm_own': 'Rimuovere le tue risposte da questo sondaggio? L’operazione non si può annullare.',
  'remove_confirm_button': 'Rimuovi',
  'err_remove_host': 'Non è stato possibile rimuovere quella risposta: ricarica la pagina e riprova.',
  'err_remove_own': 'Solo chi ha dato queste risposte può rimuoverle.',
  'err_remove': 'Impossibile rimuovere quelle risposte.',
  'err_confirm': 'Impossibile confermare l’orario.',

  // A booking page: the guest picks one time
  'pick_day': 'Scegli un giorno',
  'pick_time': 'Scegli un orario',
  'booking_intro': 'Quello che scegli viene prenotato subito: non c’è nient’altro da rimandare, e non serve un account.',
  'booking_email_note': 'Il tuo invito di calendario arriva qui. Viene usato solo per questa prenotazione.',
  'booking': 'Prenotazione…',
  'book_day': 'Prenota questo giorno',
  'book_time': 'Prenota questo orario',
  'pick_day_above': 'Scegli un giorno qui sopra',
  'pick_time_above': 'Scegli un orario qui sopra',
  'offering_days': 'Giorni che proponi',
  'offering_times': 'Orari che proponi',
  'err_book_name': 'Aggiungi il tuo nome, così l’altra persona sa chi incontrerà.',
  'err_book_email': 'Aggiungi l’indirizzo email a cui inviare il tuo invito.',
  'err_book': 'Impossibile prenotare quell’orario.',
  'cancel_not_notified': 'La prenotazione è annullata e la pagina è di nuovo aperta, ma non è stato possibile inviare un’email al tuo invitato. Avvisalo tu.',
  'err_cancel': 'Impossibile annullare quella prenotazione.',

  // A booking was made but an email bounced (host only)
  'notify_title': 'Questo orario è prenotato, ma un’email non è stata recapitata.',
  'notify_your_guest': 'il tuo invitato',
  'notify_both': 'Né tu né {who} avete ricevuto un’email. L’orario è comunque riservato, quindi conviene contattare direttamente l’altra persona per confermarlo.',
  'notify_invitee': 'Non è stato possibile inviare un’email a {who}, quindi potrebbe non sapere che l’orario è confermato. L’orario è riservato: contattare direttamente l’altra persona è la soluzione sicura.',
  'notify_host': 'A {who} è arrivata un’email con i dettagli, ma la nostra copia per te è tornata indietro. Se te l’aspettavi, controlla l’indirizzo del tuo account.',

  // Results
  'results': 'Risultati',
  'results_so_far': 'Risultati finora',
  'results_nobody': 'Nessuno ha risposto.',
  'results_responded_one': '{count} persona ha risposto.',
  'results_responded_other': '{count} persone hanno risposto.',
  'no_responses_host': 'Ancora nessuna risposta: condividi il link per iniziare.',
  'no_responses_guest': 'Ancora nessuna risposta: la tua sarà la prima.',
  'confirmed_chip': '✓ Confermato',
  'best_chip': 'Migliore',
  'tally_maybe_one': '{count} forse',
  'tally_maybe_other': '{count} forse',
  'tally_no_one': '{count} non libero',
  'tally_no_other': '{count} non liberi',
  'names_maybe': 'forse: {names}',
  'names_no': 'non liberi: {names}',
  'confirm_this_time': '✓ Conferma questo orario',
  'unconfirm': 'Annulla conferma',
  'remove_an_answer': 'Rimuovi una risposta',
  'remove_an_answer_hint': 'Per risposte inutili, doppioni, o per chi ha perso il proprio link di modifica e vuole rispondere di nuovo.',
  'remove_name_aria': 'Rimuovi le risposte di {name}',

  // The confirmed banner
  'booked_by': '✓ Prenotato da {name}',
  'booked': '✓ Prenotato',
  'confirmed_time': '✓ Orario confermato',
  'cancel_booking_named': 'Annullare questa prenotazione?\n\n{name} riceverà un’email che la annulla, e la pagina si riaprirà per permettergli di scegliere un altro orario.',
  'cancel_booking_unnamed': 'Annullare questa prenotazione?\n\nIl tuo invitato riceverà un’email che la annulla, e la pagina si riaprirà per permettergli di scegliere un altro orario.',
  'cancel_booking_confirm': 'Annulla la prenotazione',
  'keep_it': 'Mantienila',
  'working': 'Elaborazione…',
  'change': 'Cambia',
  'sending': 'Invio…',
  'resend': 'Invia di nuovo la conferma',
  'email_again': 'Scrivi di nuovo ai partecipanti',
  'email_this_time': 'Invia questo orario ai partecipanti',
  'sent_one': 'Inviato a {count} persona ✓',
  'sent_other': 'Inviato a {count} persone ✓',
  'no_one_email': 'Nessuno ha ancora lasciato un indirizzo email.',
  'guest_emailed_named': '{name} ha ricevuto l’invito via email al momento della prenotazione ✓',
  'guest_emailed': 'Il tuo invitato ha ricevuto l’invito via email al momento della prenotazione ✓',
  'respondents_emailed': 'Email inviata ai partecipanti ✓',
  'notify_hint': 'Invia la data confermata e un invito di calendario a tutti coloro che hanno lasciato un’email.',

  // The host's own calendar
  'adding': 'Aggiunta…',
  'update_in_calendar': 'Aggiornalo nel mio calendario',
  'add_to_my_provider': 'Aggiungi al mio {provider}',
  'add_to_my_calendars': 'Aggiungi ai miei calendari',
  'reconnect_to_add': 'Ricollega {provider} per aggiungerlo',
  'added_to': 'Aggiunto a {providers} ✓',
  'list_two': '{a} e {b}',
  'cal_stale': 'Il tuo calendario era collegato solo per le disponibilità: ricollegalo una volta per consentire l’aggiunta di eventi.',
  'cal_stale_hint': 'Collegato solo per le disponibilità. Basta ricollegarlo una volta per inserire l’orario direttamente nella tua agenda.',
  'cal_add_hint': 'Inserisce questo orario nel tuo calendario. Puoi fare clic due volte senza problemi: aggiorna lo stesso evento.',
  'cal_expired': 'La connessione al tuo calendario è scaduta: ricollegalo dalla schermata di creazione.',
  'cal_add_failed': 'Impossibile aggiungere questo evento al tuo calendario.',
  'cal_popups': 'Consenti i pop-up per questo sito per ricollegare il tuo calendario.',
  'cal_claim_failed': 'Impossibile completare il collegamento del tuo calendario.',
  'cal_reconnect_failed': 'Impossibile avviare il nuovo collegamento.',
  'err_send': 'Impossibile inviare le email.',

  // The timezone bar
  'tz_poll_in': 'Questo sondaggio è nel fuso {tz} {zone}.',
  'tz_show_mine': 'Mostra gli orari nel tuo fuso orario ({tz})',
  'tz_reset': 'Torna al fuso orario del sondaggio',
  'your_time': '{time} nella tua ora',
  'your_time_dated': '{date}, {time} nella tua ora',

  // Folding sections
  'show': 'Mostra ▾',
  'hide': 'Nascondi ▴',

  'brand_alt': 'Brand',
}

export default poll
