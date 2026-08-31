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

The host can then **email the confirmed time to respondents** (Phase 2 — this
paragraph used to say emailing was a deliberate non-goal; it shipped). Anyone
responding may optionally leave an address, stored in `poll_response_emails`
(migration 0115), which client roles can write but never read — the
`notify-poll-respondents` Edge Function's service-role read is the only path to
an address. It sends the confirmed date with a `.ics` attachment built by
`_shared/poll-ics.ts`, then stamps `polls.final_notified_slot_id` so the page
can show "respondents emailed ✓". Always an explicit host click; confirming a
slot never auto-sends.

## "Your polls" — the way back to a poll you made

A poll id is ten random URL-safe characters and nothing ever listed them, so
until 2026-08-31 the only route back to a poll you created was the link you
copied at the time. `src/components/MyPolls.tsx` renders the list above the
create form for a signed-in host; `src/lib/myPolls.ts` holds the pure parts
(merging, the active/expired split, and every label), unit-tested in
`myPolls.test.ts`.

Three things are worth knowing about it:

- **It reads through an RPC, not the table.** `polls_owner_read` (migration
  0122) would in fact allow `from('polls').select()` for the host's own rows —
  the RPC exists for the **response count**. 0122 revoked `poll_responses` from
  client roles entirely so respondents can't be enumerated, so "4 responses" has
  to be counted server-side. `list_my_polls()` (migration
  `0130_poll_list_mine.sql`) returns each poll plus a `response_count`, minus
  `host_email`, scoped to `auth.uid()` — one round trip, no id argument, and no
  way to ask for somebody else's polls. Note that Postgres grants EXECUTE to
  PUBLIC by default, so `anon` *can* call it; it gets `[]`, because `auth.uid()`
  is null and the function's own `where` clause is the boundary.
- **It queries BOTH sessions.** A host can hold a Universal ID (suite SSO)
  session and this app's own email-code session at the same time; they are
  different `auth.uid()`s and polls made under either are equally "yours".
  `MyPolls` takes both clients, calls each, and merges (`mergeMyPolls`
  deduplicates by id) — the same pair `PollPage` already reasons about to decide
  who the host is. One session erroring doesn't blank out the other's polls.
- **Deleting needed no new backend at all.** `polls_owner_delete` (0025) has
  always scoped a DELETE to the host, responses / respondent emails / calendar
  links cascade off it, the `polls_after_delete` trigger (0042) refunds a
  credit-funded poll, and a free-token-funded one releases the org's free token
  the moment the row goes (0045 derives the holder from the live rows). So
  `deletePolls` is a plain `.delete().in('id', ids)` — with a `.select()`,
  which is the part that matters: RLS *filters* rather than raises, so deleting
  a poll you don't own is not an error, it silently removes nothing. Reading
  back the ids that actually went is what stops the panel striking off a row
  that is still there. Rows are deleted through the client that returned them
  (see the previous point), the confirm is a two-step strip in the page rather
  than `window.confirm`, and the expired section has a "delete all". `onDeleted`
  tells the create page to re-read the free-token gate, or its "1 token per
  poll" banner keeps claiming the token you just got back is in use.
- **It renders nothing when there's nothing to say.** No polls, or still
  loading, means no card at all — a permanent empty "you have no polls" box
  above the create form would be the first thing every new host saw. **From
  three active polls the panel is collapsible and starts collapsed** — the
  header keeps the count, so "you have 5 waiting" survives the fold, and a host
  with a dozen live polls doesn't scroll past all of them to make the next one.
  Expired ones sit behind their own toggle rather than vanishing (a host looking
  for last week's poll should find it saying "Expired"), and they lose their
  Copy link, since nobody can answer them.

## The host's own calendar (Phase 3)

A host can connect their **Google or Microsoft calendar**, which does two
things. Both are host-only, opt-in, and never touch a respondent.

**Read — busy shading on the create screen.** The week view shades the times
the host is already busy, so they don't propose a slot they can't make.
`calendar-freebusy` returns merged UTC busy intervals; `busySegmentsByDay` in
`src/lib/hostCalendar.ts` converts them to per-day wall-clock segments in the
poll's zone (unit-tested — busy shading has to land in the same frame the slots
are drawn in, or it lies whenever the poll's zone isn't UTC).

**Suggest — build the poll out of the free space** (added 2026-08-14). Beside
the week view, "Suggest 4 times" fills the poll in from the host's own
availability instead of making them draw every slot. The picking is a pure
function, `suggestFreeSlots` in `src/lib/autoSlots.ts` (unit-tested in
`autoSlots.test.ts`), fed the same per-day busy segments the shading uses — so
a suggestion lands exactly where the grid says the host is free, in the poll's
timezone. The rules it encodes:

- **Weekdays only, 10:00–16:00** wall-clock in the poll's zone. A slot starts no
  earlier than 10:00 and ends no later than 16:00.
- **At most one morning and one afternoon per day** (split at noon, classified
  by start time), so four options can't all be one Tuesday.
- **Spread before density** — the first pass takes one option per day,
  alternating the half of the day it tries first so the set isn't four identical
  10am slots; only when the days run out does a second pass double up.
- **Afternoons prefer 13:00 onwards**, dropping into the 12:00–13:00 hour only
  when nothing later fits.
- Starts snap to the same 30-minute grid a drawn slot does, existing slots count
  as busy (so a second click adds four *more* options, not four duplicates), and
  the first day is cut off an hour ahead of now.

The click fetches the whole 21-day scan range itself rather than reusing
whichever weeks the grid has loaded, and **aborts if any connected provider's
read fails** — half a diary would propose times the host isn't actually free
for. The calendar view then jumps to the week the first suggestion landed in
(`focus` prop on `CalendarWeekView`), since slots off-screen look like nothing
happened.

