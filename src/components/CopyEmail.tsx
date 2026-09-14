import { useEffect, useMemo, useState } from 'react'
import type { Slot } from '../lib/types'
import { buildConfirmedEmail, type ConfirmedEmailPoll } from '../lib/confirmedEmail'
import SettingsDialog from './SettingsDialog'

/** "Copy email" on a confirmed poll: the confirmation email, previewed, for a
 *  host who would rather send it from their own mailbox than have us send it.
 *
 *  Three fields with a copy button each, because a mail client takes To,
 *  Subject and the message as three separate pastes. The message is editable
 *  here so a host can say it their way before copying — but it resets when the
 *  dialog is reopened, since the confirmed time it describes may have changed.
 *
 *  Real inputs rather than styled text, for the same reason as `CopyAsText`:
 *  when the clipboard API is refused, select-and-copy still works. */
export default function CopyEmail({ poll, slot, url, displayTz, recipients, recipientsLoading }: {
  poll: ConfirmedEmailPoll
  slot: Slot
  url: string
  displayTz: string
  /** Every address respondents left — the same people "Email respondents"
   *  sends to. Empty when nobody left one. */
  recipients: string[]
  recipientsLoading: boolean
}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-white hover:ring-emerald-400 transition"
      >
        📋 Copy email
      </button>
      {open && (
        <CopyEmailDialog
          poll={poll} slot={slot} url={url} displayTz={displayTz}
          recipients={recipients} recipientsLoading={recipientsLoading}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function CopyEmailDialog({ poll, slot, url, displayTz, recipients, recipientsLoading, onClose }: {
  poll: ConfirmedEmailPoll; slot: Slot; url: string; displayTz: string
  recipients: string[]; recipientsLoading: boolean
  onClose: () => void
}) {
  const draft = useMemo(() => buildConfirmedEmail(poll, slot, { url, displayTz }), [poll, slot, url, displayTz])
  const [subject, setSubject] = useState(draft.subject)
  const [body, setBody] = useState(draft.body)
  const to = recipients.join(', ')

  return (
    <SettingsDialog
      title="Copy the confirmation email"
      description="Send it from your own email, and change anything you like first."
      onClose={onClose}
    >
      <div className="space-y-4">
        <Field label="To" copyText={to} disabled={!to}>
          {recipientsLoading ? (
            <p className="text-sm text-slate-500">Loading addresses…</p>
          ) : to ? (
            <input
              readOnly
              value={to}
              onFocus={(e) => e.currentTarget.select()}
              className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            />
          ) : (
            <p className="text-sm text-slate-500">
              Nobody left an email address, so add your own recipients in your email app.
            </p>
          )}
        </Field>

        <Field label="Subject" copyText={subject}>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </Field>

        <Field label="Message" copyText={body} primary>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={Math.min(16, Math.max(8, body.split('\n').length + 1))}
            className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm leading-relaxed text-slate-900 focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)] outline-none"
          />
        </Field>
      </div>
    </SettingsDialog>
  )
}

/** A labelled field with its own Copy button in the label row. */
function Field({ label, copyText, disabled = false, primary = false, children }: {
  label: string; copyText: string; disabled?: boolean; primary?: boolean; children: React.ReactNode
}) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(t)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(copyText)
      setCopied(true)
    } catch {
      /* clipboard blocked — the field itself is selectable as a fallback */
    }
  }

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <button
          type="button"
          onClick={copy}
          disabled={disabled}
          className={primary
            ? 'h-9 rounded-lg bg-[var(--accent)] px-3.5 text-sm font-semibold text-white hover:bg-[var(--accent-strong)] disabled:opacity-50'
            : 'h-8 rounded-md px-2.5 text-xs font-medium text-[var(--accent-text)] ring-1 ring-slate-200 hover:ring-[var(--accent)] disabled:opacity-50'}
        >
          {copied ? 'Copied!' : primary ? 'Copy message' : 'Copy'}
        </button>
      </div>
      {children}
    </div>
  )
}
