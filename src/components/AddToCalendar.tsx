import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { Poll, Slot } from '../lib/types'
import { downloadIcs, googleCalendarUrl, outlookCalendarUrl } from '../lib/calendar'

const MENU_WIDTH = 208 // matches w-52

/** A compact "Add to calendar" control shown on each result slot: opens a small
 *  menu with Google / Outlook deep-links and an .ics download (Apple Calendar,
 *  Outlook desktop, and everything else import .ics).
 *
 *  The menu is rendered in a portal with fixed positioning so it escapes the
 *  results card's `overflow-hidden` (which rounds the row corners but would
 *  otherwise clip a menu that drops below the slot). Closes on outside-click,
 *  Escape, or scroll/resize. */
export default function AddToCalendar({ poll, slot, pollUrl }: { poll: Poll; slot: Slot; pollUrl: string }) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const place = () => {
    const b = btnRef.current
    if (!b) return
    const r = b.getBoundingClientRect()
    const left = Math.max(8, Math.min(r.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8))
    setPos({ top: r.bottom + 6, left })
  }

  useLayoutEffect(() => {
    if (open) place()
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDocPointer = (e: MouseEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t) || menuRef.current?.contains(t)) return
      setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    const onReflow = () => setOpen(false)
    document.addEventListener('mousedown', onDocPointer)
    document.addEventListener('keydown', onKey)
    // capture=true so a scroll in any ancestor container closes the menu too.
    window.addEventListener('scroll', onReflow, true)
    window.addEventListener('resize', onReflow)
    return () => {
      document.removeEventListener('mousedown', onDocPointer)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onReflow, true)
      window.removeEventListener('resize', onReflow)
    }
  }, [open])

  const openExternal = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    setOpen(false)
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--accent-text)] ring-1 ring-slate-200 hover:ring-[var(--accent)] hover:bg-[var(--accent-soft)] transition"
      >
        <CalendarIcon />
        Add to calendar
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: MENU_WIDTH }}
          className="z-50 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 pop-in"
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
        </div>,
        document.body,
      )}
    </>
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
