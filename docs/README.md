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

## Suite context

This repo is one part of the **Universal Simulation suite** (the open-source
Universal Apps family). For cross-repo context — how the `@unisim/sdk`, edge
routing, and the suite changelog wire together — see the suite docs repo:
[`universal-simulation-ltd/docs`](https://github.com/universal-simulation-ltd/docs)
(private; checked out at the umbrella root as `Docs_UNI_SIM/` for suite
contributors). Start with `ARCHITECTURE.md` (the cross-repo map).
