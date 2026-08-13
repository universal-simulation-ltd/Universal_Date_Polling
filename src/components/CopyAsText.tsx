import { useMemo, useState } from 'react'
import { buildPollTextList, type TextListPoll } from '../lib/textExport'

/** "Copy a list for an email" — the poll's dates as plain text, for hosts whose
 *  invitees would rather read the options in the message than click a link.
 *
 *  The textarea is deliberately real and readOnly rather than a styled preview:
 *  when `navigator.clipboard` is blocked (an insecure origin, a permissions
 *  policy, a browser that wants a gesture we've already spent), select-all still
 *  works and the feature degrades to "highlight this and copy it". */
export default function CopyAsText({ poll, url, displayTz, defaultOpen = false }: {
  poll: TextListPoll
  /** The poll's public link, offered by the "Include the link" checkbox. */
  url: string
  /** Timezone to write the times in; defaults to the poll's own. */
  displayTz?: string
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const [includeLink, setIncludeLink] = useState(true)
  const [copied, setCopied] = useState(false)

  const text = useMemo(
    () => buildPollTextList(poll, { includeLink, url, displayTz }),
    [poll, includeLink, url, displayTz],
  )
  // Fit the box to the text, within reason — a three-slot poll shouldn't get a
  // half-empty scroller, and a thirty-slot one shouldn't push the page over.
  const rows = Math.min(18, Math.max(7, text.split('\n').length + 1))

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — the textarea above is selectable as a fallback */
    }
  }

  return (
    <div className="text-left">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="text-sm font-medium text-[var(--accent-strong)] hover:underline underline-offset-2"
      >
        {open ? 'Hide the email text' : 'Copy a list for an email →'}
      </button>

      {open && (
        <div className="mt-3">
          <p className="text-xs text-slate-500">
            Paste this straight into an email for anyone who'd rather reply than click.
          </p>
          <textarea
            readOnly
            value={text}
            rows={rows}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-2 w-full resize-y rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-xs leading-relaxed text-slate-700"
          />
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={includeLink}
                onChange={(e) => setIncludeLink(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-[var(--accent)] focus:ring-[var(--accent-soft)]"
              />
              Include the link to the poll
            </label>
            <button
              type="button"
              onClick={copy}
              className="h-10 px-4 rounded-lg bg-[var(--accent)] text-white text-sm font-semibold hover:bg-[var(--accent-strong)]"
            >
              {copied ? 'Copied!' : 'Copy text'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
