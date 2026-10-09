import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'how-date-polls-work',
    title: 'So funktioniert eine Terminumfrage',
    summary: 'Ein paar Termine vorschlagen, einen einzigen Link teilen und den besten Termin sehen.',
    group: 'Grundlagen',
    body: `Einen Termin per E-Mail zu finden, der einer ganzen Gruppe passt, endet oft in einer langen Kette aus „Dienstag geht, aber nicht vormittags“. Eine Terminumfrage ersetzt diese Kette durch eine einzige Seite, die alle ausfüllen können.

## Das Prinzip

1. Wer einlädt, schlägt einige mögliche Tage oder Uhrzeiten vor.
2. Ein einziger Link wird mit allen geteilt, die dabei sein sollen.
3. Alle öffnen den Link, geben ihren Namen ein und markieren jede Option als **frei**, **notfalls** oder **nicht frei**.
4. Die Ergebnisse zählen die Antworten für jede Option zusammen, sodass die Termine hervortreten, die den meisten passen.
5. Wer einlädt, bestätigt den besten Termin, und alle, die den Link öffnen, sehen ihn.

Zum Antworten braucht niemand ein Konto. Nur die einladende Person muss sich anmelden oder ihre E-Mail-Adresse bestätigen, daher lassen sich Umfragen nicht anonym erstellen.

## Zwei Arten von Umfragen

- Umfragen **mit Uhrzeiten** sind für Besprechungen und Anrufe: Jede Option hat eine Startzeit und eine Dauer.
- Umfragen **mit ganzen Tagen** sind für Reisen, Veranstaltungen und alles, bei dem nur das Datum zählt.

## Tipps für eine gute Umfrage

- Bieten Sie genug Optionen für eine echte Auswahl an, aber nicht so viele, dass das Antworten mühsam wird. Vier bis acht funktionieren meist gut.
- Nutzen Sie „notfalls“ ehrlich. Es zeigt der einladenden Person, dass ein Termin möglich, aber nicht ideal ist, und hilft bei einem Gleichstand.
- Geben Sie der Umfrage einen klaren Titel. Er ist das Erste, was man beim Öffnen des Links sieht.
- Wenn Sie Menschen in verschiedenen Ländern fragen, prüfen Sie vor dem Teilen die Zeitzone (siehe „Zeitzonen erklärt“).
- Sobald Sie einen Termin bestätigen, klappt das Antwortformular zu, damit niemand rätselt, ob noch abgestimmt werden soll.`,
  },
  {
    id: 'time-zones-explained',
    title: 'Zeitzonen erklärt',
    summary: 'Warum 15 Uhr nicht überall derselbe Moment ist, und wie die App den Überblick behält.',
    group: 'Grundlagen',
    body: `Eine Uhrzeit allein, etwa „Dienstag um 15 Uhr“, ergibt erst Sinn, wenn man weiß, wo es 15 Uhr ist. Zeitzonen sind die Art, wie sich die Welt darauf einigt.

## Abstände und Namen

Jede Zeitzone liegt eine bestimmte Anzahl Stunden vor oder hinter einer gemeinsamen Bezugszeit namens UTC (koordinierte Weltzeit). London liegt im Winter bei UTC+0, Berlin bei UTC+1 und New York bei UTC−5. 15 Uhr in London ist also 16 Uhr in Berlin und 10 Uhr in New York.

Der Abstand allein reicht nicht, weil viele Orte die Uhren auf Sommerzeit umstellen, und zwar nicht alle am selben Tag. Deshalb verwenden Computer benannte Zonen wie Europe/Berlin oder America/New_York. Eine benannte Zone kennt die gesamte Geschichte der Zeitumstellungen dieses Ortes und liefert so für jedes Datum den richtigen Abstand.

## Wie diese App damit umgeht

- Jede Umfrage hat genau eine Zeitzone. Anfangs ist es die der einladenden Person, die sie aber in jede andere ändern kann.
- Die Optionen werden in der Ortszeit dieser Zone angegeben. „10:00 am 3. März, Europe/Berlin“ bezeichnet immer denselben Moment, auch wenn bis dahin die Sommerzeit beginnt.
- Die Umfrageseite zeigt, in welcher Zone die Umfrage liegt. Ist Ihr Gerät in einer anderen Zone, können Sie per Schaltfläche alle Zeiten in Ihrer eigenen Zone anzeigen, eine beliebige andere Zone wählen oder zur Zone der Umfrage zurückkehren.
- Die Anzeigezone zu wechseln ändert nur die Darstellung. Die Zeitpunkte selbst bleiben gleich, alle antworten also auf dieselben Momente.
- Ganztägige Optionen sind reine Daten und werden daher nicht umgerechnet.
- Wenn Sie einen Termin in Ihren Kalender übernehmen, wird der Eintrag auf genau den vereinbarten Moment gelegt, sodass Ihr Kalender ihn in Ihrer Ortszeit zeigt.

## Eine häufige Falle

Wenn Sie eine Umfrage auf Reisen erstellen, ist Ihr Gerät vielleicht auf die Zone Ihres Aufenthaltsorts eingestellt. Prüfen Sie vor dem Teilen die Zone der Umfrage, damit „9 Uhr“ auch 9 Uhr dort bedeutet, wo die Besprechung tatsächlich stattfindet.`,
  },
  {
    id: 'hosting-a-poll',
    title: 'Eine Umfrage leiten, vom Entwurf bis zum bestätigten Termin',
    summary: 'Erstellen, ändern, bestätigen und Ihre Umfragen wiederfinden.',
    group: 'So funktioniert es',
    body: `## Eine Umfrage erstellen

1. Geben Sie der Umfrage einen Titel und wählen Sie zwischen Uhrzeiten und ganzen Tagen.
2. Fügen Sie Ihre Optionen hinzu. Wenn Sie einen Kalender verbunden haben, sind belegte Zeiten schattiert, und **Suggest times** kann die Umfrage mit vier Optionen aus Ihrer freien Zeit füllen: nur werktags, zwischen 10:00 und 16:00 in der Zeitzone der Umfrage und höchstens eine am Vormittag und eine am Nachmittag pro Tag.
3. Bestätigen Sie Ihre E-Mail-Adresse mit einem Einmalcode, oder melden Sie sich mit Ihrer Universal ID an.
4. Teilen Sie den Link.

## Es sich anders überlegen

Direkt nach dem Erstellen können Sie die Termine noch ändern, solange niemand geantwortet hat. Während Sie bearbeiten, werden alle, die den Link öffnen, gebeten, gleich noch einmal vorbeizuschauen, und Antworten werden bis zum Speichern abgelehnt. Bleibt eine Bearbeitung zehn Minuten ohne Speichern offen, verfällt sie von selbst und die Umfrage öffnet sich wieder.

## Einen Termin bestätigen

Wenn die Antworten da sind, wählen Sie den besten Termin mit **Confirm this time**. Das kann nur die einladende Person. Alle, die den Link öffnen, sehen dann ein „Confirmed“-Banner mit dem gewählten Termin. Sie können die Wahl später ändern oder zurücknehmen.

Über das Banner können Sie:

- Allen, die eine Adresse hinterlassen haben, den bestätigten Termin mit Kalendereinladung im Anhang per E-Mail senden. Das geschieht nur, wenn Sie klicken, nie automatisch.
- Mit **Copy email** die Nachricht aus Ihrem eigenen Postfach senden, mit Empfängern, Betreff und Text zum Kopieren.
- Den Termin in Ihren eigenen Kalender übernehmen.

## In einen Kalender übernehmen

Jedes Ergebnis und auch das Bestätigungsbanner hat eine Schaltfläche **Add to calendar** für Google Kalender, Outlook oder eine Kalenderdatei für Apps wie den Apple-Kalender. Der Kalendereintrag wird auf Ihrem Gerät erstellt.

## Ihre Umfragen wiederfinden

Wenn Sie als einladende Person angemeldet sind, listet die Erstellungsseite Ihre aktiven Umfragen auf, jeweils mit der Zahl der Antworten, dem bestätigten Termin, falls vorhanden, und dem Ablaufdatum des Links. Sie können einen Link kopieren, eine Umfrage löschen oder alle abgelaufenen Umfragen in einem Schritt löschen.`,
  },
  {
    id: 'poll-options',
    title: 'Buchungsseiten, Ablauf, Benachrichtigungen und Kalender',
    summary: 'Wofür jede der Optionen unter „This poll’s options“ gut ist.',
    group: 'So funktioniert es',
    body: `Die Optionen für die Umfrage, die Sie gerade erstellen, finden Sie in Ihrem Profilmenü unter **Tune this app** → **This poll's options**. Sie gelten nur für diese Umfrage.

## Buchungsseite („Just the two of us“)

Für ein Treffen zu zweit. Statt die Verfügbarkeit aller zu sammeln, wählt die Person, der Sie den Link schicken, einen Ihrer Termine, gibt Namen und E-Mail-Adresse ein, und der Termin ist sofort gebucht. Sie müssen nichts bestätigen, und Sie beide erhalten eine Kalendereinladung per E-Mail. Haben Sie einen Kalender verbunden, der das erlaubt, kann die Einladung auch aus Ihrem eigenen Kalender kommen. Sie können eine Buchung später stornieren, und die andere Person wird informiert.

## Gültigkeit des Links

Der Link einer Umfrage funktioniert 7, 30, 90 oder 180 Tage lang. Eine Option „läuft nie ab“ gibt es bewusst nicht, weil solche Links frei weitergegeben werden. Nach Ablauf ist die Umfrage schreibgeschützt: Man kann sie noch ansehen, aber es werden keine neuen Antworten angenommen. 30 Tage nach Ablauf des Links werden die Umfrage und ihre Antworten gelöscht.

## Benachrichtigungen bei Antworten

Kreuzen Sie dies an, um jedes Mal eine E-Mail zu erhalten, wenn eine neue Person antwortet. Wer eine bereits gegebene Antwort ändert, löst keine weitere E-Mail aus. Auf einer Buchungsseite wird die Option nicht angeboten, weil jede Buchung Ihnen ohnehin eine E-Mail schickt.

## Ihr Kalender

Sie können einen Google- oder Microsoft-Kalender verbinden. Die App schattiert dann beim Erstellen einer Umfrage die Zeiten, in denen Sie schon belegt sind, und schlägt freie Zeiten vor. Je nach Anbieter und erteilter Berechtigung kann sie auch Termintitel anzeigen und einen bestätigten Termin in Ihren Kalender eintragen. Sie können die Verbindung jederzeit trennen, wodurch die gespeicherte Verbindung gelöscht wird.

## Zeitzone

Jede Umfrage hat genau eine Zeitzone. Anfangs ist es Ihre, und Sie können jede andere wählen. Siehe „Zeitzonen erklärt“.

## Außerdem

Sie können einen Ort angeben, etwa einen Link zur Videokonferenz oder einen Raum, und eine Farbe für die Umfrageseite wählen. Wenn Sie mit einer Organisation angemeldet sind, kann deren Logo auf der Seite erscheinen, oder Sie fügen Ihr eigenes hinzu.`,
  },
  {
    id: 'who-can-see-what',
    title: 'Wer Ihre Umfrage und Ihre Antworten sehen kann',
    summary: 'Was alle mit dem Link sehen, was nur die einladende Person sieht und was privat bleibt.',
    group: 'Datenschutz und Sicherheit',
    body: `Eine Terminumfrage ist dafür gemacht, per Link geteilt zu werden. Deshalb lohnt es sich zu wissen, was dieser Link genau zeigt.

## Alle mit dem Link sehen

- Titel, Optionen, Zeitzone und Ort der Umfrage sowie eine eventuelle Farbe oder ein Logo.
- Den Namen jeder teilnehmenden Person und ob sie bei jeder Option frei, notfalls oder nicht frei angegeben hat.
- Den bestätigten Termin, sobald die einladende Person ihn gewählt hat.

Umfragelinks bestehen aus zehn zufälligen Zeichen und sind daher sehr schwer zu erraten. Aber alle, an die Sie den Link weiterleiten, sehen alles oben Genannte. Überlegen Sie also, an wen er geht.

## Nur die einladende Person sieht

- Die E-Mail-Adressen, die Teilnehmende freiwillig hinterlassen haben. Sie dienen dazu, den bestätigten Termin zu verschicken und Kalendereinladungen auszufüllen, und werden anderen Teilnehmenden nie angezeigt.

## Niemand sonst sieht

- Die E-Mail-Adresse der einladenden Person. Sie wird für deren Benachrichtigungen und Buchungs-E-Mails gespeichert und erscheint nicht auf der Umfrageseite.

## Ihr Name ist Ihr Schlüssel

Antworten werden unter dem Namen gespeichert, den Sie eingeben. Antworten Sie erneut mit genau demselben Namen, wird Ihre frühere Antwort aktualisiert statt doppelt angelegt. Das bedeutet auch: Wer genau denselben Namen verwendet, würde Ihre Antwort überschreiben. Wählen Sie daher etwas Eindeutiges, etwa Ihren vollständigen Namen.

Damit Sie nicht alles neu eintippen müssen, merkt sich dieses Gerät den Namen und die E-Mail-Adresse Ihrer letzten Antwort. Diese Angaben bleiben auf diesem Gerät.

## Eine E-Mail-Adresse ist freiwillig

Sie können antworten, ohne eine E-Mail-Adresse anzugeben. Hinterlassen Sie eine, kann Ihnen die einladende Person den bestätigten Termin schicken. Lassen Sie das Feld leer, wenn Sie das nicht möchten; eine erneute Antwort mit leerem Feld entfernt die zuvor angegebene Adresse.`,
  },
  {
    id: 'what-is-stored',
    title: 'Was gespeichert wird, und wie lange',
    summary: 'Wo Umfragedaten liegen, was der Ablauf bewirkt und was an wen geschickt wird.',
    group: 'Datenschutz und Sicherheit',
    body: `## Auf unseren Servern

Eine Umfrage muss an einem Ort liegen, den alle erreichen können. Deshalb werden Umfragen und Antworten auf unseren Servern gespeichert. Dazu gehören:

- Die Umfrage selbst: Titel, Optionen, Zeitzone, Einstellungen und die E-Mail-Adresse der einladenden Person.
- Jede Antwort: der angegebene Name, die getroffene Auswahl und der Zeitpunkt der Speicherung.
- E-Mail-Adressen, die Teilnehmende freiwillig hinterlassen haben, sowie Name und E-Mail-Adresse der Person, die auf einer Buchungsseite bucht.
- Ein Logo, das die einladende Person hochgeladen hat. Logos liegen dort, wo alle mit dem Umfragelink sie laden können, weil die Seite sie anzeigen muss.
- Wenn die einladende Person einen Kalender verbunden hat, die Zugangsschlüssel dieser Verbindung. Sie bleiben ausschließlich auf dem Server, werden nie an die App geschickt und nur für das verwendet, worum die einladende Person gebeten hat. Beim Trennen werden sie gelöscht.

Alles wird über verschlüsselte Verbindungen übertragen und durch Zugriffsregeln geschützt. Es ist nicht Ende-zu-Ende-verschlüsselt, unsere Systeme können es also technisch lesen.

## Wie lange

Wenn der Link einer Umfrage abläuft, nimmt sie keine Antworten mehr an und wird schreibgeschützt. Gelöscht wird sie in diesem Moment nicht, damit die einladende Person die Antworten noch nachlesen kann. 30 Tage nach Ablauf des Links wird die Umfrage automatisch gelöscht, zusammen mit allem, was unten aufgeführt ist. Die einladende Person kann sie auch früher löschen, und in deren Umfrageliste lassen sich alle abgelaufenen Umfragen in einem Schritt löschen.

Wird eine Umfrage gelöscht, werden damit auch ihre Antworten, die E-Mail-Adressen der Teilnehmenden und die zugehörigen Kalenderangaben gelöscht. Wird eine Buchung storniert, wird die E-Mail-Adresse der gebuchten Person gelöscht, nachdem die App versucht hat, sie zu benachrichtigen.

## E-Mails

Die App verschickt nur in diesen Fällen E-Mails:

- Einen Einmalcode, wenn eine einladende Person ihre E-Mail-Adresse bestätigt.
- Eine Benachrichtigung an die einladende Person bei neuen Antworten, wenn sie diese eingeschaltet hat.
- Den bestätigten Termin an Teilnehmende mit hinterlassener Adresse, nur wenn die einladende Person zum Senden klickt.
- Buchungsbestätigungen und Stornierungen auf einer Buchungsseite.

Die E-Mails werden in unserem Auftrag über einen E-Mail-Versanddienst verschickt.

## Auf Ihrem Gerät

Dieses Gerät merkt sich den Namen und die E-Mail-Adresse Ihrer letzten Antwort, Ihre Anzeigeeinstellungen und, wenn Sie Umfragen erstellen, Ihre Anmeldung. Kalendereinträge, die Sie mit **Add to calendar** hinzufügen, werden auf Ihrem Gerät erstellt. Wenn Sie Google oder Outlook wählen, öffnet sich dieser Dienst mit bereits ausgefüllten Termindaten.

## Ihre Universal ID

Einladende Personen können sich mit einer Universal ID anmelden, dem einen Konto, das alle UNI·SIM-Apps gemeinsam nutzen, oder einfach eine E-Mail-Adresse mit einem Einmalcode bestätigen. Zum Beantworten einer Umfrage ist nie ein Konto nötig.`,
  },
]

export default articles
