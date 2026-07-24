-- Universal Date Polling — add an optional EVENT location to a poll.
--
-- A single free-text field the host can set once for the whole poll (not per
-- slot): a meeting link (Teams / Zoom / Google Meet) OR a physical place
-- ("Meeting room 5"). Shown to respondents on the poll page and woven into the
-- Add-to-calendar export (ICS LOCATION + Google/Outlook deep-links).
--
-- Nullable, no default: existing polls simply carry no location. Reads/writes go
-- through the existing `polls` RLS policies (public SELECT, owner INSERT/UPDATE
-- via auth.uid() = host_user_id from 0025_polls.sql), so no policy change is
-- needed — the host sets it with the same client that owns the row.
--
-- NOTE: this file lives in the Universal_Date_Polling repo for review; the poll
-- schema is actually owned by `backoffice/universal-platform`. Renumber to that
-- repo's next free migration index before applying it to the hosted Supabase.

alter table public.polls
  add column if not exists location text;
