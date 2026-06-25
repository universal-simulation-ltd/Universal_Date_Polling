import { useEffect, useMemo, useRef, useState } from 'react'
import { useOrg, useOrgBranding, useSubscription, useUniversal, useUser } from '@unisim/sdk'
import type { NewPoll, PollBranding, PollMode, Slot, Theme } from '../lib/types'
import { isHexTheme, THEMES } from '../lib/types'
import { hexOfTheme, themeAttr, themeVars } from '../lib/theme'
import { createPoll, currentUser, sendHostCode, shortId, uploadPollLogo, verifyHostCode } from '../lib/api'
import { SUPABASE_CONFIGURED, supabase } from '../lib/supabase'
import { listTimezones, localTimezone, tzAbbrev } from '../lib/time'
import SlotPicker from './SlotPicker'
import type { SlotView } from './SlotPicker'

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

type Phase = 'edit' | 'sending' | 'code' | 'creating' | 'done'

export default function CreatePoll({ pollBase }: { pollBase: string }) {
  const [title, setTitle] = useState('')
  // `view` drives the slot picker's segmented selector; the stored poll `mode`
  // is derived from it (only "Whole days" is a days poll).
  const [view, setView] = useState<SlotView>('form')
  const mode: PollMode = view === 'days' ? 'days' : 'times'
  const [slots, setSlots] = useState<Slot[]>([])
  const [theme, setTheme] = useState<Theme>('orange')
  const [timezone, setTimezone] = useState(localTimezone())
  const [validityDays, setValidityDays] = useState<number | null>(30)
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)

  // Guest branding (More options); ignored for enterprise hosts.
  const [brandName, setBrandName] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoErr, setLogoErr] = useState<string | null>(null)

  const [showMore, setShowMore] = useState(false)
  const [phase, setPhase] = useState<Phase>('edit')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const colorRef = useRef<HTMLInputElement>(null)
  const zones = listTimezones()

  // --- Enterprise detection via the suite SDK (cookie SSO in production) ------
  const { user: suiteUser } = useUser()
  const { subscription } = useSubscription()
  const { org } = useOrg()
  const orgBranding = useOrgBranding()
  const { supabase: suiteClient } = useUniversal()
  const enterprise =
    !!suiteUser &&
    subscription?.tier === 'enterprise' &&
    (subscription.status === 'active' || subscription.status === 'trialing')

  // An enterprise poll defaults to the org's brand colour (the host can still
  // change it). Run once when enterprise status resolves.
  useEffect(() => {
    if (enterprise && orgBranding.brand_color && isHexTheme(orgBranding.brand_color)) {
      setTheme(orgBranding.brand_color)
    }
  }, [enterprise, orgBranding.brand_color])

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

  const logoPreview = useMemo(() => (logoFile ? URL.createObjectURL(logoFile) : null), [logoFile])
  useEffect(() => () => { if (logoPreview) URL.revokeObjectURL(logoPreview) }, [logoPreview])

  function onPickLogo(file: File | null) {
    setLogoErr(null)
    if (!file) { setLogoFile(null); return }
    if (!LOGO_TYPES.includes(file.type)) { setLogoErr('Logo must be a PNG, JPG or WebP image.'); return }
    if (file.size > 2 * 1024 * 1024) { setLogoErr('Logo must be 2 MB or smaller.'); return }
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
    if (!enterprise && !EMAIL_RE.test(email)) return 'Enter a valid email address.'
    return null
  }

  function buildBranding(uploadedLogoUrl: string | null): PollBranding | null {
    if (enterprise) {
      return {
        source: 'org',
        name: org?.name ?? null,
        logo_url: orgBranding.logo_url,
        icon_url: orgBranding.icon_url,
        brand_color: orgBranding.brand_color,
      }
    }
    const name = brandName.trim() || null
    if (!name && !uploadedLogoUrl) return null
    return { source: 'guest', name, logo_url: uploadedLogoUrl, icon_url: null, brand_color: hexOfTheme(theme) }
  }

  function draft(branding: PollBranding | null): NewPoll {
    const expires_at =
      validityDays == null ? null : new Date(Date.now() + validityDays * 86_400_000).toISOString()
    return { id: shortId(), title, timezone, mode, slots, theme, branding, expires_at }
  }

  // `client` must be signed in as `hostUserId` (suite client for enterprise,
  // app OTP client for guests) — RLS gates the insert and the logo upload.
  async function doCreate(client: typeof suiteClient, hostUserId: string, hostEmail: string) {
    setPhase('creating')
    try {
      let logoUrl: string | null = null
      if (!enterprise && logoFile) logoUrl = await uploadPollLogo(client, hostUserId, logoFile)
      const poll = await createPoll(client, draft(buildBranding(logoUrl)), hostUserId, hostEmail)
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

    // Enterprise host: no email step — create straight away as the suite user.
    if (enterprise && suiteUser) {
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
      className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12"
    >
      {enterprise && <BrandingBanner name={org?.name ?? null} logo={orgBranding.logo_url} icon={orgBranding.icon_url} />}

      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Find a time that works for everyone</h1>
        <p className="mt-2 text-slate-600">
          Pick some {mode === 'days' ? 'days' : 'dates and times'}, share the link, and watch the best option rise to the top. No sign-up needed to vote.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-7 pop-in">
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

        {/* Availability (slots) */}
        <div className="mt-6">
          <span className="text-sm font-semibold text-slate-800">Availability</span>
          <p className="text-xs text-slate-500 mt-0.5">
            {mode === 'days' ? (
              <>Respondents tick whole days they're free — good for trips and multi-day plans.</>
            ) : (
              <>Times are in <span className="font-medium">{tzAbbrev(timezone)}</span> ({timezone}). Change the timezone under More options.</>
            )}
          </p>
          <div className="mt-3">
            <SlotPicker view={view} onViewChange={changeView} slots={slots} onChange={setSlots} />
          </div>
        </div>

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
              {/* Theme + custom colour */}
              <div>
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

              {/* Guest branding (enterprise hosts use their org branding instead) */}
              {!enterprise && (
                <div className="sm:col-span-2 rounded-lg bg-slate-50 ring-1 ring-slate-200 p-4">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add your branding</span>
                  <p className="text-xs text-slate-500 mt-0.5">Shown on the poll's create and share pages.</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
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
                    <div>
                      <span className="text-xs font-medium text-slate-600">Logo</span>
                      <div className="mt-1 flex items-center gap-3">
                        {logoPreview && (
                          <img src={logoPreview} alt="Logo preview" className="h-10 w-10 rounded object-contain ring-1 ring-slate-200 bg-white" />
                        )}
                        <label className="cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50">
                          {logoFile ? 'Change…' : 'Upload…'}
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={(e) => onPickLogo(e.target.files?.[0] ?? null)}
                            className="sr-only"
                          />
                        </label>
                        {logoFile && (
                          <button type="button" onClick={() => onPickLogo(null)} className="text-xs text-slate-500 hover:text-slate-700 underline underline-offset-2">
                            Remove
                          </button>
                        )}
                      </div>
                      <p className="mt-1 text-[11px] text-slate-400">PNG, JPG or WebP · up to 2 MB.</p>
                      {logoErr && <p className="mt-1 text-xs text-red-600">{logoErr}</p>}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Identity + create */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          {enterprise ? (
            <p className="text-sm text-slate-600">
              Creating as <span className="font-medium text-slate-900">{org?.name ?? suiteUser?.email}</span>
              {org?.name && suiteUser?.email && <span className="text-slate-500"> ({suiteUser.email})</span>} — no email verification needed.
            </p>
          ) : verified ? (
            <p className="text-sm text-slate-600">
              Creating as <span className="font-medium text-slate-900">{email}</span> (verified).
            </p>
          ) : (
            <label className="block">
              <span className="text-sm font-semibold text-slate-800">Your email</span>
              <span className="text-xs text-slate-500 ml-2">— we send a one-time code to confirm it's you</span>
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
            {phase === 'edit' && (enterprise || verified ? 'Create poll' : 'Verify email & create poll')}
          </button>
        </div>
      </div>
    </div>
  )
}

function BrandingBanner({ name, logo, icon }: { name: string | null; logo: string | null; icon: string | null }) {
  const img = logo ?? icon
  if (!img && !name) return null
  return (
    <div className="mb-6 flex items-center justify-center gap-3">
      {img && <img src={img} alt={name ?? 'Brand'} className="h-9 max-w-[180px] object-contain" />}
      {!img && name && <span className="text-lg font-bold text-[var(--accent-text)]">{name}</span>}
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
    <div data-theme={themeAttr(theme)} style={themeVars(theme)} className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-12">
      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-7 text-center pop-in">
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
  if (e && typeof e === 'object' && 'message' in e) return String((e as { message: unknown }).message)
  return 'Something went wrong. Please try again.'
}
