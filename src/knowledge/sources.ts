import type { Source } from './types'

// The research, standards and reports behind each article, keyed by article
// id. The same in every language, so kept once here and attached by index.ts.
//
// Original research papers first, then the standards, then guidance — and
// only sources for what the app really does (checked against src/ and the
// platform's edge functions on 2026-09-29: poll links are 10 characters drawn
// with crypto.getRandomValues from a 32-letter alphabet in lib/api.ts; times
// are converted with Intl.DateTimeFormat and IANA zone names in lib/time.ts;
// lib/calendar.ts writes an RFC 5545 METHOD:PUBLISH .ics on the device; the
// booking and confirmed-time emails attach METHOD:REQUEST / CANCEL invitations
// (book-poll-slot, _shared/poll-ics.ts); calendar-oauth is an OAuth 2.0
// authorisation-code grant to Google and Microsoft, and calendar-freebusy calls
// Google's freeBusy and Graph's calendarView). "Suggest times" is our own
// heuristic, so nothing is cited for it. The results are a plain tally, so the
// Doodle studies are cited rather than any voting-rule paper.
//
// ⚠️ `pdf` (our hosted copy at opensource.unisim.co.uk/kb/papers/) ONLY where
// the licence allows redistribution: IETF RFCs, and EU acts under Decision
// 2011/833/EU. ACM, ITU and Ecma documents link to the publisher's or the
// authors' own free copy instead. EUR-Lex bot-blocks curl, so the GDPR PDF was
// fetched from (and its link confirmed by) the Wayback Machine's capture.

const RFC_5545: Source = {
  kind: 'standard',
  title: 'Internet Calendaring and Scheduling Core Object Specification (iCalendar) (RFC 5545)',
  authors: 'Bernard Desruisseaux (ed.)',
  publisher: 'IETF',
  year: 2009,
  href: 'https://www.rfc-editor.org/rfc/rfc5545.html',
}

const RFC_5546: Source = {
  kind: 'standard',
  title: 'iCalendar Transport-Independent Interoperability Protocol (iTIP) (RFC 5546)',
  authors: 'Cyrus Daboo (ed.)',
  publisher: 'IETF',
  year: 2009,
  href: 'https://www.rfc-editor.org/rfc/rfc5546.html',
}

const GDPR: Source = {
  kind: 'law',
  title: 'Regulation (EU) 2016/679 — General Data Protection Regulation',
  publisher: 'Official Journal of the European Union, L 119/1',
  year: 2016,
  href: 'https://eur-lex.europa.eu/eli/reg/2016/679/oj',
  pdf: 'papers/gdpr-regulation-2016-679.pdf',
  licence: '© European Union, reused under Commission Decision 2011/833/EU',
}

