// Italian (it) — create. Every key in ../en/create.ts, translated; a key not here
// yet shows in English. GLOSSARY.md has the terms and the register.
import type { Draft } from '../en/index.ts'

const create: Draft['create'] = {
  // Masthead
  'headline_line1': 'Trova un orario che',
  'headline_line2': 'vada bene a tutti',
  'intro': 'Proponi qualche orario, condividi il link e ognuno spunta quelli in cui può esserci. Nessun account necessario, né per te né per loro.',
  'logo_alt': 'Logo di {name}',
  'logo_alt_yours': 'Il tuo logo',

  // Title and location
  'title_label': 'Titolo del sondaggio',
  'title_placeholder': 'es. Riunione del team, settimana del 9',
  'location_label': 'Luogo o link della riunione',
  'optional': '(facoltativo)',
  'location_placeholder': 'es. Sala riunioni 5, oppure un link Teams / Zoom / Meet',
  'location_hint': 'Visibile a tutti nel sondaggio e aggiunto all’invito di calendario.',

  // Times to offer
  'times_heading': 'Orari da proporre',
  'times_hint_none': 'Come vuoi aggiungerli? Digitali, trascinali su un calendario oppure proponi giornate intere.',
  'times_hint_days': 'I partecipanti spuntano le giornate intere in cui sono liberi: ideale per viaggi e programmi di più giorni.',
  'tz_line': 'Sono le {time}. Ti trovi nel fuso {zone}.',
  'tz_change': 'Cambiare fuso orario?',

  // Suggest times
  'suggest_question': 'Non sai cosa proporre?',
  'suggest_intro_one': 'Sceglieremo {count} orario in cui sei libero: nei giorni feriali, {from}–{to} {zone}, al massimo una mattina e un pomeriggio al giorno.',
  'suggest_intro_other': 'Sceglieremo {count} orari in cui sei libero: nei giorni feriali, {from}–{to} {zone}, al massimo una mattina e un pomeriggio al giorno.',
  'suggest_button_one': 'Suggerisci {count} orario',
  'suggest_button_other': 'Suggerisci {count} orari',
  'suggest_finding': 'Ricerca di tempo libero…',
  'suggest_finding_sr': 'Ricerca di tempo libero nel tuo calendario.',
  'suggest_none_one': 'Nessun momento libero tra le {from} e le {to} in un giorno feriale nel prossimo {count} giorno: aggiungi gli orari a mano, oppure libera un po’ di spazio e riprova.',
  'suggest_none_other': 'Nessun momento libero tra le {from} e le {to} in un giorno feriale nei prossimi {count} giorni: aggiungi gli orari a mano, oppure libera un po’ di spazio e riprova.',
  'suggest_some': 'Aggiunti {found} su {total}: non c’era altro tempo libero. Trascinane uno per spostarlo, fai clic per rimuoverlo.',
  'suggest_added_one': 'Aggiunto {count} orario dal tuo tempo libero. Trascinalo per spostarlo, fai clic per rimuoverlo.',
  'suggest_added_other': 'Aggiunti {count} orari dal tuo tempo libero. Trascinane uno per spostarlo, fai clic per rimuoverlo.',

  // Connect-a-calendar prompt beside the calendar view
  'cal_busy_lead': 'Scopri quando sei già occupato',
  'cal_prompt_connect': '{lead}: collega un calendario e i tuoi orari occupati ombreggiano la griglia. Li vedi solo tu.',
  'cal_other_lead': 'Impegnato anche altrove?',
  'cal_prompt_other': '{lead} Collega l’altro calendario e ombreggerà anche lui la griglia.',
  'cal_prompt_guest': '{lead}: verifica la tua email (la stessa con cui salvi il sondaggio), poi collega il calendario. L’ombreggiatura la vedi solo tu.',
  'connect_google': 'Collega Google Calendar',
  'connect_outlook': 'Collega Outlook',
  'dont_show_again': 'Non mostrare più',
  'cal_later_web': 'Puoi comunque collegarne uno in qualsiasi momento dal menu del profilo (in alto a destra) → Regola questa app → Opzioni di questo sondaggio.',
  'cal_later_phone': 'Puoi comunque collegarne uno in qualsiasi momento da Regola (in alto a destra) → Opzioni di questo sondaggio.',
  'verify': 'Verifica',
  'verifying': 'Verifica…',
  'different_email': 'Un’altra email',
  'code_sent': 'Abbiamo inviato un codice di 6 cifre a {email}.',
  'sending': 'Invio…',
  'email_me_code': 'Inviami un codice',

  // Calendar errors
  'err_email_first': 'Prima inserisci un indirizzo email valido.',
  'err_code': 'Inserisci il codice che hai ricevuto via email.',
  'cal_read_failed_google': 'Impossibile leggere il tuo calendario Google: la connessione funziona, ma la ricerca delle disponibilità non è riuscita. Riprova tra poco, oppure scollegalo e ricollegalo.',
  'cal_read_failed_outlook': 'Impossibile leggere il tuo calendario Outlook: la connessione funziona, ma la ricerca delle disponibilità non è riuscita. Riprova tra poco, oppure scollegalo e ricollegalo.',
  'cal_read_failed_both': 'Impossibile leggere i tuoi calendari Google e Outlook: la connessione funziona, ma la ricerca delle disponibilità non è riuscita. Riprova tra poco, oppure scollegali e ricollegali.',
  'cal_expired': 'Una connessione al calendario è scaduta: collegalo di nuovo.',
  'cal_expired_suggest': 'Una connessione al calendario è scaduta: collegalo di nuovo, poi chiedi di suggerire gli orari.',
  'cal_read_failed_suggest': 'Al momento non è stato possibile leggere il tuo calendario, quindi non è stato suggerito nulla: riprova tra poco.',
  'cal_cancelled': 'La connessione al calendario è stata annullata o non è riuscita.',
  'popup_blocked': 'Il browser ha bloccato il pop-up: consenti i pop-up per questo sito e riprova.',

  // Logo errors
  'logo_type': 'Il logo deve essere un’immagine PNG, JPG o WebP.',
  'logo_size': 'Il logo non deve superare i 10 MB.',

  // Checks before creating
  'err_title': 'Dai un titolo al sondaggio.',
  'err_add_day': 'Aggiungi almeno un giorno.',
  'err_add_time': 'Aggiungi almeno una data e un orario.',
  'err_email': 'Inserisci un indirizzo email valido.',
  'err_booking_email': 'Una pagina di prenotazione ti invia un’email per ogni prenotazione, quindi serve il tuo indirizzo email.',
  'err_alerts_email': 'Aggiungi il tuo indirizzo email per ricevere gli avvisi di risposta, oppure disattiva gli avvisi in Opzioni di questo sondaggio.',
  'err_backend': 'Per creare sondaggi, Polling ha bisogno del suo backend Supabase configurato.',
  'err_free_limit': 'Hai raggiunto il limite di sondaggi attivi gratuiti. Elimina un sondaggio o aspetta che uno finisca per fare spazio.',
  'err_free_limit_held': 'Hai raggiunto il limite di sondaggi attivi gratuiti (occupato da {what}). Elimina un sondaggio o aspetta che uno finisca per fare spazio.',
  'err_generic': 'Qualcosa è andato storto. Riprova.',

  // Summary of this poll's options, above the Create button
  'booking_chip': 'Pagina di prenotazione',
  'link_valid': 'Link valido per {period}',
  'link_valid_while': 'Link valido per un po’',
  'alerts_on': 'avvisi di risposta attivi',
  'alerts_off': 'nessun avviso di risposta',
  'change_these_web': '— modificale nel menu del profilo (in alto a destra) → Regola questa app → Opzioni di questo sondaggio.',
  'change_these_phone': '— modificale in Regola (in alto a destra) → Opzioni di questo sondaggio.',

  // Changing the times on a live poll
  'editing_title': 'Stai modificando gli orari del tuo sondaggio attivo.',
  'editing_body': 'Finché non salvi, chi apre il link viene avvisato che stai modificando gli orari e invitato a riprovare tra poco. Nessuno ha ancora risposto, quindi non si perde nulla. Il tuo branding resta com’era.',
  'editing_cancel': 'Annulla, lascialo com’era',

  // Free allowance
  'need_more': 'Te ne servono di più? Scrivici',
  'purchased_tokens_one': '{count} token acquistato',
  'purchased_tokens_other': '{count} token acquistati',

  // Who is creating
  'creating_as': 'Stai creando come {name}: nessuna verifica email necessaria.',
  'creating_as_org': 'Stai creando come {name}{email}: nessuna verifica email necessaria.',
  'signed_in_as': 'Accesso effettuato come {email} (verificato).',
  'not_you': 'Non sei tu? Esci',
  'your_email': 'La tua email',
  'email_hint_booking': 'Necessaria per una pagina di prenotazione: è dove ti invieremo ogni prenotazione. Ti manderemo un codice veloce per confermare che sei tu.',
  'email_hint_alerts': 'Dove ti invieremo gli avvisi di risposta. Ti manderemo un codice veloce per confermare che sei tu.',
  'email_hint_optional': 'Solo se vuoi gli avvisi di risposta o ritrovare i tuoi sondaggi da un altro dispositivo: ti manderemo un codice veloce per confermarla. Se la lasci vuota, riceverai invece un link di amministrazione privato per gestire il sondaggio.',
  'email_note_alerts': 'Ti manderemo un codice veloce per confermare che sei tu: è così che gestirai questo sondaggio in seguito, ed è lì che ti invieremo gli avvisi di risposta.',
  'email_note_web': 'Ti manderemo un codice veloce per confermare che sei tu: è così che gestirai questo sondaggio in seguito. Vuoi un’email ogni volta che un invitato risponde? Attivala nel menu del profilo (in alto a destra) → Regola questa app → Opzioni di questo sondaggio.',
  'email_note_phone': 'Ti manderemo un codice veloce per confermare che sei tu: è così che gestirai questo sondaggio in seguito. Vuoi un’email ogni volta che un invitato risponde? Attivala in Regola (in alto a destra) → Opzioni di questo sondaggio.',
  'code_label': 'Inserisci il codice di 6 cifre che abbiamo inviato a {email}',
  'code_note_alerts': 'Confermando crei il sondaggio e attivi gli avvisi di risposta a questo indirizzo.',
  'code_note': 'Confermando crei il sondaggio e potrai gestirlo in seguito da questo indirizzo.',
  'use_different_email': 'Usa un’altra email',

  // The main button
  'btn_sending': 'Invio del codice…',
  'btn_saving': 'Salvataggio delle modifiche…',
  'btn_creating': 'Creazione del sondaggio…',
  'btn_verify_create': 'Verifica e crea il sondaggio',
  'btn_save': 'Salva le modifiche',
  'btn_create': 'Crea il sondaggio',

  // Branding card
  'branding': 'Branding',
  'branding_imported': 'Importato dal tuo account: se vuoi, puoi cambiarlo per questo sondaggio.',
  'branding_guest': 'Aggiungi il tuo colore e il tuo logo alle pagine di creazione e condivisione del sondaggio.',
  'sign_in_branding': 'Accedi per importare il tuo branding →',
  'account_logo': 'Logo dell’account',
  'your_account': 'Il tuo account',
  'account_colour': 'Colore dell’account',
  'default_colour': 'Colore predefinito',
  'customise': 'Personalizza per questo sondaggio',
  'booking_colour': 'Colore della pagina di prenotazione',
  'colour_orange': 'Arancione',
  'colour_blue': 'Blu',
  'colour_pink': 'Rosa',
  'colour_green': 'Verde',
  'custom_colour': 'Colore personalizzato',
  'brand_name': 'Nome del brand',
  'brand_placeholder': 'es. Acme Avventure',
  'logo': 'Logo',
  'logo_preview': 'Anteprima del logo',
  'logo_change': 'Cambia…',
  'logo_upload': 'Carica…',
  'logo_hint': 'PNG, JPG o WebP · le immagini grandi vengono ridimensionate automaticamente.',
  'use_account_branding': 'Usa invece il branding del mio account',

  // "Your poll is live" panel
  'live_booking': 'La tua pagina di prenotazione è attiva',
  'live_poll': 'Il tuo sondaggio è attivo',
  'live_booking_body': 'Manda questo link all’unica persona che vuoi incontrare. Il primo orario che sceglie viene prenotato, e riceverete entrambi un invito di calendario.',
  'live_poll_body': 'Condividi questo link con tutte le persone che vuoi invitare.',
  'copied': 'Copiato!',
  'open_poll': 'Apri il sondaggio →',
  'change_times': '← Modifica gli orari',
  'change_times_hint': 'Puoi tornare indietro e modificarli finché qualcuno non risponde.',
}

export default create
