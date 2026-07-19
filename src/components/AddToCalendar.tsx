import { useEffect, useRef, useState } from 'react'
import type { Poll, Slot } from '../lib/types'
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from '../lib/calendar'

/** A compact "Add to calendar" control shown on each result slot: opens a small
 *  menu with Google / Outlook deep-links and an .ics download (Apple Calendar,
 *  Outlook desktop, and everything else import .ics). Manages its own open
 *  state and closes on outside-click or Escape. */
export default function AddToCalendar({ poll, slot, pollUrl }: { poll: Poll; slot: Slot; pollUrl: string }) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDocClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDocClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <div ref={wrapRef} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--accent-text)] ring-1 ring-slate-200 hover:ring-[var(--accent)] hover:bg-[var(--accent-soft)] transition"
      >
        <CalendarIcon />
        Add to calendar
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-1.5 w-52 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 pop-in"
        >
          <MenuItem onClick={() => openExternal(googleCalendarUrl(poll, slot, pollUrl))}>
            Google Calendar
          </MenuItem>
          <MenuItem onClick={() => openExternal(outlookCalendarUrl(poll, slot, pollUrl))}>
            Outlook
          </MenuItem>
          <MenuItem onClick={() => { downloadIcs(poll, slot, pollUrl); setOpen(false) }}>
            Apple / other (.ics)
          </MenuItem>
        </div>
      )}
    </div>
  )
}

function MenuItem({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
    >
      {children}
    </button>
  )
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  )
}
