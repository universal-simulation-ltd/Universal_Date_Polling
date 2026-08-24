import { useEffect, useMemo, useState } from 'react'
import { useUser, useUniversal } from '@unisim/sdk'
import type { Availability, Poll, PollBranding, PollResponse, Slot } from '../lib/types'
import { bookSlot, BookingError, cancelBooking, currentUser, getPollResilient, getResponses, notifyPollHost, notifyRespondents, saveResponseEmail, setFinalSlot, signOut, submitResponse } from '../lib/api'
import { supabase } from '../lib/supabase'
import { themeAttr, themeVars } from '../lib/theme'
import {
  formatCalendarDay, formatDateHeading, formatRange, formatTime, localTimezone, sameCalendarDay, slotDayKey, slotInstant, tzAbbrev,
} from '../lib/time'
import { CONTAINER_POLL } from '../lib/layout'
import {
  addConfirmedTimeToCalendar, calendarStatus, removeConfirmedTimeFromCalendar, startCalendarConnect,
  type CalendarProvider, type CalendarStatus,
} from '../lib/hostCalendar'
import AddToCalendar from './AddToCalendar'
import CopyAsText from './CopyAsText'
import TimezonePicker from './TimezonePicker'

type Load = 'loading' | 'ready' | 'notfound' | 'error'

const NAME_KEY = 'unipoll:name'
const EMAIL_KEY = 'unipoll:email'
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** The host's "email respondents the confirmed time" action, tracked per page
 *  view. 'sent' carries how many addresses were actually emailed. */
type NotifyState =
  | { status: 'idle' }
  | { status: 'sending' }
  | { status: 'sent'; sent: number }
  | { status: 'error'; message: string }

/** The host's "add the confirmed time to my own calendar" action. 'stale' means
 *  the host is connected but only under the old free/busy grant, so the honest
 *  offer is "reconnect", not "try again". */
type CalWriteState =
  | { status: 'idle' }
  | { status: 'working' }
  | { status: 'added'; providers: CalendarProvider[] }
  | { status: 'removed' }
  | { status: 'stale' }
  | { status: 'error'; message: string }

const PROVIDER_LABEL: Record<CalendarProvider, string> = { google: 'Google Calendar', microsoft: 'Outlook' }

/** The guest's booking on a 1:1 page. 'booked' carries how the invite actually
 *  reached them, because that decides what the page can honestly promise: a
 *  provider-sent invitation arrives as a Google/Outlook invite with
 *  accept/decline, and our own .ics arrives as an attachment. */
type BookingState =
  | { status: 'idle' }
  | { status: 'booking' }
  | { status: 'booked'; viaCalendar: boolean; emailed: boolean }
  | { status: 'error'; message: string }

