import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useAppFreeToken, useFileDrop, useOrg, useOrgBranding, useSubscription, useUniversal, useUser } from '@unisim/sdk'
import type { NewPoll, PollBranding, PollMode, Slot, Theme } from '../lib/types'
import { isHexTheme, THEMES } from '../lib/types'
import { hexOfTheme, themeAttr, themeVars } from '../lib/theme'
import { createPoll, createPollGated, currentUser, sendHostCode, setNotifyOnResponse as apiSetNotify, setPollLocation as apiSetLocation, shortId, uploadPollLogo, verifyHostCode } from '../lib/api'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabase'
import { addLocalDays, listTimezones, localTimezone, tzAbbrev } from '../lib/time'
import {
  busySegmentsByDay, calendarConfigured, calendarStatus, disconnectCalendar, fetchFreeBusy, startCalendarConnect,
  type BusyInterval, type CalendarProvider, type CalendarStatus,
} from '../lib/hostCalendar'
import SlotPicker from './SlotPicker'
import ProductLogo from './ProductLogo'
import type { SlotView } from './SlotPicker'
import { CONTAINER_CREATE } from '../lib/layout'

const VALIDITY = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  // No "never expires": polls are public, link-shared, and we don't want
  // respondent data living on the server forever. 180 days is the long option.
  { label: '180 days', days: 180 },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LOGO_TYPES = ['image/png', 'image/jpeg', 'image/webp']
// Source-file ceiling, not the stored size — the upload is downscaled in the
// browser first, so this only needs to be generous enough for a phone photo
// or a Retina screenshot. Matches the hub's org-branding upload.
const MAX_LOGO_BYTES = 10 * 1024 * 1024

type Phase = 'edit' | 'sending' | 'code' | 'creating' | 'done'

