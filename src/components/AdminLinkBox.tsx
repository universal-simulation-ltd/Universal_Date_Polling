import { useState } from 'react'

/** A poll's private admin link with a Copy button: on the "live" panel right
 *  after creating a poll, and on the poll page for its host on this device. */
export default function AdminLinkBox({ url, hasEmail }: { url: string; hasEmail: boolean }) {
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
    <div className="mt-6 rounded-xl bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-900 p-4 text-left">
      <p className="text-sm font-semibold text-amber-900 dark:text-amber-200">Your private admin link</p>
      <p className="mt-1 text-xs text-amber-900 dark:text-amber-200">
        {hasEmail
          ? "Keep this one to yourself. It opens the poll's admin page on any device where you've confirmed the same email address, so you can confirm a time, change the poll or delete it there."
          : "Keep this one to yourself — anyone who has it can manage the poll: confirm a time, change it or delete it. Save it somewhere safe: it's the only way to manage the poll from another device, or here if this browser's data is cleared."}
      </p>
      <div className="mt-3 flex items-stretch gap-2">
        <input
          readOnly
          value={url}
          aria-label="Private admin link"
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 h-10 rounded-lg border border-amber-300 dark:border-amber-800 px-3 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={copy}
          className="h-10 px-3 rounded-lg ring-1 ring-amber-300 dark:ring-amber-800 bg-white dark:bg-slate-900 text-sm font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
