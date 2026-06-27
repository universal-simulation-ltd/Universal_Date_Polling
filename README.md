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
- **Decide** — the results view tallies every slot, shades it by how many people
  are free, and badges the winner(s).

### More options

A collapsible "More options" panel on the create screen covers:

- **Booking-page colour** — pastel orange / blue / pink / green themes.
- **Link validity** — 7 / 30 / 90 days, or never expires.
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
cd Universal_Apps/Universal_Polling
cp .env.example .env.local   # fill in the shared project's URL + anon key
npm install
npm run dev
```

Build: `npm run build` (outputs `dist/`, served under `/polling/` in
production). Deploy is a Git-connected Cloudflare Pages project behind the
`opensource.unisim.co.uk` portal Worker, exactly like the other Universal Apps.

## Licence

MIT © Universal Simulation Ltd.
