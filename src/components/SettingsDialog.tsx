import { useEffect, useId, useRef } from 'react'

/**
 * The modal the Actions → App Settings row opens.
 *
 * A dialog rather than a fold on the page, and rather than a settings route:
 * the options it holds belong to the poll the host is part-way through writing,
 * so they have to open OVER that draft and hand it straight back — a route
 * would unmount the half-finished form, and a fold is the "More options"
 * disclosure this replaced.
 *
 * Only the shell lives here (the backdrop, Escape, the scroll lock, the
 * heading). What goes inside is the caller's, because the settings are the
 * caller's state.
 */
export default function SettingsDialog({ title, description, onClose, children }: {
  title: string
  description?: string
  onClose: () => void
  children: React.ReactNode
}) {
  const headingId = useId()
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape closes, wherever focus is — including in a <select> the host has
  // just given up on. Bound to the document rather than the panel so it works
  // before anything inside has been focused.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  // The page behind must not scroll under the dialog: on a phone the settings
  // list is the taller of the two, and a backdrop that scrolls the create form
  // away means closing the dialog somewhere else entirely.
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [])

  // Focus moves into the dialog so a keyboard (or screen reader) carries on
  // inside it rather than in the form underneath. The panel itself takes the
  // focus, not the first control: this opens on a heading, and landing on a
  // checkbox reads as though something has already been chosen.
  useEffect(() => { panelRef.current?.focus() }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/40 p-0 sm:items-center sm:p-6"
      // A click on the BACKDROP closes; one that started inside and drifted out
      // (a drag across a slider or a select) must not, hence the target check.
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
        tabIndex={-1}
        className="pop-in max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white shadow-xl outline-none ring-1 ring-slate-200 sm:max-h-[86vh] sm:rounded-2xl"
      >
        {/* The heading stays put while the settings scroll under it — this list
            is long enough on a phone to lose its title otherwise. */}
        <div className="sticky top-0 z-10 flex items-start gap-3 border-b border-slate-100 bg-white/95 px-5 py-4 backdrop-blur sm:px-7">
          <div className="min-w-0 flex-1">
            <h2 id={headingId} className="text-base font-extrabold text-slate-900">{title}</h2>
            {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="-mr-1 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              <path d="M5 5 L15 15 M15 5 L5 15" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-5 sm:px-7">{children}</div>

        {/* Nothing to save: every control writes straight to the draft, so this
            is a way out, not a commit. Labelled as such. */}
        <div className="sticky bottom-0 border-t border-slate-100 bg-white/95 px-5 py-3 backdrop-blur sm:px-7">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