export default function CreatePoll({ pollBase }: { pollBase: string }) {
  const [title, setTitle] = useState('')
  // `view` drives the slot picker's segmented selector; the stored poll `mode`
  // is derived from it (only "Whole days" is a days poll). The drag-to-pick
  // calendar is the default since 2026-08-11 — it's the view the host-calendar
  // busy overlay lives in; the quick form remains a tab away.
  const [view, setView] = useState<SlotView>('calendar')
  const mode: PollMode = view === 'days' ? 'days' : 'times'
  const [slots, setSlots] = useState<Slot[]>([])
  const [theme, setTheme] = useState<Theme>('orange')
  const [timezone, setTimezone] = useState(localTimezone())
  // Optional EVENT location — a meeting link or a physical place — for the whole
  // poll (not per-slot). Shown to respondents and carried into the export.
  const [location, setLocation] = useState('')
  const [validityDays, setValidityDays] = useState<number | null>(30)
  const [notifyOnResponse, setNotifyOnResponse] = useState(false)
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)

  // Branding inputs (their own collapsible). Guests always edit these directly.
  // A logged-in host's account branding imports automatically and is shown
  // read-only until they opt into overriding it for this one poll.
  const [brandName, setBrandName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoErr, setLogoErr] = useState<string | null>(null)
  // Logged-in hosts only: false = use the imported account branding as-is.
  const [brandOverride, setBrandOverride] = useState(false)
  // Set when overriding clears the imported logo, so "no logo" is distinct
  // from "no new file picked, keep the account one".
  const [dropOrgLogo, setDropOrgLogo] = useState(false)

  const [showMore, setShowMore] = useState(false)
  const [showBranding, setShowBranding] = useState(false)
  const [phase, setPhase] = useState<Phase>('edit')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const colorRef = useRef<HTMLInputElement>(null)
  const zones = listTimezones()

  // --- Enterprise detection via the suite SDK (cookie SSO in production) ------
  const { user: suiteUser, loading: userLoading } = useUser()
  const { subscription, loading: subLoading } = useSubscription()
  const { org, orgs, loading: orgLoading } = useOrg()
  const orgBranding = useOrgBranding()
  const { supabase: suiteClient } = useUniversal()
  const enterprise =
    !!suiteUser &&
    subscription?.tier === 'enterprise' &&
    (subscription.status === 'active' || subscription.status === 'trialing')

  // Any verified Universal ID session (free, pro, or enterprise) — these users
  // skip the email OTP step since they're already authenticated via the suite.
  const suiteLoggedIn = !!suiteUser
  // Free-tier suite users are subject to the 1-poll token gate.
  const freeGated = suiteLoggedIn && !!subscription && subscription.tier === 'free'
  // Every org has one free returnable Polling token (migration 0045) —
  // create_poll_gated spends it before the purchased wallet, so the banner
  // shouldn't read "0 tokens" while the free one is still available.
  const { status: pollFreeToken } = useAppFreeToken('polling')

  // Temporary diagnostic: visit the create page with ?diag=1 to see exactly
  // where enterprise detection stops (session → org → subscription tier).
  const diag = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('diag')
  const [diagRaw, setDiagRaw] = useState<Record<string, unknown> | null>(null)
  useEffect(() => {
    if (!diag || !suiteUser) return
    let live = true
    ;(async () => {
      const out: Record<string, unknown> = {}
      // Which backend is each client actually pointed at?
      out.envUrlHost = (import.meta.env.VITE_SUPABASE_URL as string | undefined ?? 'UNSET').replace(/^https?:\/\//, '')

      const { data: sess } = await suiteClient.auth.getSession()
      out.session = sess.session
        ? { hasAccessToken: !!sess.session.access_token, expiresAt: sess.session.expires_at, userId: sess.session.user?.id }
        : null

      const probe = async (fn: () => PromiseLike<{ error: { message?: string; code?: string } | null; data?: unknown }>) => {
        try {
          const r = await fn()
          return { ok: !r.error, error: r.error?.message ?? null, code: r.error?.code ?? null }
        } catch (e) {
          return { ok: false, error: e instanceof Error ? `${e.name}: ${e.message}` : String(e), code: 'THROWN' }
        }
      }

      // SDK client (suite SSO) — the org query that's failing, plus a trivial one.
      out.sdk_orgMembers = await probe(() =>
        suiteClient.from('org_members').select('org_id, organisations(id, name)').eq('user_id', suiteUser.id))
      out.sdk_subscriptions = await probe(() =>
        suiteClient.from('subscriptions').select('org_id').limit(1))
      // App's OWN client (anon, same project) — does ANY request from this page work?
      out.app_polls = await probe(() => supabase.from('polls').select('id').limit(1))

      if (live) setDiagRaw(out)
    })()
    return () => { live = false }
  }, [diag, suiteUser, suiteClient])

  // A logged-in host's poll defaults to their account ("My Company") brand
  // colour. Runs once the signed-in branding resolves — and never again after
  // they start overriding, or a late-arriving org colour would silently undo
  // the swatch they just picked.
  useEffect(() => {
    if (brandOverride) return
    if (suiteLoggedIn && orgBranding.brand_color && isHexTheme(orgBranding.brand_color)) {
      setTheme(orgBranding.brand_color)
    }
  }, [suiteLoggedIn, orgBranding.brand_color, brandOverride])

  /** Switch a logged-in host from the imported branding to editable copies of
   *  it, so "customise" starts from what they already have rather than blank. */
  function startBrandOverride() {
    setBrandName((n) => n || org?.name || '')
    setBrandOverride(true)
  }

  // A returning guest host already has an OTP session — skip the email step.
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    currentUser().then((u) => {
      if (u?.email) {
        setEmail(u.email)
        setVerified(true)
      }
    })
  }, [])

  // --- Host-calendar free/busy overlay (Phase 3) ------------------------------
  // Any authenticated host (suite session or a returning guest's OTP session)
  // can connect Google / Microsoft; tokens live server-side, and the week view
  // shades the returned busy intervals. Everything below is a convenience
  // layer — a fetch failure just means no shading.
  const hasSession = suiteLoggedIn || verified
  const calClient = suiteLoggedIn ? suiteClient : supabase
  const [calStatus, setCalStatus] = useState<CalendarStatus | null>(null)
  const [calError, setCalError] = useState<string | null>(null)
  const [calBusy, setCalBusy] = useState<BusyInterval[]>([])
  const fetchedWeeksRef = useRef(new Set<string>())
  const lastWeekRef = useRef<Date | null>(null)

  const anyConnected = !!calStatus && (calStatus.google.connected || calStatus.microsoft.connected)
  const anyConfigured = !!calStatus && (calStatus.configured.google || calStatus.configured.microsoft)

  // Refs mirror the values the stable week-change callback needs — the picker
  // holds onto one callback identity, so it must read current state.
  const anyConnectedRef = useRef(anyConnected)
  anyConnectedRef.current = anyConnected
  const calClientRef = useRef(calClient)
  calClientRef.current = calClient

  useEffect(() => {
    if (!hasSession || !SUPABASE_CONFIGURED) return
    let live = true
    calendarStatus(calClient)
      .then((s) => { if (live) setCalStatus(s) })
      .catch(() => { /* feature stays hidden */ })
    return () => { live = false }
    // calClient is derived from suiteLoggedIn, which is already a dep.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasSession, suiteLoggedIn])

  // Guests without a session yet: all we need to know is whether any provider
  // is configured, to decide whether the verify-and-connect prompt exists.
  // (Their calendar can't connect until they verify — tokens key off a uid.)
  const [calProviders, setCalProviders] = useState<{ google: boolean; microsoft: boolean } | null>(null)
  useEffect(() => {
    if (hasSession || !SUPABASE_CONFIGURED) return
    let live = true
    calendarConfigured(supabase)
      .then((c) => { if (live) setCalProviders(c) })
      .catch(() => { /* prompt stays hidden */ })
    return () => { live = false }
  }, [hasSession])

  // The verify-your-email mini-flow inside the calendar prompt (guests only).
  // Reuses the same OTP the create step uses, just run earlier — so once it
  // succeeds, `verified` flips, the connect buttons appear, AND the eventual
  // create skips its own code step.
  const [calAuthPhase, setCalAuthPhase] = useState<'idle' | 'sending' | 'code' | 'verifying'>('idle')
  const [calCode, setCalCode] = useState('')

  async function calSendCode() {
    setCalError(null)
    if (!EMAIL_RE.test(email)) { setCalError('Enter a valid email address first.'); return }
    setCalAuthPhase('sending')
    try {
      await sendHostCode(email)
      setCalAuthPhase('code')
    } catch (e) {
      setCalError(messageOf(e))
      setCalAuthPhase('idle')
    }
  }

  async function calVerifyCode() {
    setCalError(null)
    if (!calCode.trim()) { setCalError('Enter the code from your email.'); return }
    setCalAuthPhase('verifying')
    try {
      await verifyHostCode(email, calCode)
      setVerified(true)
      setCalAuthPhase('idle')
      setCalCode('')
    } catch (e) {
      setCalError(messageOf(e))
      setCalAuthPhase('code')
    }
  }

  const onWeekChange = useCallback((weekStart: Date) => {
    lastWeekRef.current = weekStart
    if (!anyConnectedRef.current) return
    const key = weekStart.toDateString()
    if (fetchedWeeksRef.current.has(key)) return
    fetchedWeeksRef.current.add(key)
    fetchFreeBusy(calClientRef.current, weekStart.toISOString(), addLocalDays(weekStart, 7).toISOString())
      .then(({ busy, providers }) => {
        setCalBusy((prev) => [...prev, ...busy])
        // A failed provider read must not look like an empty calendar — say so.
        const failed: string[] = []
        if (providers.google === 'error') failed.push('Google')
        if (providers.microsoft === 'error') failed.push('Outlook')
        if (failed.length) {
          setCalError(`Couldn't read your ${failed.join(' and ')} calendar — the connection works, but the availability lookup failed. Try again shortly, or disconnect and reconnect.`)
        }
        if (providers.google === 'reconnect' || providers.microsoft === 'reconnect') {
          // The server dropped the dead grant; refresh so the row shows it.
          setCalError('A calendar connection has expired — please connect it again.')
          calendarStatus(calClientRef.current).then(setCalStatus).catch(() => {})
        }
      })
      .catch(() => { fetchedWeeksRef.current.delete(key) })
  }, [])

  // Once a calendar is (re)connected, backfill the week already on screen.
  useEffect(() => {
    if (anyConnected && lastWeekRef.current) onWeekChange(lastWeekRef.current)
  }, [anyConnected, onWeekChange])

  // The connect popup ends on our own static calendar-connected.html (the
  // edge function 302s it there), which postMessages back; refresh on success.
  useEffect(() => {
    function onMsg(e: MessageEvent) {
      if (e.origin !== window.location.origin) return
      const d = e.data as { type?: string; ok?: boolean } | null
      if (!d || d.type !== 'unisim-calendar') return
      if (d.ok) {
        setCalError(null)
        fetchedWeeksRef.current.clear()
        setCalBusy([])
        calendarStatus(calClientRef.current).then(setCalStatus).catch(() => {})
      } else {
        setCalError('Calendar connection was cancelled or failed.')
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [])

  async function connectCalendar(provider: CalendarProvider) {
    setCalError(null)
    try {
      const url = await startCalendarConnect(calClient, provider)
      const popup = window.open(url, 'unisim-calendar', 'width=540,height=680')
      if (!popup) setCalError('Your browser blocked the pop-up — allow pop-ups for this site and try again.')
    } catch (e) {
      setCalError(messageOf(e))
    }
  }

  async function disconnectCal(provider: CalendarProvider) {
    setCalError(null)
    try {
      await disconnectCalendar(calClient, provider)
      setCalBusy([])
      fetchedWeeksRef.current.clear()
      setCalStatus(await calendarStatus(calClient))
    } catch (e) {
      setCalError(messageOf(e))
    }
  }

  // Busy shading in the poll's timezone — the frame the grid's slots use.
  const busyByDay = useMemo(
    () => (anyConnected ? busySegmentsByDay(calBusy, timezone) : undefined),
    [anyConnected, calBusy, timezone],
  )

  const logoPreview = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile])
  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview) }, [logoPreview])

  // What the Logo control shows while overriding: a freshly picked file wins,
  // otherwise a logged-in host still has their account logo until they remove
  // it — so the preview matches what buildBranding will actually store.
  const orgLogoSrc = orgBranding.logo_url ?? orgBranding.icon_url
  const shownLogo = logoPreview ?? (suiteLoggedIn && !dropOrgLogo ? orgLogoSrc : null)

  // The picked file is shrunk in the browser at upload time (uploadPollLogo),
  // so a camera-sized original is fine — this gate only stops files so big
  // that decoding one would be the problem.
  // One small button in the branding row, so no drop target — but the SDK's
  // input resets its value, which is what makes picking the SAME logo again
  // (after a Remove, or after a rejected file) fire at all.
  const logoPicker = useFileDrop({
    onFiles: (files) => onPickLogo(files[0] ?? null),
    accept: 'image/png,image/jpeg,image/webp',
    multiple: false,
    clickToBrowse: false,
  })

  function onPickLogo(file: File | null) {
    setLogoErr(null)
    if (!file) { setLogoFile(null); return }
    if (!LOGO_TYPES.includes(file.type)) { setLogoErr('Logo must be a PNG, JPG or WebP image.'); return }
    if (file.size > MAX_LOGO_BYTES) { setLogoErr('Logo must be 10 MB or smaller.'); return }
    setLogoFile(file)
  }

  function changeView(next: SlotView) {
    if (next === view) return
    // Clear only when crossing the timed↔days boundary — those slot shapes
    // aren't interchangeable. Switching form↔calendar keeps the same slots.
    if ((next === 'days') !== (view === 'days')) setSlots([])
    setView(next)
  }

  function validateDraft(): string | null {
    if (!title.trim()) return 'Give your poll a title.'
    if (slots.length === 0) return mode === 'days' ? 'Add at least one day.' : 'Add at least one date and time.'
    if (!suiteLoggedIn && !EMAIL_RE.test(email)) return 'Enter a valid email address.'
    return null
  }

  function buildBranding(uploadedLogoUrl: string | null): PollBranding | null {
    // Signed in and happy with the import → brand from the account
    // ("My Company") as-is. If the account has no branding set, the poll
    // simply carries none.
    if (suiteLoggedIn && !brandOverride) {
      const hasOrgBranding = !!(org?.name || orgBranding.logo_url || orgBranding.icon_url || orgBranding.brand_color)
      if (!hasOrgBranding) return null
      return {
        source: 'org',
        name: org?.name ?? null,
        logo_url: orgBranding.logo_url,
        icon_url: orgBranding.icon_url,
        brand_color: orgBranding.brand_color,
      }
    }
    const name = brandName.trim() || null
    if (suiteLoggedIn) {
      // Overriding: a freshly uploaded logo wins, otherwise keep the account's
      // (unless the host explicitly removed it). Still `source: 'org'` — the
      // poll belongs to an account, it's just carrying per-poll overrides.
      const logo = uploadedLogoUrl ?? (dropOrgLogo ? null : orgBranding.logo_url)
      const icon = uploadedLogoUrl || dropOrgLogo ? null : orgBranding.icon_url
      if (!name && !logo && !icon) return null
      return { source: 'org', name, logo_url: logo, icon_url: icon, brand_color: hexOfTheme(theme) }
    }
    if (!name && !uploadedLogoUrl) return null
    return { source: 'guest', name, logo_url: uploadedLogoUrl, icon_url: null, brand_color: hexOfTheme(theme) }
  }

  function draft(branding: PollBranding | null): NewPoll {
    const expires_at =
      validityDays == null ? null : new Date(Date.now() + validityDays * 86_400_000).toISOString()
    return { id: shortId(), title, timezone, mode, slots, theme, branding, location: location.trim() || null, expires_at }
  }

  // `client` must be signed in as `hostUserId` (suite client for any Universal
  // ID user, app OTP client for guests) — RLS gates the insert and logo upload.
  async function doCreate(client: typeof suiteClient, hostUserId: string, hostEmail: string) {
    setPhase('creating')
    try {
      let logoUrl: string | null = null
      // A per-poll logo file is uploaded by guests, and by logged-in hosts who
      // are overriding their account logo for this poll. A logged-in host who
      // isn't overriding just carries their account logo URL — no upload.
      if (logoFile) logoUrl = await uploadPollLogo(client, hostUserId, logoFile)
      const pollDraft = draft(buildBranding(logoUrl))
      const poll = freeGated
        ? await createPollGated(client, pollDraft, hostEmail)
        : await createPoll(client, pollDraft, hostUserId, hostEmail)
      // The gated create RPC doesn't take a location, so set it as a follow-up
      // (the direct insert above already carries it). Non-fatal — the poll is
      // already created.
      if (freeGated && pollDraft.location) {
        try { await apiSetLocation(client, poll.id, pollDraft.location) } catch { /* poll still created */ }
      }
      // Response alerts are a follow-up update (keeps the create RPC/insert
      // untouched); non-fatal, since the poll itself is already created.
      if (notifyOnResponse) {
        try { await apiSetNotify(client, poll.id, true) } catch { /* poll still created */ }
      }
      setCreatedId(poll.id)
      setPhase('done')
    } catch (e) {
      setError(messageOf(e))
      setPhase('edit')
    }
  }

  async function onPrimary() {
    setError(null)
    const v = validateDraft()
    if (v) { setError(v); return }

    // Any Universal ID session (free, pro, enterprise): skip OTP — the suite
    // session is already authenticated.
    if (suiteLoggedIn && suiteUser) {
      await doCreate(suiteClient, suiteUser.id, suiteUser.email ?? '')
      return
    }

    if (!SUPABASE_CONFIGURED) {
      setError('Polling needs its Supabase backend configured to create polls.')
      return
    }
    // Returning guest with a live session → create straight away.
    const u = await currentUser()
    if (u && (verified || u.email === email)) {
      await doCreate(supabase, u.id, u.email ?? email)
      return
    }
    // Otherwise send a one-time code to the host's email.
    setPhase('sending')
    try {
      await sendHostCode(email)
      setPhase('code')
    } catch (e) {
      setError(messageOf(e))
      setPhase('edit')
    }
  }

  async function onVerify() {
    setError(null)
    if (!code.trim()) { setError('Enter the code from your email.'); return }
    setPhase('creating')
    try {
      const uid = await verifyHostCode(email, code)
      await doCreate(supabase, uid, email)
    } catch (e) {
      setError(messageOf(e))
      setPhase('code')
    }
  }

  if (phase === 'done' && createdId) {
    return <CreatedPanel pollBase={pollBase} id={createdId} theme={theme} />
  }

  return (
    <div
      data-theme={themeAttr(theme)}
      style={themeVars(theme)}
      className={`${CONTAINER_CREATE} py-8 sm:py-12`}
    >
      {diag && (
        <pre className="mb-4 overflow-auto rounded-lg bg-slate-900 p-3 text-left text-[11px] leading-relaxed text-green-300">
          {JSON.stringify({
            prod_cookieSSO: import.meta.env.PROD,
            userLoading,
            suiteUser: suiteUser?.email ?? null,
            orgLoading,
            orgsCount: orgs.length,
            activeOrg: org ? { id: org.id, name: org.name } : null,
            subLoading,
            subTier: subscription?.tier ?? null,
            subStatus: subscription?.status ?? null,
            enterprise,
            rawProbe: diagRaw,
          }, null, 2)}
        </pre>
      )}

      {/* Two columns from lg up: what & where + options on the left, the
          availability picker (calendar / date form / whole days) on the wider
          right. Below lg it stacks in DOM order. */}
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-7 pop-in lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:grid-rows-[auto_1fr] lg:gap-x-10">
        {/* Left column (top): what and where */}
        <div>
        {/* The page's masthead — app mark + tagline. It heads the left column
            rather than a centred hero above the card, so the form starts at
            the top of the viewport and the calendar sits alongside it. */}
        <div className="mb-6">
          <ProductLogo />
          <h1 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900">Find a time that works for everyone</h1>
        </div>

        {/* Title */}
        <label className="block">
          <span className="text-sm font-semibold text-slate-800">Poll title</span>
          <input
            type="text"
            value={title}
            maxLength={200}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Team catch-up — week of the 9th"
            className="mt-1.5 w-full h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>

        {/* Location / meeting link (whole-event, optional) */}
        <div className="mt-6">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">Location or meeting link <span className="font-normal text-slate-400">(optional)</span></span>
            <input
              type="text"
              value={location}
              maxLength={500}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Meeting room 5, or a Teams / Zoom / Meet link"
              className="mt-1.5 w-full h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
            />
          </label>
          <p className="mt-1 text-xs text-slate-500">Shown to everyone on the poll and added to the calendar invite.</p>
        </div>
        </div>

        {/* Availability (slots) — the right column from lg up */}
        <div className="mt-6 lg:mt-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
          <span className="text-sm font-semibold text-slate-800">Availability</span>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'days' ? (
              <>Respondents tick whole days they're free — good for trips and multi-day plans.</>
            ) : (
              <>Times are in <span className="font-medium">{tzAbbrev(timezone)}</span> ({timezone}). Change the timezone under More options.</>
            )}
          </p>
          <div className="mt-3">
            <SlotPicker
              view={view}
              onViewChange={changeView}
              slots={slots}
              onChange={setSlots}
              timezone={timezone}
              busyByDay={busyByDay}
              onWeekChange={onWeekChange}
            />
          </div>

          {/* Connect prompt beside the calendar itself — the overlay lives in
              this view, so the invitation belongs here, not only buried in
              More options (where the connected/disconnect rows stay). */}
          {view === 'calendar' && hasSession && calStatus && anyConfigured && !anyConnected && (
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2.5">
              <span className="text-xs text-slate-600">
                <span className="font-medium text-slate-700">See when you're already busy</span> — connect a calendar and your busy times shade the grid. Only you see them.
              </span>
              <span className="flex flex-wrap items-center gap-2">
                {calStatus.configured.google && (
                  <button
                    type="button"
                    onClick={() => connectCalendar('google')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Connect Google Calendar
                  </button>
                )}
                {calStatus.configured.microsoft && (
                  <button
                    type="button"
                    onClick={() => connectCalendar('microsoft')}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                  >
                    Connect Outlook
                  </button>
                )}
              </span>
            </div>
          )}
          {/* Guest (no session yet) variant: tokens key off a signed-in uid,
              so the same email OTP the create step runs happens here first —
              verify, and the connect buttons above take this prompt's place. */}
          {view === 'calendar' && !hasSession && (calProviders?.google || calProviders?.microsoft) && (
            <div className="mt-3 rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2.5">
              <span className="block text-xs text-slate-600">
                <span className="font-medium text-slate-700">See when you're already busy</span> — verify your email (the same one that saves your poll), then connect your calendar. Only you see the shading.
              </span>
              {calAuthPhase === 'code' || calAuthPhase === 'verifying' ? (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={calCode}
                    onChange={(e) => setCalCode(e.target.value)}
                    placeholder="123456"
                    className="h-9 w-28 rounded-lg border border-slate-300 px-2.5 text-xs tracking-widest text-slate-900 focus:border-[var(--accent)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={calVerifyCode}
                    disabled={calAuthPhase === 'verifying'}
                    className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-60"
                  >
                    {calAuthPhase === 'verifying' ? 'Verifying…' : 'Verify'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setCalAuthPhase('idle'); setCalCode('') }}
                    className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
                  >
                    Different email
                  </button>
                  <span className="basis-full text-[11px] text-slate-500">We emailed a 6-digit code to {email}.</span>
                </div>
              ) : (
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-9 w-56 max-w-full rounded-lg border border-slate-300 px-2.5 text-xs text-slate-900 focus:border-[var(--accent)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={calSendCode}
                    disabled={calAuthPhase === 'sending'}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-60"
                  >
                    {calAuthPhase === 'sending' ? 'Sending…' : 'Email me a code'}
                  </button>
                </div>
              )}
            </div>
          )}
          {view === 'calendar' && calError && (
            <p className="mt-2 text-xs text-red-600">{calError}</p>
          )}
        </div>

        {/* Left column (bottom): options + identity/create */}
        <div className="lg:col-start-1 lg:row-start-2">
        {/* More options */}
        <div className="mt-6 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={() => setShowMore((s) => !s)}
            aria-expanded={showMore}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-700 hover:text-[var(--accent-strong)]"
          >
            <svg viewBox="0 0 12 12" className={`w-3 h-3 transition-transform ${showMore ? 'rotate-90' : ''}`} aria-hidden="true">
              <path d="M4 2 L8 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            More options
          </button>

          {showMore && (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {/* Validity */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Link stays valid for</span>
                <select
                  value={String(validityDays)}
                  onChange={(e) => setValidityDays(e.target.value === 'null' ? null : Number(e.target.value))}
                  className="mt-2 w-full h-10 rounded-lg border border-slate-300 px-2 text-sm text-slate-900 focus:border-[var(--accent)] outline-none"
                >
                  {VALIDITY.map((v) => (
                    <option key={v.label} value={String(v.days)}>{v.label}</option>
                  ))}
                </select>
              </div>

              {/* Response alerts */}
              <div className="sm:col-span-2">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyOnResponse}
                    onChange={(e) => setNotifyOnResponse(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                  <span className="text-sm text-slate-700">
                    Email me when someone responds
                    {(() => {
                      const to = suiteLoggedIn ? (suiteUser?.email ?? '') : email.trim()
                      return to
                        ? <span className="block text-xs text-slate-500">We'll email <span className="font-medium">{to}</span> each time a new person responds.</span>
                        : <span className="block text-xs text-slate-500">We'll email you (at the address you verify below) each time a new person responds.</span>
                    })()}
                  </span>
                </label>
              </div>

              {/* Host calendar (free/busy overlay) — only offered once the
                  host has a session (the tokens key off their uid) and at
                  least one provider OAuth app is configured server-side. */}
              {hasSession && anyConfigured && calStatus && (
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Your calendar</span>
                  <p className="mt-1 text-xs text-slate-500">
                    Connect a calendar and the <span className="font-medium">Calendar</span> view shades the times you're already busy — availability only, we never see event names or details.
                  </p>
                  <div className="mt-2 flex flex-col gap-2">
                    {calStatus.configured.google && (
                      <CalendarProviderRow
                        label="Google Calendar"
                        connected={calStatus.google.connected}
                        email={calStatus.google.email}
                        onConnect={() => connectCalendar('google')}
                        onDisconnect={() => disconnectCal('google')}
                      />
                    )}
                    {calStatus.configured.microsoft && (
                      <CalendarProviderRow
                        label="Outlook / Microsoft 365"
                        connected={calStatus.microsoft.connected}
                        email={calStatus.microsoft.email}
                        onConnect={() => connectCalendar('microsoft')}
                        onDisconnect={() => disconnectCal('microsoft')}
                      />
                    )}
                  </div>
                  {calError && <p className="mt-2 text-xs text-red-600">{calError}</p>}
                </div>
              )}

              {/* Timezone (timed polls only) */}
              {mode === 'times' && (
                <div className="sm:col-span-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Timezone</span>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="mt-2 w-full h-10 rounded-lg border border-slate-300 px-2 text-sm text-slate-900 focus:border-[var(--accent)] outline-none"
                  >
                    {zones.map((z) => (
                      <option key={z} value={z}>{z}</option>
                    ))}
                  </select>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Identity + create */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          {freeGated && (
            <div className="mb-4 rounded-lg bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-800">
              <strong>1 token per poll.</strong> Free accounts can run one active poll at a time — your token is returned automatically when the poll expires or you delete it.
              {subscription && (
                <span className="ml-1 text-amber-700">
                  {pollFreeToken === 'available'
                    ? `(free token available${subscription.credits > 0 ? ` + ${subscription.credits} purchased` : ''})`
                    : `(${subscription.credits} token${subscription.credits !== 1 ? 's' : ''} available)`}
                </span>
              )}
            </div>
          )}

          {enterprise ? (
            <p className="text-sm text-slate-600">
              Creating as <span className="font-medium text-slate-900">{org?.name ?? suiteUser?.email}</span>
              {org?.name && suiteUser?.email && <span className="text-slate-500"> ({suiteUser.email})</span>} — no email verification needed.
            </p>
          ) : suiteLoggedIn ? (
            <p className="text-sm text-slate-600">
              Creating as <span className="font-medium text-slate-900">{suiteUser?.email}</span> — no email verification needed.
            </p>
          ) : verified ? (
            <p className="text-sm text-slate-600">
              Creating as <span className="font-medium text-slate-900">{email}</span> (verified).
            </p>
          ) : (
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Your email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={phase === 'code'}
                className="mt-1.5 w-full h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none disabled:bg-slate-50"
              />
            </label>
          )}

          {phase === 'code' && (
            <div className="mt-4 rounded-lg bg-[var(--accent-softer)] p-4">
              <label className="block text-sm font-medium text-slate-800">
                Enter the 6-digit code we emailed to {email}
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  className="mt-1.5 w-full h-11 rounded-lg border border-slate-300 px-3 tracking-widest text-slate-900 focus:border-[var(--accent)] outline-none"
                />
              </label>
              <button
                type="button"
                onClick={() => { setPhase('edit'); setCode('') }}
                className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
              >
                Use a different email
              </button>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <button
            type="button"
            onClick={phase === 'code' ? onVerify : onPrimary}
            disabled={phase === 'sending' || phase === 'creating'}
            className="mt-4 w-full h-12 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-60"
          >
            {phase === 'sending' && 'Sending code…'}
            {phase === 'creating' && 'Creating poll…'}
            {phase === 'code' && 'Verify & create poll'}
            {phase === 'edit' && 'Create poll'}
          </button>
        </div>
        </div>
      </div>

      {/* Branding box — a separate card beneath the create-poll form. Guests
          fill it in by hand; a logged-in host's account branding ("My Company")
          imports automatically and shows here read-only until they choose to
          override it for this one poll. */}
      <div className="mt-4 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <button
              type="button"
              onClick={() => setShowBranding((s) => !s)}
              aria-expanded={showBranding}
              className="group flex items-start gap-2 text-left"
            >
              <svg viewBox="0 0 12 12" className={`mt-1 w-3 h-3 shrink-0 text-slate-400 transition-transform ${showBranding ? 'rotate-90' : ''}`} aria-hidden="true">
                <path d="M4 2 L8 6 L4 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>
                <span className="block text-sm font-semibold text-slate-800 group-hover:text-[var(--accent-strong)]">Branding</span>
                <span className="block text-xs text-slate-500 mt-0.5">
                  {suiteLoggedIn
                    ? 'Imported from your account — override it for this poll if you like.'
                    : "Add your colour and logo to the poll's create and share pages."}
                </span>
              </span>
            </button>
            {!suiteLoggedIn && (
              <a href="https://app.unisim.co.uk/login" className="text-xs font-medium text-[var(--accent-strong)] hover:underline whitespace-nowrap">
                Sign in to import your branding →
              </a>
            )}
          </div>

          {/* Logged-in, not overriding: what the poll will carry, read-only. */}
          {showBranding && suiteLoggedIn && !brandOverride && (
            <div className="mt-4 flex flex-wrap items-center gap-4">
              {(orgBranding.logo_url || orgBranding.icon_url) && (
                <img
                  src={orgBranding.logo_url ?? orgBranding.icon_url ?? ''}
                  alt={org?.name ?? 'Account logo'}
                  className="h-10 max-w-[160px] rounded object-contain ring-1 ring-slate-200 bg-white"
                />
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">{org?.name ?? 'Your account'}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                  <span
                    className="inline-block h-3 w-3 rounded-full ring-1 ring-slate-300"
                    style={{ backgroundColor: hexOfTheme(theme) ?? undefined }}
                    aria-hidden="true"
                  />
                  {orgBranding.brand_color ? 'Account colour' : 'Default colour'}
                </p>
              </div>
              <button
                type="button"
                onClick={startBrandOverride}
                className="ml-auto rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Customise for this poll
              </button>
            </div>
          )}

          {showBranding && !(suiteLoggedIn && !brandOverride) && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {/* Booking-page colour */}
            <div className="sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking-page colour</span>
              <div className="mt-2 flex items-center gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.name}
                    type="button"
                    onClick={() => setTheme(t.name)}
                    aria-label={t.label}
                    aria-pressed={theme === t.name}
                    title={t.label}
                    className={`h-8 w-8 rounded-full ring-2 ring-offset-2 transition ${theme === t.name ? 'ring-slate-900' : 'ring-transparent hover:ring-slate-300'}`}
                    style={{ backgroundColor: t.swatch }}
                  />
                ))}
                {/* Custom colour: shows the chosen hex when active, else a + */}
                <button
                  type="button"
                  onClick={() => colorRef.current?.click()}
                  aria-label="Custom colour"
                  aria-pressed={isHexTheme(theme)}
                  title="Custom colour"
                  className={`grid h-8 w-8 place-items-center rounded-full transition ${isHexTheme(theme) ? 'ring-2 ring-offset-2 ring-slate-900 text-white' : 'border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400'}`}
                  style={isHexTheme(theme) ? { backgroundColor: theme } : undefined}
                >
                  {!isHexTheme(theme) && (
                    <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M8 3 V13 M3 8 H13" />
                    </svg>
                  )}
                </button>
                <input
                  ref={colorRef}
                  type="color"
                  value={isHexTheme(theme) ? theme : '#7c3aed'}
                  onChange={(e) => setTheme(e.target.value)}
                  className="sr-only"
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>
            </div>

            {/* Brand name */}
            <label className="block">
              <span className="text-xs font-medium text-slate-600">Brand name</span>
              <input
                type="text"
                value={brandName}
                maxLength={80}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g. Acme Adventures"
                className="mt-1 w-full h-10 rounded-lg border border-slate-300 px-3 text-sm text-slate-900 focus:border-[var(--accent)] outline-none"
              />
            </label>

            {/* Logo */}
            <div>
              <span className="text-xs font-medium text-slate-600">Logo</span>
              <div className="mt-1 flex items-center gap-3">
                {shownLogo && (
                  <img src={shownLogo} alt="Logo preview" className="h-10 w-10 rounded object-contain ring-1 ring-slate-200 bg-white" />
                )}
                <button
                  type="button"
                  onClick={logoPicker.open}
                  className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  {shownLogo ? 'Change…' : 'Upload…'}
                </button>
                {/* `hidden`, not `sr-only`: out of the label it had no
                    accessible name, and the button above is the control. */}
                <input {...logoPicker.inputProps} className="hidden" />
                {shownLogo && (
                  <button
                    type="button"
                    onClick={() => { onPickLogo(null); setDropOrgLogo(true) }}
                    className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
                  >
                    Remove
                  </button>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-400">PNG, JPG or WebP · large images are resized for you.</p>
              {logoErr && <p className="mt-1 text-xs text-red-600">{logoErr}</p>}
            </div>

            {/* A way back — overriding is per-poll, so reverting just drops the
                local edits and lets the account branding import again. */}
            {suiteLoggedIn && (
              <div className="sm:col-span-2 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setBrandOverride(false)
                    setDropOrgLogo(false)
                    onPickLogo(null)
                    setBrandName('')
                    if (orgBranding.brand_color && isHexTheme(orgBranding.brand_color)) setTheme(orgBranding.brand_color)
                  }}
                  className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2"
                >
                  Use my account branding instead
                </button>
              </div>
            )}
          </div>
          )}
      </div>
    </div>
  )
}

function CalendarProviderRow({
  label, connected, email, onConnect, onDisconnect,
}: {
  label: string
  connected: boolean
  email: string | null
  onConnect: () => void
  onDisconnect: () => void
}) {
  if (!connected) {
    return (
      <button
        type="button"
        onClick={onConnect}
        className="self-start rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
      >
        Connect {label}
      </button>
    )
  }
  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-700">
      <span className="font-medium">{label}</span>
      <span className="text-slate-500">connected{email ? ` as ${email}` : ''}</span>
      <button
        type="button"
        onClick={onDisconnect}
        className="text-slate-500 underline underline-offset-2 hover:text-slate-700"
      >
        Disconnect
      </button>
    </div>
  )
}

function CreatedPanel({ pollBase, id, theme }: { pollBase: string; id: string; theme: Theme }) {
  const url = `${window.location.origin}${pollBase}p/${id}`
  const [copied, setCopied] = useState(false)
  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the field is selectable as a fallback */
    }
  }
  return (
    <div data-theme={themeAttr(theme)} style={themeVars(theme)} className={`${CONTAINER_CREATE} py-12`}>
      {/* The container widened for the two-column create form; this success
          card keeps its original reading width inside it. */}
      <div className="mx-auto max-w-2xl rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-7 text-center pop-in">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-strong)]">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5 L10 17.5 L19 7" />
          </svg>
        </div>
        <h2 className="mt-4 text-xl font-extrabold text-slate-900">Your poll is live</h2>
        <p className="mt-1 text-slate-600">Share this link with everyone you want to invite.</p>
        <div className="mt-5 flex items-stretch gap-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="flex-1 h-11 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 bg-slate-50"
          />
          <button
            type="button"
            onClick={copy}
            className="h-11 px-4 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)]"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <a
          href={url}
          className="mt-4 inline-block text-sm font-medium text-[var(--accent-strong)] hover:underline underline-offset-2"
        >
          Open your poll →
        </a>
      </div>
    </div>
  )
}

function messageOf(e: unknown): string {
  if (e && typeof e === 'object' && 'message' in e) {
    const msg = String((e as { message: unknown }).message)
    if (msg.includes('free_poll_limit'))
      return 'You already have an active poll. Delete it first to create a new one, or upgrade to Pro for unlimited polls.'
    if (msg.includes('token_in_use:')) {
      const what = msg.split('token_in_use:')[1]?.trim() || 'an active poll'
      return `Your free Polling token is in use (${what}). Delete that poll to get it back, or purchase tokens at unisim.co.uk.`
    }
    if (msg.includes('no_credits'))
      return 'No tokens available — purchase tokens at unisim.co.uk to create a poll.'
    return msg
  }
  return 'Something went wrong. Please try again.'
}
