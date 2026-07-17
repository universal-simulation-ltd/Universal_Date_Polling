# Universal Date Polling — docs

## What this repo is

Universal Date Polling is a free, open-source group scheduler — the simple
"find a time that works for everyone" tool. The host creates a poll of
candidate dates/times (verifying their email with a one-time code so polls
can't be spammed anonymously), shares a link, and anyone can respond
Free / If-need-be per slot with no account; a live tally badges the best slot.

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
