import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'Come funziona un sondaggio sulle date',
    summary: 'Proponi qualche opzione, condividi un solo link e lascia emergere l’orario migliore.',
    group: 'Le basi',
    body: `Trovare via email una data che vada bene a un gruppo finisce spesso in una lunga catena di «Martedì posso, ma non di mattina». Un sondaggio sulle date sostituisce quella catena con un’unica pagina che tutti possono compilare.

## L’idea

1. Chi organizza propone alcune date o alcuni orari possibili.
2. Condivide un solo link con tutte le persone coinvolte.
3. Ognuno apre il link, scrive il proprio nome e per ogni opzione indica **libero**, **se necessario** o **non libero**.
4. I risultati sommano le risposte di ogni opzione, così gli orari che vanno bene a più persone risaltano.
5. Chi organizza conferma l’orario scelto, e chiunque apra il link lo vede.

Nessuno ha bisogno di un account per rispondere. Solo chi organizza deve accedere o confermare il proprio indirizzo email, quindi non si possono creare sondaggi in modo anonimo.

## Due tipi di sondaggio

- I sondaggi **a orari** sono per riunioni e chiamate: ogni opzione ha un orario di inizio e una durata.
- I sondaggi **a giornate** sono per viaggi, eventi e tutto ciò per cui conta solo la data.

## Consigli per un buon sondaggio

- Offri abbastanza opzioni da lasciare una vera scelta, ma non così tante da rendere noioso rispondere. Da quattro a otto di solito funziona bene.
- Usa «se necessario» con sincerità. Dice a chi organizza che un orario è possibile ma non ideale, e lo aiuta a decidere in caso di parità.
- Dai al sondaggio un titolo chiaro. È la prima cosa che si vede aprendo il link.
- Se coinvolgi persone in paesi diversi, controlla il fuso orario prima di condividere (vedi «I fusi orari spiegati»).
- Quando confermi un orario, il modulo di risposta si chiude, così nessuno resta a chiedersi se deve continuare a votare.`,
  },
  {
    id: 'time-zones-explained',
    title: 'I fusi orari spiegati',
    summary: 'Perché le 15:00 non sono lo stesso momento ovunque, e come l’app tiene tutti allineati.',
    group: 'Le basi',
    body: `Un orario da solo, come «martedì alle 15:00», ha senso solo se sai dove sono le 15:00. I fusi orari sono il modo in cui il mondo si accorda su questo.

## Scostamenti e nomi

Ogni fuso orario è avanti o indietro di un certo numero di ore rispetto a un orario di riferimento comune chiamato UTC (tempo coordinato universale). Londra d’inverno è a UTC+0, Roma a UTC+1 e New York a UTC−5. Quindi le 15:00 a Londra sono le 16:00 a Roma e le 10:00 a New York.

Lo scostamento da solo non basta, perché molti luoghi spostano le lancette per l’ora legale, e non tutti nello stesso giorno. Per questo i computer usano fusi con un nome, come Europe/Rome o America/New_York. Un fuso con nome contiene tutta la storia dei cambi d’ora di quel luogo, quindi dà lo scostamento giusto per qualsiasi data.

## Come se ne occupa questa app

- Ogni sondaggio ha un solo fuso orario. All’inizio è quello di chi organizza, che può sceglierne un altro.
- Le opzioni sono scritte nell’ora locale di quel fuso. «10:00 del 3 marzo, Europe/Rome» indica sempre lo stesso momento, anche se nel frattempo inizia l’ora legale.
- La pagina del sondaggio indica in che fuso si trova. Se il tuo dispositivo è in un altro fuso, un pulsante ti permette di vedere tutti gli orari nel tuo; puoi anche scegliere qualsiasi altro fuso o tornare a quello del sondaggio.
- Cambiare il fuso in cui visualizzi gli orari cambia solo come vengono mostrati. I momenti restano gli stessi, quindi tutti rispondono sugli stessi istanti.
- Le opzioni a giornata intera sono solo date, quindi non vengono convertite.
- Quando aggiungi un orario al tuo calendario, l’evento viene fissato nel momento esatto concordato, così il calendario lo mostra nella tua ora locale.

## Una trappola comune

Se crei un sondaggio mentre sei in viaggio, il tuo dispositivo potrebbe essere impostato sul fuso del luogo in cui ti trovi. Controlla il fuso del sondaggio prima di condividerlo, così «le 9:00» saranno le 9:00 nel luogo in cui si tiene davvero la riunione.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Organizzare un sondaggio, dalla bozza all’orario confermato',
    summary: 'Creare, modificare, confermare e ritrovare i tuoi sondaggi.',
    group: 'Come funziona',
    body: `## Creare un sondaggio

1. Dai un titolo al sondaggio e scegli tra orari e giornate intere.
2. Aggiungi le opzioni. Se hai collegato un calendario, gli orari in cui sei già occupato sono ombreggiati, e **Suggest times** può riempire il sondaggio con quattro opzioni prese dal tuo tempo libero: solo nei giorni feriali, tra le 10:00 e le 16:00 nel fuso del sondaggio, e al massimo una al mattino e una al pomeriggio nello stesso giorno.
3. Conferma il tuo indirizzo email con un codice monouso, oppure accedi con il tuo Universal ID.
4. Condividi il link.

## Cambiare idea

Subito dopo aver creato un sondaggio puoi tornare a modificare gli orari, finché nessuno ha risposto. Mentre modifichi, chi apre il link viene invitato a riprovare tra poco, e le risposte vengono rifiutate finché non salvi. Se lasci una modifica aperta per dieci minuti senza salvare, scade da sola e il sondaggio si riapre.

## Confermare un orario

Quando le risposte sono arrivate, scegli l’opzione vincente con **Confirm this time**. Solo chi organizza può farlo. Chiunque apra il link vede allora un banner «Confirmed» con l’orario scelto. Puoi cambiare o annullare la scelta in seguito.

Dal banner puoi:

- Inviare via email l’orario confermato, con un invito di calendario allegato, a tutti coloro che hanno lasciato un indirizzo. Succede solo quando fai clic, mai in automatico.
- Usare **Copy email** per inviare il messaggio dalla tua casella di posta, con destinatari, oggetto e testo pronti da copiare.
- Aggiungere l’orario al tuo calendario.

## Aggiungere a un calendario

Ogni risultato, e anche il banner di conferma, ha un pulsante **Add to calendar** con Google Calendar, Outlook o un file di calendario per app come Calendario di Apple. L’evento viene preparato sul tuo dispositivo.

## Ritrovare i tuoi sondaggi

Quando hai effettuato l’accesso come organizzatore, la pagina di creazione elenca i tuoi sondaggi attivi, con quante persone hanno risposto, l’orario confermato se c’è e quando scade ogni link. Puoi copiare un link, eliminare un sondaggio o eliminare in un colpo solo tutti i sondaggi scaduti.`,
  },
  {
    id: 'poll-options',
    title: 'Pagine di prenotazione, scadenza, avvisi e calendari',
    summary: 'A cosa serve ciascuna delle opzioni di «This poll’s options».',
    group: 'Come funziona',
    body: `Le opzioni del sondaggio che stai creando si trovano nel menu **Actions**, sotto **This poll's options**. Valgono solo per quel sondaggio.

## Pagina di prenotazione («Just the two of us»)

Per un incontro a due. Invece di raccogliere le disponibilità di tutti, la persona a cui mandi il link sceglie uno dei tuoi orari, inserisce nome e indirizzo email, e l’appuntamento viene prenotato subito. Non devi confermare nulla, e ricevete entrambi un invito di calendario via email. Se hai collegato un calendario che lo consente, l’invito può partire dal tuo calendario. Puoi annullare una prenotazione in seguito, e l’altra persona viene avvisata.

## Validità del link

Il link di un sondaggio funziona per 7, 30, 90 o 180 giorni. Di proposito non c’è l’opzione «non scade mai», perché questi link vengono condivisi liberamente. Quando il link scade, il sondaggio diventa di sola lettura: si può ancora vedere, ma non si accettano nuove risposte.

## Avvisi di risposta

Spunta questa opzione per ricevere un’email ogni volta che una nuova persona risponde. Chi modifica una risposta già data non fa partire un’altra email. Gli avvisi non sono disponibili per una pagina di prenotazione, perché ogni prenotazione ti manda comunque un’email.

## Il tuo calendario

Puoi collegare un calendario Google o Microsoft. L’app lo usa per ombreggiare gli orari in cui sei già occupato mentre prepari un sondaggio, e per suggerire orari liberi. A seconda del fornitore e dell’autorizzazione concessa, può anche mostrare i titoli degli eventi e aggiungere un orario confermato al tuo calendario. Puoi scollegarlo in qualsiasi momento, e così la connessione salvata viene eliminata.

## Fuso orario

Ogni sondaggio ha un solo fuso orario. All’inizio è il tuo, e puoi sceglierne un altro. Vedi «I fusi orari spiegati».

## E inoltre

Puoi aggiungere un luogo, come un link per la videochiamata o una sala, e scegliere un colore per la pagina del sondaggio. Se hai effettuato l’accesso con un’organizzazione, il suo logo può comparire sulla pagina, oppure puoi aggiungere il tuo.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Chi può vedere il tuo sondaggio e le tue risposte',
    summary: 'Cosa vede chiunque abbia il link, cosa vede solo chi organizza e cosa resta privato.',
    group: 'Privacy e sicurezza',
    body: `Un sondaggio sulle date è fatto per essere condiviso tramite link, quindi è utile sapere esattamente cosa mostra quel link.

## Chiunque abbia il link può vedere

- Il titolo, le opzioni, il fuso orario e il luogo del sondaggio, oltre all’eventuale colore o logo.
- Il nome di ogni partecipante, e se per ciascuna opzione ha indicato libero, se necessario o non libero.
- L’orario confermato, una volta scelto da chi organizza.

I link dei sondaggi sono composti da dieci caratteri casuali, il che li rende molto difficili da indovinare. Ma chiunque riceva il link inoltrato da te può vedere tutto quanto sopra, quindi pensa a chi lo mandi.

## Solo chi organizza può vedere

- Gli indirizzi email che i partecipanti hanno scelto di lasciare. Servono per inviare l’orario confermato e per compilare gli inviti di calendario, e non vengono mai mostrati agli altri partecipanti.

## Nessun altro vede

- L’indirizzo email di chi organizza. Viene conservato per inviargli gli avvisi e le email di prenotazione, e non compare sulla pagina del sondaggio.

## Il tuo nome è la tua chiave

Le risposte vengono salvate con il nome che scrivi. Se rispondi di nuovo con esattamente lo stesso nome, la risposta precedente viene aggiornata invece di essere aggiunta una seconda volta. Significa anche che un’altra persona con esattamente lo stesso nome sovrascriverebbe la tua, quindi usa qualcosa di riconoscibile, come nome e cognome.

Per risparmiarti di riscriverli, questo dispositivo ricorda il nome e l’indirizzo email usati l’ultima volta che hai risposto. Restano su questo dispositivo.

## Lasciare un’email è facoltativo

Puoi rispondere senza indicare un indirizzo email. Se ne lasci uno, chi organizza potrà inviarti l’orario confermato. Lascia il campo vuoto se non vuoi; rispondere di nuovo con il campo vuoto rimuove l’indirizzo dato in precedenza.`,
  },
  {
    id: 'what-is-stored',
    title: 'Cosa viene conservato, e per quanto tempo',
    summary: 'Dove stanno i dati dei sondaggi, cosa fa la scadenza e cosa viene inviato a chi.',
    group: 'Privacy e sicurezza',
    body: `## Sui nostri server

Un sondaggio deve stare in un posto raggiungibile da tutti, quindi sondaggi e risposte sono conservati sui nostri server. Questo comprende:

- Il sondaggio stesso: titolo, opzioni, fuso orario, impostazioni e indirizzo email di chi organizza.
- Ogni risposta: il nome indicato, le scelte fatte e quando è stata salvata.
- Gli indirizzi email che i partecipanti hanno scelto di lasciare, e il nome e l’indirizzo email di chi prenota su una pagina di prenotazione.
- Un logo caricato da chi organizza. I loghi sono conservati dove chiunque abbia il link del sondaggio può caricarli, perché la pagina deve poterli mostrare.
- Se chi organizza ha collegato un calendario, le chiavi di accesso di quella connessione. Restano solo sul server, non vengono mai inviate all’app e servono solo a fare ciò che chi organizza ha chiesto. Scollegando il calendario vengono eliminate.

Tutto viaggia su connessioni crittografate ed è protetto da regole di accesso. Non è crittografato end-to-end, quindi i nostri sistemi possono tecnicamente leggerlo.

## Per quanto tempo

Quando il link di un sondaggio scade, il sondaggio smette di accettare risposte e diventa di sola lettura. Non viene eliminato in quel momento: resta finché chi organizza non lo elimina, e l’elenco dei sondaggi permette di eliminare in un solo passaggio tutti quelli scaduti.

Eliminando un sondaggio si eliminano anche le sue risposte, gli indirizzi email dei partecipanti e i dati di calendario collegati. Annullando una prenotazione si elimina l’indirizzo email dell’altra persona, dopo che l’app ha provato ad avvisarla.

## Email

L’app invia email solo in questi casi:

- Un codice monouso, quando chi organizza conferma il proprio indirizzo email.
- Un avviso di risposta a chi organizza, se ha attivato gli avvisi.
- L’orario confermato ai partecipanti che hanno lasciato un indirizzo, solo quando chi organizza fa clic per inviarlo.
- Le conferme e gli annullamenti delle prenotazioni, su una pagina di prenotazione.

Le email vengono inviate per nostro conto tramite un servizio di invio email.

## Sul tuo dispositivo

Questo dispositivo ricorda il nome e l’indirizzo email della tua ultima risposta, le impostazioni di visualizzazione e, se organizzi, il tuo accesso. Gli eventi che aggiungi con **Add to calendar** vengono preparati sul tuo dispositivo. Scegliendo Google o Outlook si apre quel servizio con i dettagli dell’evento già compilati.

## Il tuo Universal ID

Chi organizza può accedere con un Universal ID, l’unico account condiviso tra le app UNI·SIM, oppure semplicemente confermare un indirizzo email con un codice monouso. Rispondere a un sondaggio non richiede mai un account.`,
  },
]

export default articles
