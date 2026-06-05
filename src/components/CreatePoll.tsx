import { useEffect, useState } from 'react'
import type { NewPoll, Slot, ThemeName } from '../lib/types'
import { THEMES } from '../lib/types'
import { createPoll, currentUser, sendHostCode, shortId, verifyHostCode } from '../lib/api'
import { SUPABASE_CONFIGURED } from '../lib/supabase'
import { listTimezones, localTimezone, tzAbbrev } from '../lib/time'
import SlotPicker from './SlotPicker'

const VALIDITY = [
  { label: '7 days', days: 7 },
  { label: '30 days', days: 30 },
  { label: '90 days', days: 90 },
  { label: 'Never expires', days: null as number | null },
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type Phase = 'edit' | 'sending' | 'code' | 'creating' | 'done'

export default function CreatePoll({ pollBase }: { pollBase: string }) {
  const [title, setTitle] = useState('')
  const [slots, setSlots] = useState<Slot[]>([])
  const [theme, setTheme] = useState<ThemeName>('orange')
  const [timezone, setTimezone] = useState(localTimezone())
  const [validityDays, setValidityDays] = useState<number | null>(30)
  const [email, setEmail] = useState('')
  const [verified, setVerified] = useState(false)

  const [showMore, setShowMore] = useState(false)
  const [phase, setPhase] = useState<Phase>('edit')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const zones = listTimezones()

  // A returning host already has a session — skip the email step.
  useEffect(() => {
    if (!SUPABASE_CONFIGURED) return
    currentUser().then((u) => {
      if (u?.email) {
        setEmail(u.email)
        setVerified(true)
      }
    })
  }, [])

  function validateDraft(): string | null {
    if (!title.trim()) return 'Give your poll a title.'
    if (slots.length === 0) return 'Add at least one date and time.'
    if (!EMAIL_RE.test(email)) return 'Enter a valid email address.'
    return null
  }

  function draft(): NewPoll {
    const expires_at =
      validityDays == null ? null : new Date(Date.now() + validityDays * 86_400_000).toISOString()
    return { id: shortId(), title, timezone, slots, theme, expires_at }
  }

  async function doCreate(hostUserId: string, hostEmail: string) {
    setPhase('creating')
    try {
      const poll = await createPoll(draft(), hostUserId, hostEmail)
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
    if (v) {
      setError(v)
      return
    }
    if (!SUPABASE_CONFIGURED) {
      setError('Polling needs its Supabase backend configured to create polls.')
      return
    }
    // Already verified (session present) → create straight away.
    const u = await currentUser()
    if (u && (verified || u.email === email)) {
      await doCreate(u.id, u.email ?? email)
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
    if (!code.trim()) {
      setError('Enter the code from your email.')
      return
    }
    setPhase('creating')
    try {
      const uid = await verifyHostCode(email, code)
      await doCreate(uid, email)
    } catch (e) {
      setError(messageOf(e))
      setPhase('code')
    }
  }

  if (phase === 'done' && createdId) {
    return <CreatedPanel pollBase={pollBase} id={createdId} theme={theme} />
  }

  return (
    <div data-theme={theme} className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Find a time that works for everyone</h1>
        <p className="mt-2 text-slate-600">
          Pick some dates and times, share the link, and watch the best slot rise to the top. No sign-up needed to vote.
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

        {/* Slots */}
        <div className="mt-6">
          <span className="text-sm font-semibold text-slate-800">Candidate times</span>
          <p className="text-xs text-slate-500 mt-0.5">
            Times are in <span className="font-medium">{tzAbbrev(timezone)}</span> ({timezone}). Change the timezone under More options.
          </p>
          <div className="mt-3">
            <SlotPicker slots={slots} onChange={setSlots} />
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
              {/* Theme */}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Booking-page colour</span>
                <div className="mt-2 flex gap-2">
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

              {/* Timezone */}
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
            </div>
          )}
        </div>

        {/* Email + create */}
        <div className="mt-6 border-t border-slate-100 pt-5">
          {verified ? (
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
            {(phase === 'edit') && (verified ? 'Create poll' : 'Verify email & create poll')}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreatedPanel({ pollBase, id, theme }: { pollBase: string; id: string; theme: ThemeName }) {
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
    <div data-theme={theme} className="mx-auto w-full max-w-2xl px-4 sm:px-6 py-12">
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