export const SOURCES: Record<string, Source[]> = {
  'how-date-polls-work': [
    {
      kind: 'paper',
      title: 'Doodle around the world: online scheduling behavior reflects cultural differences in time perception and group decision-making',
      authors: 'Katharina Reinecke, Minh Khoa Nguyen, Abraham Bernstein, Michael Näf, Krzysztof Z. Gajos',
      publisher: 'ACM CSCW',
      year: 2013,
      href: 'https://kgajos.seas.harvard.edu/papers/reinecke13doodle.pdf',
    },
    {
      kind: 'paper',
      title: 'Strategic Voting Behavior in Doodle Polls',
      authors: 'James Zou, Reshef Meir, David C. Parkes',
      publisher: 'ACM CSCW',
      year: 2015,
      href: 'https://dash.harvard.edu/server/api/core/bitstreams/7312037d-7f18-6bd4-e053-0100007fdf3b/content',
    },
  ],
  'time-zones-explained': [
    {
      kind: 'standard',
      title: 'Recommendation ITU-R TF.460-6: Standard-frequency and time-signal emissions (the definition of UTC)',
      publisher: 'ITU Radiocommunication Sector',
      year: 2002,
      href: 'https://www.itu.int/rec/R-REC-TF.460-6-200202-I/en',
    },
    {
      kind: 'standard',
      title: 'Procedures for Maintaining the Time Zone Database (RFC 6557)',
      authors: 'Eliot Lear, Paul Eggert',
      publisher: 'IETF',
      year: 2012,
      href: 'https://www.rfc-editor.org/rfc/rfc6557.html',
    },
    {
      kind: 'standard',
      title: 'The Time Zone Information Format (TZif) (RFC 9636)',
      authors: 'Arthur David Olson, Paul Eggert, Kenneth Murchison',
      publisher: 'IETF',
      year: 2024,
      href: 'https://www.rfc-editor.org/rfc/rfc9636.html',
      pdf: 'papers/rfc-9636-tzif.pdf',
      licence: 'IETF Trust — RFC, freely redistributable unmodified',
    },
    {
      kind: 'standard',
      title: 'ECMAScript Internationalization API Specification (ECMA-402) — Intl.DateTimeFormat and time zones',
      publisher: 'Ecma International, TC39',
      href: 'https://tc39.es/ecma402/',
    },
  ],
  'hosting-a-poll': [
    RFC_5545,
    RFC_5546,
    {
      kind: 'standard',
      title: 'iCalendar Message-Based Interoperability Protocol (iMIP) (RFC 6047)',
      authors: 'Alexey Melnikov (ed.)',
      publisher: 'IETF',
      year: 2010,
      href: 'https://www.rfc-editor.org/rfc/rfc6047.html',
    },
  ],
  'poll-options': [
    {
      kind: 'standard',
      title: 'The OAuth 2.0 Authorization Framework (RFC 6749)',
      authors: 'Dick Hardt (ed.)',
      publisher: 'IETF',
      year: 2012,
      href: 'https://www.rfc-editor.org/rfc/rfc6749.html',
    },
    {
      kind: 'guidance',
      title: 'Freebusy: query — Google Calendar API reference',
      publisher: 'Google',
      href: 'https://developers.google.com/workspace/calendar/api/v3/reference/freebusy/query',
    },
    {
      kind: 'guidance',
      title: 'List calendarView — Microsoft Graph API reference',
      publisher: 'Microsoft',
      href: 'https://learn.microsoft.com/en-us/graph/api/user-list-calendarview',
    },
    RFC_5546,
  ],
  'who-can-see-what': [
    {
      kind: 'paper',
      title: 'Gone in Six Characters: Short URLs Considered Harmful for Cloud Services',
      authors: 'Martin Georgiev, Vitaly Shmatikov',
      publisher: 'arXiv',
      year: 2016,
      href: 'https://arxiv.org/abs/1604.02734',
    },
    {
      kind: 'guidance',
      title: 'Good Practices for Capability URLs',
      authors: 'Jeni Tennison (ed.)',
      publisher: 'W3C Technical Architecture Group',
      year: 2014,
      href: 'https://www.w3.org/TR/capability-urls/',
    },
    {
      kind: 'standard',
      title: 'Web Cryptography Level 2 — getRandomValues()',
      publisher: 'W3C',
      href: 'https://www.w3.org/TR/WebCryptoAPI/',
    },
  ],
  'what-is-stored': [
    { ...GDPR, title: 'Regulation (EU) 2016/679 — General Data Protection Regulation, Article 5 (storage limitation)' },
    {
      kind: 'guidance',
      title: 'Principle (e): Storage limitation',
      publisher: 'Information Commissioner\'s Office',
      href: 'https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/data-protection-principles/a-guide-to-the-data-protection-principles/storage-limitation/',
    },
    {
      kind: 'standard',
      title: 'The Transport Layer Security (TLS) Protocol Version 1.3 (RFC 8446)',
      authors: 'Eric Rescorla',
      publisher: 'IETF',
      year: 2018,
      href: 'https://www.rfc-editor.org/rfc/rfc8446.html',
    },
    {
      kind: 'guidance',
      title: 'Row Security Policies — PostgreSQL documentation',
      publisher: 'PostgreSQL Global Development Group',
      href: 'https://www.postgresql.org/docs/current/ddl-rowsecurity.html',
    },
  ],
}
