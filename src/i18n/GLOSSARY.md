# Universal Date Polling — translation glossary

Every translator of this app uses these terms, in the app (`src/i18n/<lang>/`)
and in the knowledge base (`src/knowledge/<lang>.ts`), so both say the same
thing. English (en-GB) is the source. If a term is missing, add it here first,
then use it.

## Translating the app (the workflow)

- One folder per language, `src/i18n/<lang>/`, with the same files as `en/` —
  one per namespace. A translator edits only their own language's folder.
- Each file is typed `Draft['<namespace>']`: any subset of the English keys. A
  key left out shows in English, so the app builds while a language is part
  done; a misspelt or stale key is a `tsc` error.
- Keep every `{placeholder}` exactly (the test checks), keep each plural's
  forms (`_one`/`_other`; add `_many` only where `Intl.PluralRules` picks it —
  French, Spanish, Italian and Portuguese do for round millions; `_other`
  covers it if left out), and read the English comment for where it shows and
  any length limit.
- `npm test` checks placeholders, extra keys and empty strings in every
  language. `npm run i18n:check` (or `-- de fr`) also fails on any missing key:
  the gate before a release.
- See a screen's keys at a glance: `npm run dev`, then open the app with
  `?pseudo` (`?app&pseudo` for the phone screens) — every translated string
  shows in ⟦brackets⟧, so anything without them is still hard-coded.
- Dates and times come from Intl in the language's own format (`lib/time.ts`,
  `t.locale`): never write a date or time format into a string.

## Never translated