export default function PollPage({ id, pollBase }: { id: string; pollBase: string }) {
  const [state, setState] = useState<Load>('loading')
  const [poll, setPoll] = useState<Poll | null>(null)
  const [responses, setResponses] = useState<PollResponse[]>([])
  const [name, setName] = useState(() => localStorage.getItem(NAME_KEY) ?? '')
  const [email, setEmail] = useState(() => localStorage.getItem(EMAIL_KEY) ?? '')
  const [notifyState, setNotifyState] = useState<NotifyState>({ status: 'idle' })
  const [mine, setMine] = useState<Record<string, Availability | undefined>>({})
  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  // 1:1 booking pages (poll.booking_mode): the guest's own pick, and which slot
  // they chose while the page waits for the reload to catch up.
  const [booking, setBooking] = useState<BookingState>({ status: 'idle' })
  const [pickedSlot, setPickedSlot] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [calStatus, setCalStatus] = useState<CalendarStatus | null>(null)
  const [calWrite, setCalWrite] = useState<CalWriteState>({ status: 'idle' })
  // The timezone the viewer has chosen to see times in. Empty = the poll's own
  // timezone (the default). A viewer can switch to their own zone or any other,
  // and every time on the page re-renders in it — the slots' underlying instants
  // never change, only how they're displayed.
  const [displayTz, setDisplayTz] = useState('')

  const viewerTz = localTimezone()

  // Host detection. A poll's host authenticated either through the suite (a
  // Universal ID session, via the SDK client) or as a guest via email OTP (the
  // app's own client). Whoever's uid matches host_user_id is the host, and
  // their client is the one RLS will accept the "confirm slot" update on.
  const { user: suiteUser } = useUser()
  const { supabase: suiteClient } = useUniversal()
  const [otpUser, setOtpUser] = useState<{ id: string; email: string | null } | null>(null)
  useEffect(() => {
    currentUser().then(setOtpUser).catch(() => setOtpUser(null))
  }, [])

  async function handleSignOut() {
    await signOut()
    setOtpUser(null)
  }

  useEffect(() => {
    let live = true
    async function load() {
      setState('loading')
      setError(null)
      try {
        // Resilient fetch: the app's Supabase client can still be warming up on
        // the first navigation right after a poll is created, which used to
        // surface a transient error that only a manual refresh cleared. Retrying
        // the load removes the need for that refresh.
        const p = await getPollResilient(id)
        if (!live) return
        if (!p) { setState('notfound'); return }
        setPoll(p)
        setResponses(await getResponses(id))
        setState('ready')
      } catch (e) {
        if (!live) return
        setError(e instanceof Error ? e.message : 'Failed to load poll.')
        setState('error')
      }
    }
    load()
    return () => { live = false }
  }, [id, reloadKey])

  // The host's own calendar connections, so the confirmed banner can offer to
  // put the time in their diary. Host-only and best-effort — this is a
  // convenience on top of a page that must work for everyone, so a failure
  // leaves calStatus null and simply hides the control.
  useEffect(() => {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) { setCalStatus(null); return }
    let live = true
    calendarStatus(client)
      .then((s) => { if (live) setCalStatus(s) })
      .catch(() => { if (live) setCalStatus(null) })
    return () => { live = false }
    // suiteUser/otpUser decide which client (if any) hostClientFor returns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [poll?.id, suiteUser?.id, otpUser?.id])

  // Pre-fill the form if this browser has already responded under a known name.
  useEffect(() => {
    if (!poll || !name) return
    const existing = responses.find((r) => r.name.toLowerCase() === name.trim().toLowerCase())
    if (existing) setMine(existing.availability)
  }, [poll, responses, name])

  const expired = !!poll?.expires_at && new Date(poll.expires_at).getTime() < Date.now()

  function cycle(slotId: string, value: Availability) {
    setMine((m) => ({ ...m, [slotId]: m[slotId] === value ? undefined : value }))
  }

  async function save() {
    if (!poll) return
    setError(null)
    if (!name.trim()) { setError('Add your name so people know who you are.'); return }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look right — fix it or leave it blank.")
      return
    }
    const availability: Record<string, Availability> = {}
    for (const [k, v] of Object.entries(mine)) if (v) availability[k] = v
    // A brand-new responder (not this browser editing an existing entry) — used
    // to notify the host once per new person, not on every re-save.
    const isNewResponder = !responses.some((r) => r.name.trim().toLowerCase() === name.trim().toLowerCase())
    setSaving(true)
    try {
      await submitResponse(poll.id, name, availability)
      localStorage.setItem(NAME_KEY, name.trim())
      if (isNewResponder) void notifyPollHost(poll.id, name.trim())
      // The email row rides on the response row (RLS requires it to exist), so
      // this runs after the availability save. Its failure shouldn't read as
      // "your response wasn't saved" — it was — so it gets its own message.
      try {
        await saveResponseEmail(poll.id, name, email)
        localStorage.setItem(EMAIL_KEY, email.trim())
      } catch (e) {
        // Say WHY. This was a bare `catch {}`, and it swallowed the reason for
        // the whole life of migration 0115: every save failed with a privilege
        // error the user was never shown, so "try saving again" was advice
        // that could not work. The RPC raises sentences meant to be read.
        const why = e instanceof Error ? e.message.trim() : ''
        setError(`Your availability was saved, but your email couldn't be stored${why ? ` — ${why}` : ' — try saving again'}.`)
      }
      setResponses(await getResponses(poll.id))
      setSavedAt(Date.now())
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save your response.')
    } finally {
      setSaving(false)
    }
  }

  // The client to run a host-only write on: whichever session's uid matches the
  // poll's host. null for everyone else (so non-hosts never see host controls).
  function hostClientFor(p: Poll) {
    if (suiteUser?.id === p.host_user_id) return suiteClient
    if (otpUser && otpUser.id === p.host_user_id) return supabase
    return null
  }

  async function confirmSlot(slotId: string | null) {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    setError(null)
    setConfirming(true)
    try {
      await setFinalSlot(client, poll.id, slotId)
      setPoll({ ...poll, final_slot_id: slotId })
      // A different (or cleared) confirmation invalidates any "sent ✓" state
      // shown for the previous slot.
      setNotifyState({ status: 'idle' })
      // Un-confirming should take the event back out of the host's calendar —
      // leaving a diary entry for a time that is no longer the answer is worse
      // than never having added it. Best-effort and silent: the poll update
      // already succeeded, so a calendar hiccup must not read as a failed
      // un-confirm. Re-confirming a DIFFERENT slot needs no cleanup — the
      // server moves the existing event on the next add.
      if (slotId === null && calWrite.status === 'added') {
        setCalWrite({ status: 'idle' })
        void removeConfirmedTimeFromCalendar(client, poll.id).catch(() => {})
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not confirm the time.')
    } finally {
      setConfirming(false)
    }
  }

  /** The guest's booking on a 1:1 page: pick a slot, leave a name and an email,
   *  and it's confirmed there and then. Everything happens server-side in one
   *  call (book-poll-slot) — the claim on the slot and the invitations cannot
   *  come apart, because there is no client path to the first without the
   *  second. */
  async function book(slotId: string) {
    if (!poll) return
    if (!name.trim()) { setBooking({ status: 'error', message: 'Add your name so they know who they\u2019re meeting.' }); return }
    if (!EMAIL_RE.test(email.trim())) {
      setBooking({ status: 'error', message: 'Add the email address your invite should go to.' })
      return
    }
    setBooking({ status: 'booking' })
    try {
      const res = await bookSlot(poll.id, slotId, name, email)
      localStorage.setItem(NAME_KEY, name.trim())
      localStorage.setItem(EMAIL_KEY, email.trim())
      setPoll({ ...poll, final_slot_id: slotId, final_notified_slot_id: res.invitee ? slotId : poll.final_notified_slot_id })
      setBooking({ status: 'booked', viaCalendar: res.viaCalendar, emailed: res.invitee })
      // Pull the response row back so the banner can say who booked it rather
      // than a bare "Booked". Best-effort and after the state is already set —
      // the booking is done, and a failed refresh must not read as a failed
      // booking.
      try { setResponses(await getResponses(poll.id)) } catch { /* cosmetic */ }
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Could not book that time.'
      setBooking({ status: 'error', message })
      // Somebody got there first. Reload rather than leaving the page showing
      // times that can no longer be booked — the confirmed banner is the
      // honest view of a page that is now taken.
      if (e instanceof BookingError && e.code === 'already_booked') setReloadKey((k) => k + 1)
    }
  }

  /** Host-only: release a booked 1:1 page so it can be booked again, and tell
   *  the guest it's off. Distinct from un-confirming an ordinary poll, where
   *  nobody was ever promised anything. */
  async function cancelBookedTime() {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    setError(null)
    setConfirming(true)
    try {
      const { notified } = await cancelBooking(client, poll.id)
      setPoll({ ...poll, final_slot_id: null, final_notified_slot_id: null })
      setBooking({ status: 'idle' })
      setNotifyState({ status: 'idle' })
      setCalWrite({ status: 'idle' })
      setResponses(await getResponses(poll.id))
      // Cancelling deletes the guest's address — it is the only copy — so if
      // the email didn't go, nothing can send it later and the host is the only
      // one who can put it right. Saying so is not optional.
      if (!notified) {
        setError("The booking is cancelled and the page is open again — but we couldn't email your guest. Please let them know yourself.")
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not cancel that booking.')
    } finally {
      setConfirming(false)
    }
  }

  /** Host-only: email the confirmed time (+ .ics) to every respondent who left
   *  an address. Always an explicit click — confirming a slot never auto-sends,
   *  so a host trying out the button can't accidentally spam anyone. */
  async function emailRespondents() {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    setNotifyState({ status: 'sending' })
    try {
      const sent = await notifyRespondents(client, poll.id)
      setNotifyState({ status: 'sent', sent })
      if (sent > 0 && poll.final_slot_id) setPoll({ ...poll, final_notified_slot_id: poll.final_slot_id })
    } catch (e) {
      setNotifyState({ status: 'error', message: e instanceof Error ? e.message : 'Could not send the emails.' })
    }
  }

  /** Host-only: put the confirmed time in the host's own connected calendar(s).
   *  Always an explicit click — confirming a slot never silently writes to
   *  someone's diary. */
  async function addToMyCalendar() {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    setCalWrite({ status: 'working' })
    try {
      const res = await addConfirmedTimeToCalendar(client, poll.id)
      if (res.touched.length) {
        setCalWrite({ status: 'added', providers: res.touched })
        return
      }
      // Nothing was written. The one case worth its own message is a grant that
      // predates the write scope: "reconnect" is the fix, and "try again" isn't.
      const values = Object.values(res.providers)
      if (values.includes('read_only')) { setCalWrite({ status: 'stale' }); return }
      if (values.includes('reconnect')) {
        setCalWrite({ status: 'error', message: 'Your calendar connection expired — reconnect it on the create screen.' })
        void calendarStatus(client).then(setCalStatus).catch(() => {})
        return
      }
      setCalWrite({ status: 'error', message: "Couldn't add this to your calendar." })
    } catch (e) {
      setCalWrite({ status: 'error', message: e instanceof Error ? e.message : "Couldn't add this to your calendar." })
    }
  }

  /** Re-consent under the widened scopes, for a host connected read-only. Opens
   *  the same popup the create screen uses; on success the status is re-read so
   *  the button flips from "reconnect" to "add". */
  async function reconnectForWrite(provider: CalendarProvider) {
    if (!poll) return
    const client = hostClientFor(poll)
    if (!client) return
    try {
      // The one place that asks for the write grant. Everywhere else connects
      // read-only, so this is the only consent screen that mentions creating
      // events — and it appears only once a host has asked for exactly that.
      const url = await startCalendarConnect(client, provider, 'write')
      const popup = window.open(url, 'unisim-calendar', 'width=540,height=680')
      if (!popup) {
        setCalWrite({ status: 'error', message: 'Allow pop-ups for this site to reconnect your calendar.' })
        return
      }
      const onMessage = (e: MessageEvent) => {
        const d = e.data as { type?: string; ok?: boolean } | null
        if (!d || d.type !== 'unisim-calendar' || e.origin !== window.location.origin) return
        window.removeEventListener('message', onMessage)
        if (!d.ok) return
        setCalWrite({ status: 'idle' })
        void calendarStatus(client).then(setCalStatus).catch(() => {})
      }
      window.addEventListener('message', onMessage)
    } catch (e) {
      setCalWrite({ status: 'error', message: e instanceof Error ? e.message : 'Could not start the reconnect.' })
    }
  }

  if (state === 'loading') return <Centered>Loading poll…</Centered>
  if (state === 'notfound') return <NotFound pollBase={pollBase} />
  if (state === 'error' || !poll) return <LoadError message={error} onRetry={() => setReloadKey((k) => k + 1)} />


  const slots = [...poll.slots].sort((a, b) => a.start.localeCompare(b.start))
  const dayMode = poll.mode === 'days'
  // A 1:1 booking page rather than a poll: no availability grid, no tally, and
  // the guest's pick IS the confirmation.
  const isBooking = !!poll.booking_mode
  // The timezone times are actually displayed in: the viewer's choice, else the
  // poll's own zone. Instants are always anchored to the poll's zone; only the
  // display formatting follows `activeTz`.
  const activeTz = displayTz || poll.timezone
  // Only spell out a secondary "your time" line when the viewer isn't already
  // looking at their own zone (and the poll is timed).
  const tzNote = !dayMode && activeTz !== viewerTz
  // Anchor tz abbreviations to the first slot's instant, not "now" — a summer
  // page-view of a winter poll would otherwise label GMT times as BST.
  const anchor = slots.length ? slotInstant(slots[0].start, poll.timezone) : new Date()
  // The page we're on IS the shareable poll link — reuse it verbatim for the
  // "view or update the poll" line stamped into each calendar event.
  const pollUrl = window.location.origin + window.location.pathname

  const isHost = !!hostClientFor(poll)
  // Only the guest-OTP host gets a "signed in" indicator here — a suite user's
  // identity is already visible via the shared navbar's profile/avatar.
  const isOtpHost = !!otpUser && otpUser.id === poll.host_user_id
  const finalSlot = poll.final_slot_id ? slots.find((s) => s.id === poll.final_slot_id) ?? null : null

  return (
    <div data-theme={themeAttr(poll.theme)} style={themeVars(poll.theme)} className={`${CONTAINER_POLL} py-8 sm:py-10`}>
      {poll.branding && <BrandingHeader branding={poll.branding} />}
      <header className="text-center">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 break-words">{poll.title}</h1>
        <p className="mt-2 text-sm text-slate-600">
          {isBooking
            ? (poll.final_slot_id
                ? 'This time is booked.'
                : isHost
                  ? "Waiting for your guest to pick a time."
                  : "Pick the time that suits you \u2014 it's booked straight away.")
            : responses.length === 0 ? 'Be the first to respond.' : `${responses.length} ${responses.length === 1 ? 'person has' : 'people have'} responded.`}
          {!dayMode && (
            <>{' · '}Times in <span className="font-medium">{tzAbbrev(activeTz, anchor)}</span></>
          )}
        </p>
        {poll.location && <PollLocation location={poll.location} className="mt-3 justify-center" />}
      </header>

      {!dayMode && (
        <TimezoneBar
          pollTz={poll.timezone} activeTz={activeTz} viewerTz={viewerTz} at={anchor}
          onChange={setDisplayTz}
        />
      )}

      {finalSlot && (
        <ConfirmedBanner
          poll={poll} slot={finalSlot} pollUrl={pollUrl} viewerTz={viewerTz} activeTz={activeTz}
          dayMode={dayMode} isHost={isHost} confirming={confirming} isBooking={isBooking}
          bookedBy={isBooking ? (responses.find((r) => r.availability[finalSlot.id] === 'yes')?.name ?? null) : null}
          onUnconfirm={isBooking ? cancelBookedTime : () => confirmSlot(null)}
          notifyState={notifyState} onNotify={emailRespondents}
          calStatus={calStatus} calWrite={calWrite}
          onAddToMyCalendar={addToMyCalendar} onReconnectCalendar={reconnectForWrite}
        />
      )}
      {/* The host's only notification channel is email, so a send that failed is
          invisible to them unless the page says so. Host-only: the guest was
          already told at booking time by the response's own flags. */}
      {isHost && finalSlot && poll.booking_notify_failed && (
        <BookingNotifyBanner
          which={poll.booking_notify_failed}
          guest={isBooking ? (responses.find((r) => r.availability[finalSlot.id] === 'yes')?.name ?? null) : null}
        />
      )}
      {isBooking && booking.status === 'booked' && (
        <div className="mt-3 rounded-xl bg-white ring-1 ring-slate-200 px-4 py-3 text-sm text-slate-700">
          <span className="font-semibold text-slate-900">You're booked in.</span>{' '}
          {booking.viaCalendar
            ? <>A calendar invitation is on its way to <span className="font-medium">{email.trim()}</span> — accept it and the meeting lands in your calendar.</>
            : booking.emailed
              ? <>We've emailed the invite to <span className="font-medium">{email.trim()}</span> — open the attachment to add it to your calendar.</>
              : <>We couldn't email you a copy just now, so add it to your calendar from the button above — the time itself is booked.</>}
        </div>
      )}
      {isHost && !finalSlot && !isBooking && responses.length > 0 && (
        <p className="mt-5 text-center text-sm text-slate-500">
          You're the host — pick the final time below with <span className="font-medium text-slate-700">Confirm this time</span>, and everyone with the link will see it.
        </p>
      )}
      {isHost && !finalSlot && isBooking && !expired && (
        <p className="mt-5 text-center text-sm text-slate-500">
          This is a booking page. Send the link to one person — whichever time they pick is booked immediately, and you'll both get a calendar invite.
        </p>
      )}

      {/* Host-only: chase the people who haven't clicked the link. Uses
          `activeTz` rather than the poll's zone so the pasted list reads the
          same as the page it was copied from. */}
      {isHost && !expired && !(isBooking && finalSlot) && (
        <section className="mt-5 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-4 sm:p-5">
          <CopyAsText poll={poll} url={pollUrl} displayTz={activeTz} />
        </section>
      )}

      {isOtpHost && otpUser?.email && (
        <p className="mt-3 text-center text-xs text-slate-400">
          Signed in as <span className="font-medium text-slate-500">{otpUser.email}</span> —{' '}
          <button type="button" onClick={handleSignOut} className="underline underline-offset-2 hover:text-slate-600">
            Sign out
          </button>
        </p>
      )}

      {expired && (
        <div className="mt-6 rounded-lg bg-amber-50 text-amber-800 ring-1 ring-amber-200 px-4 py-3 text-sm">
          This poll's link has expired — it's read-only now.
        </div>
      )}

      {/* Book (1:1 pages) — the guest's pick settles it, so there is no grid and
          no save-then-wait. Hidden from the host: a host booking their own page
          would be scheduling a meeting with themselves. */}
      {isBooking && !expired && !finalSlot && !isHost && (
        <BookingPanel
          poll={poll} slots={slots} dayMode={dayMode} activeTz={activeTz} viewerTz={viewerTz} tzNote={tzNote}
          name={name} email={email} onName={setName} onEmail={setEmail}
          picked={pickedSlot} onPick={setPickedSlot}
          state={booking} onBook={book}
        />
      )}
      {isBooking && !finalSlot && isHost && (
        <OfferedTimes poll={poll} slots={slots} dayMode={dayMode} activeTz={activeTz} viewerTz={viewerTz} tzNote={tzNote} />
      )}

      {/* Respond */}
      {!expired && !isBooking && (
        <section className="mt-7 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 pop-in">
          <h2 className="text-base font-bold text-slate-900">
            {dayMode ? 'Are you free on these days?' : 'Are you free at these times?'}
          </h2>
          <div className="mt-3 flex flex-col sm:flex-row gap-3">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Your name</span>
              <input
                type="text"
                value={name}
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sam"
                className="mt-1 w-full sm:w-72 h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Your email <span className="font-normal text-slate-400">(optional)</span></span>
              <input
                type="email"
                value={email}
                maxLength={320}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1 w-full sm:w-72 h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
              />
            </label>
          </div>
          <p className="mt-1.5 text-xs text-slate-500">
            Leave your email and you'll get the final date (with a calendar invite) once the host confirms it. It's never shown to other respondents.
          </p>

          <div className="mt-4 space-y-4">
            {groupByDay(slots).map(([day, list]) => (
              <div key={day}>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {dayMode ? formatCalendarDay(day) : formatDateHeading(slotInstant(list[0].start, poll.timezone), activeTz)}
                </div>
                <div className="mt-2 space-y-2">
                  {list.map((s) => {
                    const inst = slotInstant(s.start, poll.timezone)
                    const v = mine[s.id]
                    return (
                      <div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 px-3 py-2">
                        <div className="min-w-0">
                          <div className="text-sm font-medium text-slate-900">{dayMode ? 'All day' : formatRange(inst, s.durationMins, activeTz)}</div>
                          {tzNote && <div className="text-xs text-slate-500">{viewerTimeNote(formatTime(inst, viewerTz), inst, activeTz, viewerTz)}</div>}
                        </div>
                        <div className="flex shrink-0 gap-1.5">
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'yes')}
                            aria-pressed={v === 'yes'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'yes' ? 'bg-[var(--accent)] text-white ring-[var(--accent)]' : 'bg-white text-slate-700 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            Yes 👍
                          </button>
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'maybe')}
                            aria-pressed={v === 'maybe'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'maybe' ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] ring-[var(--accent)]' : 'bg-white text-slate-500 ring-slate-300 hover:ring-[var(--accent)]'}`}
                          >
                            If need be
                          </button>
                          <button
                            type="button"
                            onClick={() => cycle(s.id, 'no')}
                            aria-pressed={v === 'no'}
                            className={`h-9 px-3 rounded-md text-sm font-medium ring-1 transition ${v === 'no' ? 'bg-rose-600 text-white ring-rose-600' : 'bg-white text-slate-500 ring-slate-300 hover:ring-rose-400'}`}
                          >
                            No 🙅‍♀️
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          <div className="mt-5 flex items-center gap-3">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="h-11 px-5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save my availability'}
            </button>
            {savedAt && <span className="text-sm text-green-600">Saved — thanks!</span>}
          </div>
        </section>
      )}

      {/* Results. A booking page has none: one person picks one time, and the
          confirmed banner above already says which. */}
      {!isBooking && (
      <Results
        poll={poll} slots={slots} responses={responses} viewerTz={viewerTz} activeTz={activeTz} pollUrl={pollUrl}
        isHost={isHost} confirming={confirming} finalSlotId={poll.final_slot_id}
        onConfirm={confirmSlot}
      />
      )}
    </div>
  )
}

/** A slot as one selectable row on a booking page. Shared by the guest's picker
 *  and the host's read-only preview so the two can't drift apart in wording. */
function SlotLine({ poll, slot, dayMode, activeTz, viewerTz, tzNote }: {
  poll: Poll; slot: Slot; dayMode: boolean; activeTz: string; viewerTz: string; tzNote: boolean
}) {
  const inst = slotInstant(slot.start, poll.timezone)
  return (
    <>
      <div className="text-sm font-medium text-slate-900">
        {dayMode ? formatCalendarDay(slotDayKey(slot)) : `${formatDateHeading(inst, activeTz)} · ${formatRange(inst, slot.durationMins, activeTz)}`}
      </div>
      {tzNote && <div className="text-xs text-slate-500">{viewerTimeNote(formatTime(inst, viewerTz), inst, activeTz, viewerTz)}</div>}
    </>
  )
}

/** The 1:1 booking page's whole interaction: pick one time, say who you are,
 *  and it is booked. Deliberately NOT a two-step wizard — a handful of times
 *  and two fields fit on one screen, and the guest can see what they are
 *  committing to at the moment they commit to it.
 *
 *  The email is required here, unlike the optional address on an ordinary poll:
 *  the promise of this page is that an invite arrives, and there is nowhere to
 *  send one without it. */
function BookingPanel({ poll, slots, dayMode, activeTz, viewerTz, tzNote, name, email, onName, onEmail, picked, onPick, state, onBook }: {
  poll: Poll; slots: Slot[]; dayMode: boolean; activeTz: string; viewerTz: string; tzNote: boolean
  name: string; email: string; onName: (v: string) => void; onEmail: (v: string) => void
  picked: string | null; onPick: (id: string | null) => void
  state: BookingState; onBook: (slotId: string) => void
}) {
  const busy = state.status === 'booking'
  return (
    <section className="mt-7 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 pop-in">
      <h2 className="text-base font-bold text-slate-900">
        {dayMode ? 'Pick a day' : 'Pick a time'}
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Whichever you choose is booked straight away — there's nothing else to send back.
      </p>

      <div className="mt-4 space-y-2">
        {slots.map((slot) => {
          const chosen = picked === slot.id
          return (
            <button
              key={slot.id}
              type="button"
              onClick={() => onPick(chosen ? null : slot.id)}
              aria-pressed={chosen}
              disabled={busy}
              className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition disabled:opacity-60 ${
                chosen
                  ? 'border-[var(--accent)] bg-[var(--accent-softer)] ring-1 ring-[var(--accent)]'
                  : 'border-slate-200 hover:border-[var(--accent)]'
              }`}
            >
              <span
                aria-hidden="true"
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${chosen ? 'border-[var(--accent)]' : 'border-slate-300'}`}
              >
                {chosen && <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />}
              </span>
              <span className="min-w-0">
                <SlotLine poll={poll} slot={slot} dayMode={dayMode} activeTz={activeTz} viewerTz={viewerTz} tzNote={tzNote} />
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex flex-col sm:flex-row gap-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Your name</span>
          <input
            type="text"
            value={name}
            maxLength={120}
            onChange={(e) => onName(e.target.value)}
            placeholder="e.g. Sam"
            className="mt-1 w-full sm:w-72 h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Your email</span>
          <input
            type="email"
            value={email}
            maxLength={320}
            onChange={(e) => onEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full sm:w-72 h-11 rounded-lg border border-slate-300 px-3 text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </label>
      </div>
      <p className="mt-1.5 text-xs text-slate-500">
        Your calendar invite goes here. It's only ever used for this booking.
      </p>

      {state.status === 'error' && <p className="mt-3 text-sm text-red-600">{state.message}</p>}

      <div className="mt-5">
        <button
          type="button"
          onClick={() => picked && onBook(picked)}
          disabled={busy || !picked}
          className="h-11 px-5 rounded-xl bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-strong)] disabled:opacity-60"
        >
          {busy ? 'Booking…' : picked ? `Book ${dayMode ? 'this day' : 'this time'}` : `Pick a ${dayMode ? 'day' : 'time'} above`}
        </button>
      </div>
    </section>
  )
}

/** What the host sees on their own un-booked booking page: the times they are
 *  offering, read-only. No confirm buttons — confirming is the guest's job here,
 *  and a host who wants a different set of times makes a new page. */
function OfferedTimes({ poll, slots, dayMode, activeTz, viewerTz, tzNote }: {
  poll: Poll; slots: Slot[]; dayMode: boolean; activeTz: string; viewerTz: string; tzNote: boolean
}) {
  return (
    <section className="mt-7 rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-900">{dayMode ? "Days you're offering" : "Times you're offering"}</h2>
      <div className="mt-3 space-y-2">
        {slots.map((slot) => (
          <div key={slot.id} className="rounded-xl border border-slate-200 px-3 py-2.5">
            <SlotLine poll={poll} slot={slot} dayMode={dayMode} activeTz={activeTz} viewerTz={viewerTz} tzNote={tzNote} />
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * "A booking was made but we couldn't email you."
 *
 * Amber rather than rose, and the first sentence always says the booking is
 * real: the failure here is a DELIVERY failure, and a red banner over a held
 * slot reads as "your booking broke" — which would send the host chasing a
 * problem that does not exist while missing the one that does.
 */
function BookingNotifyBanner({ which, guest }: { which: 'host' | 'invitee' | 'both'; guest: string | null }) {
  const who = guest ?? 'your guest'
  return (
    <div
      role="status"
      className="mt-3 rounded-lg bg-amber-50 text-amber-900 ring-1 ring-amber-200 px-4 py-3 text-sm"
    >
      <span className="font-semibold">This time is booked — but an email didn't get through.</span>{' '}
      {which === 'both' ? (
        <>Neither you nor <span className="font-medium">{who}</span> was emailed about it. The time is held either
        way, so it's worth contacting them directly to confirm it.</>
      ) : which === 'invitee' ? (
        <>We couldn't email <span className="font-medium">{who}</span>, so they may not know it's confirmed. The
        time is held — contacting them directly is the reliable fix.</>
      ) : (
        <><span className="font-medium">{who}</span> was emailed and has the details, but our copy to you bounced.
        Check the address on your account if you'd expected it.</>
      )}
    </div>
  )
}

function Results({ poll, slots, responses, viewerTz, activeTz, pollUrl, isHost, confirming, finalSlotId, onConfirm }: {
  poll: Poll; slots: Slot[]; responses: PollResponse[]; viewerTz: string; activeTz: string; pollUrl: string
  isHost: boolean; confirming: boolean; finalSlotId: string | null
  onConfirm: (slotId: string | null) => void
}) {
  const tally = useMemo(() => {
    return slots.map((s) => {
      const yes = responses.filter((r) => r.availability[s.id] === 'yes').map((r) => r.name)
      const maybe = responses.filter((r) => r.availability[s.id] === 'maybe').map((r) => r.name)
      const no = responses.filter((r) => r.availability[s.id] === 'no').map((r) => r.name)
      return { slot: s, yes, maybe, no }
    })
  }, [slots, responses])

  const maxYes = Math.max(0, ...tally.map((t) => t.yes.length))
  const total = responses.length
  const dayMode = poll.mode === 'days'
  const tzNote = !dayMode && activeTz !== viewerTz

  return (
    <section className="mt-7">
      <h2 className="text-base font-bold text-slate-900 px-1">Results so far</h2>
      {total === 0 ? (
        <p className="mt-2 px-1 text-sm text-slate-500">No responses yet — share the link to get started.</p>
      ) : (
        <div className="mt-3 space-y-4">
          {groupByDay(slots).map(([day, list]) => (
            <div key={day} className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {dayMode ? formatCalendarDay(day) : formatDateHeading(slotInstant(list[0].start, poll.timezone), activeTz)}
              </div>
              <div className="divide-y divide-slate-100">
                {list.map((s) => {
                  const t = tally.find((x) => x.slot.id === s.id)!
                  const inst = slotInstant(s.start, poll.timezone)
                  const heat = total > 0 ? t.yes.length / total : 0
                  const best = t.yes.length > 0 && t.yes.length === maxYes
                  const isFinal = finalSlotId === s.id
                  return (
                    <div key={s.id} className={`px-4 py-3 ${isFinal ? 'bg-emerald-50/60' : ''}`}>
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-sm font-semibold text-slate-900">{dayMode ? 'All day' : formatRange(inst, s.durationMins, activeTz)}</span>
                          {tzNote && <span className="ml-2 text-xs text-slate-500">{viewerTimeNote(formatTime(inst, viewerTz), inst, activeTz, viewerTz)}</span>}
                          {isFinal && (
                            <span className="ml-2 inline-block rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-bold text-white align-middle">✓ Confirmed</span>
                          )}
                          {best && !isFinal && (
                            <span className="ml-2 inline-block rounded-full bg-[var(--accent)] px-2 py-0.5 text-[11px] font-bold text-white align-middle">Best</span>
                          )}
                        </div>
                        <div className="shrink-0 text-sm text-slate-600">
                          <span className="font-semibold text-slate-900">{t.yes.length}</span>
                          {t.maybe.length > 0 && <span className="text-slate-400"> · {t.maybe.length} maybe</span>}
                          {t.no.length > 0 && <span className="text-slate-400"> · {t.no.length} not free</span>}
                        </div>
                      </div>
                      <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                        <div className="heat-cell h-2 rounded-full" style={{ width: `${Math.max(heat * 100, t.yes.length ? 6 : 0)}%`, ['--heat' as string]: '1' }} />
                      </div>
                      {(t.yes.length > 0 || t.maybe.length > 0 || t.no.length > 0) && (
                        <p className="mt-1.5 text-xs text-slate-500">
                          {t.yes.length > 0 && <span className="text-[var(--accent-text)] font-medium">{t.yes.join(', ')}</span>}
                          {t.maybe.length > 0 && <span> {t.yes.length > 0 ? '· ' : ''}maybe: {t.maybe.join(', ')}</span>}
                          {t.no.length > 0 && <span> {t.yes.length > 0 || t.maybe.length > 0 ? '· ' : ''}not free: {t.no.join(', ')}</span>}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-end gap-2">
                        {isHost && !isFinal && (
                          <button
                            type="button"
                            onClick={() => onConfirm(s.id)}
                            disabled={confirming}
                            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-50 hover:ring-emerald-400 transition disabled:opacity-60"
                          >
                            ✓ Confirm this time
                          </button>
                        )}
                        {isHost && isFinal && (
                          <button
                            type="button"
                            onClick={() => onConfirm(null)}
                            disabled={confirming}
                            className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-700 transition disabled:opacity-60"
                          >
                            Unconfirm
                          </button>
                        )}
                        <AddToCalendar poll={poll} slot={s} pollUrl={pollUrl} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

/** The prominent "Confirmed" banner shown to everyone once the host has picked
 *  a final slot — the chosen date/time plus an "Add to calendar" for it. */
function ConfirmedBanner({ poll, slot, pollUrl, viewerTz, activeTz, dayMode, isHost, confirming, isBooking, bookedBy, onUnconfirm, notifyState, onNotify, calStatus, calWrite, onAddToMyCalendar, onReconnectCalendar }: {
  poll: Poll; slot: Slot; pollUrl: string; viewerTz: string; activeTz: string; dayMode: boolean
  isHost: boolean; confirming: boolean
  /** A 1:1 booking rather than a host-confirmed poll slot. Changes what
   *  "Change" means: there is a real person holding this time, so it warns
   *  first and the cancellation is sent for them. */
  isBooking: boolean
  /** Who booked it, on a booking page. */
  bookedBy: string | null
  onUnconfirm: () => void
  notifyState: NotifyState; onNotify: () => void
  calStatus: CalendarStatus | null; calWrite: CalWriteState
  onAddToMyCalendar: () => void; onReconnectCalendar: (provider: CalendarProvider) => void
}) {
  // Memoize the formatter chain: `inst` and the `when` label each run several
  // Intl.DateTimeFormat passes, and the banner re-renders on every poll refresh.
  // The confirmed time is shown in the viewer's active display zone.
  const { inst, when } = useMemo(() => {
    const i = slotInstant(slot.start, poll.timezone)
    return {
      inst: i,
      when: dayMode
        ? formatCalendarDay(slot.start)
        : `${formatDateHeading(i, activeTz)} · ${formatRange(i, slot.durationMins, activeTz)} ${tzAbbrev(activeTz, i)}`,
    }
  }, [slot.start, slot.durationMins, poll.timezone, activeTz, dayMode])
  const tzNote = !dayMode && activeTz !== viewerTz
  // Whether THIS confirmed slot has already been announced by email (stamped
  // server-side after a successful send, so it survives reloads).
  const alreadyNotified = poll.final_notified_slot_id === slot.id
  const sending = notifyState.status === 'sending'

  // The host's own calendars. `connected` providers split into those that can
  // be written to and those still on the old free/busy-only grant; a host with
  // no connection at all sees nothing here (the create screen is where you
  // connect one, and nagging on a finished poll would be noise).
  const connected = (['google', 'microsoft'] as CalendarProvider[]).filter((p) => calStatus?.[p].connected)
  const writable = connected.filter((p) => calStatus?.[p].writable)
  const staleOnly = connected.length > 0 && writable.length === 0
  return (
    <div className="mt-6 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 px-5 py-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            {isBooking ? (bookedBy ? `✓ Booked by ${bookedBy}` : '✓ Booked') : '✓ Confirmed time'}
          </div>
          <div className="mt-0.5 text-lg font-bold text-slate-900 break-words">{when}</div>
          {tzNote && <div className="text-xs text-slate-500">{viewerTimeNote(formatRange(inst, slot.durationMins, viewerTz), inst, activeTz, viewerTz)}</div>}
          {poll.location && <PollLocation location={poll.location} className="mt-1.5" />}
        </div>
        <div className="flex items-center gap-2">
          {isHost && (
            <button
              type="button"
              onClick={() => {
                // Un-confirming a poll disappoints nobody — the slot was never
                // promised. Cancelling a BOOKING takes a meeting out of
                // somebody's diary, so it asks first and says who it affects.
                if (isBooking && !window.confirm(
                  `Cancel this booking?\n\n${bookedBy ? bookedBy : 'Your guest'} will be emailed to say it's off, and the page opens for them to pick another time.`,
                )) return
                onUnconfirm()
              }}
              disabled={confirming}
              className="rounded-md px-2 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200 hover:bg-white hover:text-slate-700 transition disabled:opacity-60"
            >
              {confirming ? 'Working…' : 'Change'}
            </button>
          )}
          <AddToCalendar poll={poll} slot={slot} pollUrl={pollUrl} />
        </div>
      </div>
      {isHost && (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-emerald-200/70 pt-3">
          <button
            type="button"
            onClick={onNotify}
            disabled={sending}
            className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-white hover:ring-emerald-400 transition disabled:opacity-60"
          >
            ✉️ {sending
              ? 'Sending…'
              : isBooking
                ? 'Resend the confirmation'
                : alreadyNotified || notifyState.status === 'sent' ? 'Email respondents again' : 'Email respondents this time'}
          </button>
          <span className="text-xs text-slate-600">
            {notifyState.status === 'sent' && (
              notifyState.sent > 0
                ? `Sent to ${notifyState.sent} ${notifyState.sent === 1 ? 'person' : 'people'} ✓`
                : 'No one has left an email address yet.'
            )}
            {notifyState.status === 'error' && <span className="text-red-600">{notifyState.message}</span>}
            {notifyState.status === 'idle' && (
              isBooking
                ? `${bookedBy ?? 'Your guest'} was emailed the invite when they booked ✓`
                : alreadyNotified
                  ? 'Respondents have been emailed ✓'
                  : 'Sends the confirmed date and a calendar invite to everyone who left an email.'
            )}
          </span>
        </div>
      )}

      {/* The host's own-calendar control, hidden on a booking page: booking it
          already put the event in their diary (or emailed them a .ics), so the
          button could only ever re-send an event that is already there — and a
          plain re-add carries no attendees, which would quietly patch the
          guest's invitation without telling them. The "Add to calendar" menu
          above is still there for everyone. */}
      {isHost && !isBooking && connected.length > 0 && (
        <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-emerald-200/70 pt-2.5">
          {writable.length > 0 ? (
            <button
              type="button"
              onClick={onAddToMyCalendar}
              disabled={calWrite.status === 'working'}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-white hover:ring-emerald-400 transition disabled:opacity-60"
            >
              📅 {calWrite.status === 'working'
                ? 'Adding…'
                : calWrite.status === 'added'
                  ? 'Update it in my calendar'
                  : `Add to my ${writable.length === 1 ? PROVIDER_LABEL[writable[0]] : 'calendars'}`}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onReconnectCalendar(connected[0])}
              className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-white hover:ring-emerald-400 transition"
            >
              📅 Reconnect {PROVIDER_LABEL[connected[0]]} to add it
            </button>
          )}
          <span className="text-xs text-slate-600">
            {calWrite.status === 'added' && (
              `Added to ${calWrite.providers.map((p) => PROVIDER_LABEL[p]).join(' and ')} ✓`
            )}
            {calWrite.status === 'stale' && (
              'Your calendar was connected for availability only — reconnect it once to allow adding events.'
            )}
            {calWrite.status === 'error' && <span className="text-red-600">{calWrite.message}</span>}
            {(calWrite.status === 'idle' || calWrite.status === 'working' || calWrite.status === 'removed') && (
              staleOnly
                ? 'Connected for availability only. One reconnect lets this put the time straight in your diary.'
                : 'Puts this time in your own calendar. Safe to click twice — it updates the same event.'
            )}
          </span>
        </div>
      )}
    </div>
  )
}

/** Whether a location string is a clickable http(s) link (a Teams / Zoom / Meet
 *  URL) rather than a physical place ("Meeting room 5"). */
function isUrlLike(s: string): boolean {
  return /^https?:\/\/\S+$/i.test(s.trim())
}

/** The poll's event location: a link icon + the value, rendered as an anchor for
 *  a meeting URL, or plain text for a physical place. */
function PollLocation({ location, className = '' }: { location: string; className?: string }) {
  const isLink = isUrlLike(location)
  return (
    <div className={`flex items-center gap-1.5 text-sm text-slate-600 ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      {isLink ? (
        <a href={location} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate font-medium text-[var(--accent-text)] hover:underline underline-offset-2">
          {location}
        </a>
      ) : (
        <span className="min-w-0 break-words font-medium text-slate-700">{location}</span>
      )}
    </div>
  )
}

/** Tells the viewer which timezone the poll's times are in, and lets them
 *  re-render every time on the page in their own zone (one click) or any other
 *  zone (searchable picker). */
function TimezoneBar({ pollTz, activeTz, viewerTz, at, onChange }: {
  pollTz: string; activeTz: string; viewerTz: string; at: Date
  onChange: (tz: string) => void
}) {
  const viewingOwn = activeTz === viewerTz
  const viewingPoll = activeTz === pollTz
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-slate-500">
      <span>
        This poll is in <span className="font-medium text-slate-700">{tzAbbrev(pollTz, at)}</span>
        <span className="text-slate-400"> ({pollTz})</span>.
      </span>
      {viewerTz !== pollTz && !viewingOwn && (
        <button
          type="button"
          onClick={() => onChange(viewerTz)}
          className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-medium text-[var(--accent-text)] hover:bg-[var(--accent-softer)]"
        >
          Show times in your timezone ({tzAbbrev(viewerTz, at)})
        </button>
      )}
      <TimezonePicker value={activeTz} at={at} onChange={onChange} />
      {!viewingPoll && (
        <button
          type="button"
          onClick={() => onChange(pollTz)}
          className="text-xs text-slate-500 underline underline-offset-2 hover:text-slate-700"
        >
          Reset to poll's timezone
        </button>
      )}
    </div>
  )
}

function BrandingHeader({ branding }: { branding: PollBranding }) {
  const img = branding.logo_url ?? branding.icon_url
  if (!img && !branding.name) return null
  return (
    <div className="mb-5 flex items-center justify-center gap-2.5">
      {img && <img src={img} alt={branding.name ?? 'Brand'} className="h-9 max-w-[200px] object-contain" />}
      {branding.name && (
        <span className={`font-semibold ${img ? 'text-sm text-slate-700' : 'text-lg text-[var(--accent-text)]'}`}>{branding.name}</span>
      )}
    </div>
  )
}

/** "10:00 your time" — prefixed with the viewer-local DATE ("Thu 11 Jun,
 *  10:00 your time") whenever the slot falls on a different calendar day in
 *  the viewer's zone than in the currently-displayed zone. Without the prefix, a
 *  slot late in the displayed evening reads as the wrong day for a viewer further
 *  east — for a confirmed meeting that's a missed-by-a-day bug. */
function viewerTimeNote(timeText: string, inst: Date, displayTz: string, viewerTz: string): string {
  const prefix = sameCalendarDay(inst, displayTz, viewerTz) ? '' : `${formatDateHeading(inst, viewerTz)}, `
  return `${prefix}${timeText} your time`
}

function groupByDay(slots: Slot[]): [string, Slot[]][] {
  const groups = new Map<string, Slot[]>()
  for (const s of slots) {
    const day = slotDayKey(s)
    if (!groups.has(day)) groups.set(day, [])
    groups.get(day)!.push(s)
  }
  return [...groups.entries()]
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md px-4 py-20 text-center text-slate-500">{children}</div>
}

/** Shown when a poll fails to load (network hiccup, backend warming up on the
 *  first navigation right after creation). The load already auto-retries; this
 *  gives a one-click retry so the visitor never has to hard-refresh the page. */
function LoadError({ message, onRetry }: { message: string | null; onRetry: () => void }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-slate-900">Couldn't load this poll</h1>
      <p className="mt-2 text-slate-600">{message ?? 'Something went wrong.'}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 inline-flex h-11 items-center rounded-xl bg-orange-700 px-5 font-semibold text-white hover:bg-orange-800"
      >
        Try again
      </button>
    </div>
  )
}

function NotFound({ pollBase }: { pollBase: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-xl font-bold text-slate-900">Poll not found</h1>
      <p className="mt-2 text-slate-600">This poll may have been removed, or the link is wrong.</p>
      <a href={pollBase} className="mt-4 inline-block text-sm font-medium text-orange-700 hover:underline">Create a new poll →</a>
    </div>
  )
}
