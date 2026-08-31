# Universal Date Polling

A free, open-source group scheduler — the simple "find a time that works for
everyone" tool. Create a poll, propose some dates and times, share a link, and
watch the best slot rise to the top as people tick their availability.

**Live:** [opensource.unisim.co.uk/polling](https://opensource.unisim.co.uk/polling)

Part of the [Universal Apps](https://opensource.unisim.co.uk) suite by
[UNI SIM](https://www.unisim.co.uk).

## How it works

- **Create** a poll — title, candidate dates/times, a timezone (defaults to
  yours). Creating a poll requires verifying your email with a one-time code, so
  polls can't be spammed anonymously.
- **Share** the generated link. Anyone with it can respond — no account needed.
- **Respond** — tick each slot you're *free* or *if-need-be*. Times are shown in
  the poll's timezone, with your own local time alongside if they differ.
  Optionally leave an email to be notified when the host confirms a time — it's
  stored write-only (client roles can never read it back) and never shown to
  other respondents.
- **Decide** — the results view tallies every slot, shades it by how many people
  are free, and badges the winner(s).
- **Confirm** — the host (and only the host) can click **"Confirm this time"** on
  a result slot. Everyone with the link then sees a prominent **"Confirmed"**
  banner with the chosen date/time. From that banner the host can **email every
  respondent who left an address** the confirmed time, with a `.ics` invite
  attached (the `notify-poll-respondents` Edge Function; never sent
  automatically — always an explicit host click).
- **Come back to it** — signed in as the host, the create page lists **your
  active polls** above the form (collapsible, and collapsed to a one-line header
  from three polls up), each with how many people have replied, the
  confirmed time if you've picked one, when the link expires, and a copy-link
  button — and a **Delete**, with "delete all" for the expired ones in a single
  step. A poll id is ten random characters, so before this the only route back
  to a poll was the link you kept.
- **Your logo, up front** — a signed-in host's square company mark (or a logo
  picked in the Branding box) sits beside the app mark at the top of the create
  page, so you can see whose brand the poll will carry before you send it.
- **Suggest times** — with a calendar connected, one click fills the poll in
  from the host's own free time: 4 options, weekdays only, between 10:00 and
  16:00 in the poll's timezone, and at most one morning and one afternoon on any
  given day. They're ordinary slots once added — drag one to move it, click to
  remove it, click again for four more.
- **Add to calendar** — each result slot (and the confirmed banner) has an "Add
  to calendar" button: Google Calendar, Outlook, or an `.ics` download (Apple
  Calendar, Outlook desktop). Generated entirely client-side, in the poll's
  timezone.

### More options

A collapsible "More options" panel on the create screen covers:

- **Booking-page colour** — pastel orange / blue / pink / green themes.
- **Link validity** — 7 / 30 / 90 / 180 days. There is deliberately no
  "never expires": polls are public and link-shared, so respondents' answers
  shouldn't live on the server forever.
- **Timezone** — defaults to the host's, override to any IANA zone.

> Host calendar integration (check the host's own availability while building a
> poll) is a planned follow-up — see the suite docs.

## Stack

Vite + React 18 + TypeScript, Tailwind CSS v4, and a PWA service worker. Poll
data and host email verification use the shared suite **Supabase** project
(tables `polls` + `poll_responses`, migration `0025_polls.sql` in
`backoffice/universal-platform`). The shared navbar comes from `@unisim/sdk`.

## Develop

```bash
cd Universal_Apps/Universal_Date_Polling
cp .env.example .env.local   # fill in the shared project's URL + anon key
npm install
npm run dev
```

Build: `npm run build` (outputs `dist/`, served under `/polling/` in
production). Deploy is a Git-connected Cloudflare Pages project behind the
`opensource.unisim.co.uk` portal Worker, exactly like the other Universal Apps.

### The iPhone app

The same React app ships as a native iOS app through **Capacitor**
(`uk.co.unisim.polling`). Sideloaded only — it is not on the App Store.

```bash
cd Universal_Apps/Universal_Date_Polling
npm run cap:sync
npm run cap:open:ios
```

⚠️ **Always go through `npm run cap:sync`, never a bare `npx cap sync`.** The
native build is a *different Vite mode* (`--mode desktop`): base `./` instead of
`/polling/`, and no service worker. Sync the ordinary web build instead and the
app installs, launches, and shows a **blank screen** — every asset URL is a 404
against the `capacitor://localhost` origin, while Xcode still says BUILD
SUCCEEDED and the copied bundle is gitignored so nothing local disagrees.
`cap:sync` builds the right mode and then runs
`npm run check:mobile-bundle` (`scripts/verify-mobile-bundle.mjs`), which fails
if the copied `index.html` holds a root-absolute asset URL or a service worker.

Two things the shell changes that the web never sees, both in
[`src/lib/appUrl.ts`](src/lib/appUrl.ts) and
[`src/lib/saveFile.ts`](src/lib/saveFile.ts):

- The running origin is `capacitor://localhost`, so **any URL built from
  `window.location` is useless** — an unopenable poll link, or a sign-in email
  Supabase redirects to the suite hub because no allowlist can hold that origin.
  The hosted site stands in wherever the origin is not a real one.
- An anchor's `download` attribute is **ignored** in a WKWebView: no error, no
  console warning. The `.ics` goes to the iOS share sheet instead.

The app icon and launch image are generated from the canonical mark — from
`backoffice/universal-platform`, `node scripts/app-marks/native-icons.mjs
Universal_Date_Polling`. Do not hand-edit them, and note iOS applies its own
squircle mask, so the source art must be a full-bleed square with no alpha.

Each build bakes the commit SHA into a `<meta name="build-sha">` tag and logs
`build: <sha>` to the console at startup, so you can tell which build is live
in-browser. On Cloudflare Pages the SHA comes from `CF_PAGES_COMMIT_SHA`; locally
it falls back to the git short SHA (or `dev`).

## Licence

MIT © Universal Simulation Ltd.
