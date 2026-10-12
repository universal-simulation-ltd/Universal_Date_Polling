import { useState } from 'react'

/** A respondent's own edit link with a Copy button, under their saved answer.
 *  Quieter than AdminLinkBox: it unlocks one person's answers, not the poll. */
export default function EditLinkBox({ url }: { url: string }) {
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
    <div className="mt-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 ring-1 ring-slate-200 dark:ring-slate-700 p-4 text-left">
      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Your edit link</p>
      <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
        This device can change these answers. To change them from another device, open this link there. Keep it
        to yourself: anyone who has it can change or remove your answers.
      </p>
      <div className="mt-3 flex items-stretch gap-2">
        <input
          readOnly
          value={url}
          aria-label="Your edit link"
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 min-w-0 h-10 rounded-lg border border-slate-300 dark:border-slate-700 px-3 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
        />
        <button
          type="button"
          onClick={copy}
          className="h-10 px-3 rounded-lg ring-1 ring-slate-300 dark:ring-slate-700 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