**Write — put the confirmed time in the host's diary** (added 2026-08-13,
**Outlook only since 2026-08-31**). Once a slot is confirmed, the banner offers
"Add to my Outlook / Microsoft 365", which creates a real event via the
`calendar-event` Edge Function. Un-confirming removes it again. Distinct from
the "Add to calendar" menu everyone sees: that one is client-side deep-links
and an `.ics` download, this one writes through the host's OAuth grant.

⚠️ **Google is read-only, and busy blocks connected to Google are anonymous.**
This is a deliberate hold, not a missing feature. `calendar.events.readonly`
(names) and `calendar.events` (writes) are **sensitive** scopes, and an app
requesting either is capped at 100 hand-added test users behind an "unverified
app" screen until it passes Google's verification review — and, the part that
actually bit, Google revokes the refresh token of any External app in *Testing*
after **7 days**, so every Google host silently lost their connection weekly.
Asking only for `calendar.freebusy` + `calendar.calendarlist.readonly` takes
the app out of that regime, so anyone can connect Google and stay connected.
Microsoft has no equivalent gate and keeps both names and writes.

The switch is `GOOGLE_SENSITIVE_HOLD` in the platform's
`supabase/functions/_shared/calendar-providers.ts`; the whole restore is one
flag, but it **must** move in the same change as the Google console work —
see the Date Polling section of `backlog-unisim.md`.

Things worth knowing before touching it:

- **`status.ceiling` is not `status.writable`.** `writable`/`detailed` say what
  the STORED grant carries; `ceiling` says what a FRESH connect would grant.
  The UI needs both to tell "reconnect and this gets better" apart from
  "reconnect changes nothing" — under the hold every Google grant is
  permanently the latter, so `CreatePoll`'s "reconnect to show event names" and
  `PollPage`'s "Reconnect Google to add it" hide themselves rather than nagging
  forever. Both flags default to TRUE when a server omits them, because a
  server that predates the field is one from before the hold.
- **Hosts who connected before the narrowing keep what they were granted.** The
  hold changes what is *requested*, not what is stored, so a grant carrying the
  detail or write scope still reads titles and still writes. `hasDetailScope` /
  `hasWriteScope` read the row, not the constants — don't "simplify" them into
  reading the current scope set.

- **Tokens never reach this app.** They live in `poll_calendar_tokens`
  (migrations 0117/0118), service-role only, RLS on with zero policies and
  grants revoked. Everything goes through the three Edge Functions in
  `backoffice/universal-platform/supabase/functions/calendar-*`, each of which
  checks the caller's uid itself.
- **An existing connection cannot write.** The write scope
  (Google `calendar.events`, Microsoft `Calendars.ReadWrite`) arrived after the
  read-only one, so a grant made before 2026-08-13 has to be re-consented.
  `poll_calendar_tokens.scopes` records what the provider *actually granted* —
  not what was requested, since a user can untick individual permissions on
  Google's consent screen — and `status.writable` is derived from it. The UI
  shows "Reconnect … to add it" rather than a button that 403s.
- **The write is idempotent.** `poll_calendar_events` holds the created event id
  per (poll, host, provider), so clicking twice updates one event rather than
  making two, and re-confirming a different slot moves it.
- **The event's content comes from the poll row server-side**, never from the
  request body — a host can only write their own poll's confirmed slot.

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

The host can also **copy the poll's dates as plain text** for people who'd
rather reply to an email than click a link — offered on the "your poll is live"
panel and, host-only, at the top of the poll page. `buildPollTextList` in
`src/lib/textExport.ts` (unit-tested in `textExport.test.ts`) is a pure string
builder; `components/CopyAsText.tsx` is the textarea, the "include the link to
the poll" checkbox and the clipboard button. Two things about the format are
deliberate and are asserted by the tests: the list is **flat and numbered**,
each line carrying its own full date, so nothing depends on indentation
surviving a mail client and a reply can just say "2 and 4 work"; and the
timezone label is anchored to the **first slot's** instant, not to `now`, so a
January poll copied in June isn't labelled BST. The poll page passes `activeTz`
rather than the poll's own zone, so the pasted list reads the same as the page
it was copied from.

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
- **`calendarWeekday(day)`** — the weekday (0 = Sunday) of a `'YYYY-MM-DD'`
  string, in the same pure UTC frame as `addCalendarDays`; `new Date(day)` would
  read UTC midnight back in the viewer's frame and be a day out west of
  Greenwich. Used to keep auto-suggested slots on Mon–Fri.
- **`zonedDayAndMinute(instant, tz)`** — an instant's wall-clock day and
  minutes-since-midnight in `tz`. The one frame busy shading
  (`busySegmentsByDay`) and the auto-suggester both work in, so the two can be
  compared minute for minute.
- **`needsTzNote(poll, viewerTz)`** — whether a viewer-local time should be
  spelled out (timed poll whose zone differs from the viewer's). The poll page's
  viewer-timezone switcher generalises this to any active display zone.
- **`filterTimezones(query, zones)`** — the searchable-picker filter; treats
  spaces, `_` and `/` as interchangeable so "new york" matches
  `America/New_York`.
- **`formatLongDate(instant, tz)`** — "Wed, 10 Jun 2026" for an instant in a
  display zone; the timezone-aware twin of `formatCalendarDay` (which takes a
  bare date string and does no conversion). Spells the year out for the
  plain-text export, which is read in an email with no page around it.
- **`formatCalendarDayShort(dateStr)`** — `formatCalendarDay` minus the year,
  for the compact rows in "Your polls". Built from local numeric parts the same
  way, so it keeps the same guarantee: a whole-day date reads identically in
  every zone.
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