UNI·SIM, UNISIM.co.uk, Universal ID, Universal Date Polling, Date Polling (the
app's short name), Universal Apps, Google, Google Calendar, Outlook, Microsoft,
Microsoft 365, Apple, iPhone, iPad, Android, GitHub, `.ics`, email addresses
and URLs. Poll titles, names and locations are the user's own text.

## Core terms

| English | fr | es | it | de | pt-BR | pt-PT | tr |
|---|---|---|---|---|---|---|---|
| poll | sondage | encuesta | sondaggio | Umfrage | enquete | sondagem | anket |
| date poll | sondage de dates | encuesta de fechas | sondaggio sulle date | Terminumfrage | enquete de datas | sondagem de datas | tarih anketi |
| host (who made the poll) | organisateur | organizador | organizzatore | Gastgeber (person: einladende Person) | organizador | organizador | düzenleyen |
| respondent | participant | participante | partecipante | Teilnehmer | participante | participante | katılımcı |
| option (a proposed day or time) | option | opción | opzione | Option | opção | opção | seçenek |
| slot / time slot | créneau | franja / horario | fascia oraria | Zeitfenster | horário | horário | zaman aralığı |
| Times (poll of times) | Horaires | Horas | Orari | Uhrzeiten | Horários | Horas | Saatli |
| Whole days | Journées entières | Días completos | Giornate intere | Ganze Tage | Dias inteiros | Dias inteiros | Tam gün |
| availability | disponibilités | disponibilidad | disponibilità | Verfügbarkeit | disponibilidade | disponibilidade | uygunluk |
| free / if need be / not free (the answers) | disponible / disponible si nécessaire / indisponible | disponible / si es necesario / no disponible | libero / se necessario / non libero | frei / notfalls / nicht frei | livre / se precisar / não livre | disponível / se for preciso / indisponível | uygun / gerekirse / uygun değil |
| Yes / If need be / No (answer buttons) | Oui / Si nécessaire / Non | Sí / Si es necesario / No | Sì / Se necessario / No | Ja / Notfalls / Nein | Sim / Se precisar / Não | Sim / Se for preciso / Não | Evet / Gerekirse / Hayır |
| response / answers | réponse / réponses | respuesta / respuestas | risposta / risposte | Antwort / Antworten | resposta / respostas | resposta / respostas | yanıt / yanıtlar |
| results | résultats | resultados | risultati | Ergebnisse | resultados | resultados | sonuçlar |
| confirm (the time) | confirmer | confirmar | confermare | bestätigen | confirmar | confirmar | onayla |
| confirmed time | horaire confirmé | hora confirmada | orario confermato | bestätigter Termin | horário confirmado | horário confirmado | onaylanan zaman |
| booking page (1:1) | page de réservation | página de reservas | pagina di prenotazione | Buchungsseite | página de agendamento | página de marcação | randevu sayfası |
| book / booked | réserver / réservé | reservar / reservado | prenotare / prenotato | buchen / gebucht | agendar / agendado | marcar / marcado | randevu al / alındı |
| admin link (host's private link) | lien d’administration | enlace de administración | link di amministrazione | Verwaltungslink | link de administração | ligação de administração | yönetici bağlantısı |
| edit link (a respondent's) | lien de modification | enlace de edición | link di modifica | Bearbeitungslink | link de edição | ligação de edição | düzenleme bağlantısı |
| link (share link) | lien | enlace | link | Link | link | ligação | bağlantı |
| share | partager | compartir | condividere | teilen | compartilhar | partilhar | paylaş |
| time zone | fuseau horaire | zona horaria | fuso orario | Zeitzone | fuso horário | fuso horário | saat dilimi |
| your time (viewer-local) | votre heure | tu hora | tua ora | deine Zeit | seu horário | a sua hora | sizin saatiniz |
| calendar (connect your calendar) | agenda | calendario | calendario | Kalender | agenda | calendário | takvim |
| busy (calendar) | occupé | ocupado | occupato | belegt | ocupado | ocupado | dolu |
| Add to calendar | Ajouter à l’agenda | Añadir al calendario | Aggiungi al calendario | Zum Kalender hinzufügen | Adicionar à agenda | Adicionar ao calendário | Takvime ekle |
| Suggest times | Suggérer des horaires | Sugerir horas | Suggerisci orari | Zeiten vorschlagen | Sugerir horários | Sugerir horas | Zaman öner |
| link expiry / expires | expiration du lien / expire | caducidad del enlace / caduca | scadenza del link / scade | Ablauf des Links / läuft ab | validade do link / expira | validade da ligação / expira | bağlantının süresi / sona erer |
| response alerts | alertes de réponse | avisos de respuesta | avvisi di risposta | Antwort-Benachrichtigungen | alertas de resposta | alertas de resposta | yanıt bildirimleri |
| Your polls | Vos sondages | Tus encuestas | I tuoi sondaggi | Deine Umfragen | Suas enquetes | As suas sondagens | Anketleriniz |
| This poll's options | Options de ce sondage | Opciones de esta encuesta | Opzioni di questo sondaggio | Optionen dieser Umfrage | Opções desta enquete | Opções desta sondagem | Bu anketin seçenekleri |
| branding (logo + name) | image de marque | marca | branding | Branding | marca | marca | marka |
| verification code | code de vérification | código de verificación | codice di verifica | Bestätigungscode | código de verificação | código de verificação | doğrulama kodu |
| email (address) | adresse e-mail / e-mail | correo electrónico | email | E-Mail-Adresse / E-Mail | e-mail | e-mail | e-posta |
| sign in / sign out | se connecter / se déconnecter | iniciar sesión / cerrar sesión | accedi / esci | anmelden / abmelden | entrar / sair | iniciar sessão / terminar sessão | giriş yap / çıkış yap |
| company (suite org) | entreprise | empresa | azienda | Unternehmen | empresa | empresa | şirket |
| free polls (allowance) | sondages gratuits | encuestas gratuitas | sondaggi gratuiti | kostenlose Umfragen | enquetes gratuitas | sondagens gratuitas | ücretsiz anketler |

## The suite's menu words (use the SDK's wording exactly)

| English | fr | es | it | de | pt-BR | pt-PT | tr |
|---|---|---|---|---|---|---|---|
| Tune this app | Régler cette application | Ajustar esta app | Regola questa app | Diese App anpassen | Ajustar este app | Ajustar esta aplicação | Bu uygulamayı ayarla |
| Tune (the phone app's button) | Régler | Ajustar | Regola | Anpassen | Ajustar | Ajustar | Ayarla |
| Fine-tune (one entry) | Peaufiner | Afinar | Perfeziona | Feinjustieren | Afinar | Afinar | İnce ayar |
| Knowledge base | Base de connaissances | Base de conocimientos | Knowledge base | Wissensdatenbank | Base de conhecimento | Base de conhecimento | Bilgi bankası |
| About this app | À propos de cette application | Acerca de esta aplicación | Informazioni su questa app | Über diese App | Sobre este aplicativo | Sobre esta aplicação | Bu uygulama hakkında |
| Reset to defaults | Rétablir les réglages par défaut | Restablecer valores predeterminados | Ripristina impostazioni predefinite | Auf Standard zurücksetzen | Restaurar padrões | Repor predefinições | Varsayılanlara sıfırla |

## Register

The app's UI uses the suite's UI register: **vous** in French, **tú** in
Spanish, **tu** in Italian, **du** (lower case) in German, **você** (usually
implied) in pt-BR, the infinitive/impersonal in pt-PT (avoid *tu* and *você*),
and Turkish neutral polite (*-in/-ın* imperatives; buttons the bare verb stem).

The knowledge base was written formally in German (*Sie*) and Spanish
(*usted*). Keep each knowledge-base file in its own register; the UI labels it
quotes in bold match the app's labels word for word.

## Style

- Sentence case for labels and headings (German nouns keep their capital).
- Per-language punctuation: French « … » and a non-breaking space before
  : ; ? !, German „…“, Spanish/Italian/pt-PT «…», pt-BR and Turkish “…”.
- Counts are plurals (`t.plural`), with `{count}` in every form, including
  `_one` — French and Portuguese pick "one" for 0 too.
- Emails and the pasted list (`lib`) are read by people who never saw the app:
  write them as a person would write the email, in the UI register.
- Turkish suffixes on a `{placeholder}` that holds a name: prefer a
  construction that needs no suffix.
