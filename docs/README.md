# Universal Date Polling — docs

## What this repo is

Universal Date Polling is a free, open-source group scheduler — the simple
"find a time that works for everyone" tool. The host creates a poll of
candidate dates/times (verifying their email with a one-time code so polls
can't be spammed anonymously), shares a link, and anyone can respond
Free / If-need-be per slot with no account; a live tally badges the best slot.

Once a poll has responses, each slot in the results carries an **"Add to
calendar"** control — Google Calendar and Outlook deep-links plus an `.ics`
download (Apple Calendar, Outlook desktop, everything else). The pure builders
live in `src/lib/calendar.ts` (unit-tested in `calendar.test.ts` via
`npm test`): timed slots become a UTC-anchored `VEVENT` so they land at the
right wall-clock time in every attendee's zone, and whole-day (`days`-mode)
polls become an all-day event with an exclusive end date. No server or
account involved — it's all generated client-side.

The **host can confirm a final time**: a "Confirm this time" control (shown
only to the host — detected by matching the signed-in uid, suite or guest-OTP,
against `polls.host_user_id`) writes `polls.final_slot_id` via the existing
`polls_owner_update` RLS policy (migration `0059_polls_final_slot.sql` in
`backoffice/universal-platform`). Once set, everyone with the link sees a
prominent "Confirmed" banner with the chosen date + an "Add to calendar" for
it. Clearing it (`final_slot_id = null`) is the "Change"/"Unconfirm" action.
Emailing the confirmed date to respondents is a deliberate non-goal for now —
respondents give only a name, no email (the app's no-sign-up stance).

A live timed poll shows **which timezone its times are in** and lets each
viewer re-render every time on the page in their own zone (a one-click
shortcut from the browser's `Intl` resolved zone) or any other zone (a
searchable dropdown, `src/components/TimezonePicker.tsx`). The chosen zone
(`displayTz` → `activeTz` in `PollPage`) only changes *display* formatting;
slot instants stay anchored to the poll's own zone.

The host can attach one **event location** to the whole poll (not per-slot): a
meeting link (Teams / Zoom / Google Meet) or a physical place ("Meeting room
5"). It's shown to respondents and carried into the Add-to-calendar export
(ICS `LOCATION` + Google/Outlook deep-links). Backed by a nullable
`polls.location` column (migration `0060_polls_location.sql`, to be renumbered
into `backoffice/universal-platform`). `createPoll` omits the key when unset so
a build can't break before the column exists; the gated create RPC sets it as a
follow-up update.

Opening a freshly-created poll is resilient to a cold first request: the poll
load auto-retries a transient error (`getPollResilient` in `src/lib/api.ts`) and
offers a one-click **Try again** instead of forcing a manual page refresh.

- **Live:** [opensource.unisim.co.uk/polling](https://opensource.unisim.co.uk/polling)
  — served by path via the `opensource-portal` Worker, which proxies `/polling`
  to the Git-connected `universal-polling` Cloudflare Pages project.
- **Stack:** Vite + React 18 + TypeScript, Tailwind CSS v4, PWA service
  worker. The shared navbar comes from `@unisim/sdk`.
- **Data:** poll data and host email verification (Supabase Auth email OTP)
  use the shared suite Supabase project — tables `polls` + `poll_responses`
  (migration `0025_polls.sql` in `backoffice/universal-platform`).
- **Naming:** the GitHub repo/folder is `Universal_Date_Polling` (renamed from
  `Universal_Group_Polling` in June 2026); the npm package name and the URL
  path keep the original `polling` naming.

MIT licensed — free and open source, like all Universal Apps.

## Timezone code (`src/lib/time.ts`)

All timezone/date maths lives in `time.ts` (unit-tested in `time.test.ts`), so
the frame each helper works in is documented in one place — this area had three
confirmed timezone bugs in the 2026-07-19 review, and the shared helpers exist
so the shapes aren't re-derived by hand:

- **`slotInstant` / `slotEnd`** — a slot's start/end as UTC instants (`slotEnd`
  is the single source of end-instant math, used by both `formatRange` and the
  calendar-event builder).
- **`slotDayKey(slot)`** — the `'YYYY-MM-DD'` calendar day of a slot; the one
  accessor for grouping and days-mode, replacing hand-rolled `start.slice(0,10)`.
- **`addCalendarDays` vs `addLocalDays`** — two deliberately-separate day-adders:
  `addCalendarDays` is pure date-string arithmetic in the UTC frame (exclusive
  all-day end dates), `addLocalDays` steps a `Date` in the viewer's local frame
  (the week-grid nav). **Different timezone frames — don't conflate them.**
- **`needsTzNote(poll, viewerTz)`** — whether a viewer-local time should be
  spelled out (timed poll whose zone differs from the viewer's). The poll page's
  viewer-timezone switcher generalises this to any active display zone.
- **`filterTimezones(query, zones)`** — the searchable-picker filter; treats
  spaces, `_` and `/` as interchangeable so "new york" matches
  `America/New_York`.
- **`wallClockExists(local, tz)`** — false when a wall-clock time falls in a DST
  spring-forward gap (e.g. London `01:30` on switch night, which never occurs).
  The create form (`SlotPicker` → `FormPicker`) warns the host at creation
  rather than silently letting the slot resolve an hour later.

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
