import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { useBack } from './back'
import { useEdgeSwipeBack } from './edgeSwipe'
import { getT } from '../i18n/runtime'

// The phone app's two shapes for anything the website opens as a popup
// (Docs_UNI_SIM/store-listings/README.md §7, BRANDING.md's phone rules):
//
//   • <PhonePage>  a full page over the app, with a back link at the top, a
//                  swipe in from the left edge, and Android's Back;
//   • <PhoneSheet> a bottom sheet with a grip, that a big swipe down anywhere
//                  closes (a short pull puts the finger in its text box), and
//                  Back, a tap on the scrim, or Escape.
//
// And `askConfirm()`, the sheet that stands in for window.confirm.
// The gesture code is Universal_PDF's (src/native/parts.tsx), kept alike.

/** The page behind can't scroll while a layer is up. */
function useScrollLock() {
  useEffect(() => {
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])
}

/** Focus into the layer when it opens, back where it was when it closes. */
function useFocusIn(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const before = document.activeElement as HTMLElement | null
    ref.current?.focus({ preventScroll: true })
    return () => before?.focus?.({ preventScroll: true })
  }, [ref])
}

export function BackChevron() {
  return (
    <svg viewBox="0 0 24 24" className="h-[22px] w-[22px]" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  )
}

/**
 * A full page over the app. `back` names where the back link goes ("New poll",
 * "Tune this app"); the title sits under it, large, as on an iPhone.
 */
export function PhonePage({
  title,
  description,
  back,
  onBack,
  children,
  footer,
  z = 1150,
}: {
  title: string
  description?: string
  back: string
  onBack: () => void
  children: ReactNode
  /** A bar pinned to the foot of the page (a primary button). */
  footer?: ReactNode
  z?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const headingId = useId()
  useScrollLock()
  useBack(true, onBack)
  useFocusIn(ref)
  useEdgeSwipeBack(ref, true, onBack)
  usePagePullToType(scrollRef, true)

  // Rendered where it is, not portalled: fixed to the screen all the same, and
  // it keeps the poll's accent colours (`[data-theme]` on an ancestor).
  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-labelledby={headingId}
      tabIndex={-1}
      style={{ zIndex: z }}
      data-phone-layer
      className="phone-page fixed inset-0 flex flex-col bg-slate-100 dark:bg-slate-950 outline-none"
    >
      <div className="flex-none bg-slate-100/95 dark:bg-slate-950/95 pt-[env(safe-area-inset-top)] backdrop-blur">
        <div className="flex h-11 items-center px-1.5">
          <button
            type="button"
            onClick={onBack}
            className="flex min-h-[44px] max-w-full items-center gap-0.5 px-2 text-[16px] text-[var(--accent-text,#9a3412)] dark:text-orange-400"
          >
            <BackChevron />
            <span className="truncate">{back}</span>
          </button>
        </div>
      </div>
      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="px-4 pb-6">
          <h2 id={headingId} className="pt-1 text-[28px] font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>}
          <div className="mt-4">{children}</div>
        </div>
      </div>
      {footer && (
        <div className="flex-none border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur">
          {footer}
        </div>
      )}
    </div>
  )
}

/** A bottom sheet over a scrim. */
export function PhoneSheet({
  label,
  title,
  onClose,
  children,
  z = 1200,
}: {
  label: string
  /** Shown at the top of the sheet; omitted, only the grip is. */
  title?: ReactNode
  onClose: () => void
  children: ReactNode
  z?: number
}) {
  const ref = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const grip = useSheetPull(ref, onClose)
  useSheetBodyPull(ref, bodyRef, onClose)
  useScrollLock()
  useBack(true, onClose)
  useFocusIn(ref)

  return (
    <div className="fixed inset-0" style={{ zIndex: z }}>
      <div className="phone-scrim absolute inset-0 bg-slate-900/40 dark:bg-black/60" onClick={onClose} aria-hidden="true" />
      <section
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        data-phone-layer
        className="phone-sheet absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-[22px] bg-white dark:bg-slate-900 shadow-[0_-8px_30px_rgba(15,23,42,0.18)] outline-none"
      >
        <div {...grip} data-sheet-grip className="flex flex-none cursor-grab touch-none justify-center pt-2 pb-1">
          <div className="h-[5px] w-10 rounded-full bg-slate-300 dark:bg-slate-600" aria-hidden="true" />
        </div>
        {title && <div className="flex-none px-5 pt-1 pb-2 text-[17px] font-bold text-slate-900 dark:text-slate-100">{title}</div>}
        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </section>
    </div>
  )
}

/** A full-width row in a sheet: a tap target a thumb can't miss. */
export function SheetRow({ onClick, children, tone = 'plain' }: { onClick: () => void; children: ReactNode; tone?: 'plain' | 'danger' | 'accent' }) {
  const colour =
    tone === 'danger' ? 'text-red-700 dark:text-red-400'
      : tone === 'accent' ? 'text-[var(--accent-text,#9a3412)] dark:text-orange-400 font-semibold'
        : 'text-slate-800 dark:text-slate-200'
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-[52px] w-full items-center border-b border-slate-100 dark:border-slate-800 px-1 text-left text-[16px] last:border-b-0 active:bg-slate-50 dark:active:bg-slate-800 ${colour}`}
    >
      {children}
    </button>
  )
}

// --- window.confirm, the phone's way ------------------------------------------

type Ask = { question: string; confirm: string; cancel: string; danger: boolean; resolve: (ok: boolean) => void }
let showAsk: ((ask: Ask) => void) | null = null

/**
 * A yes/no question as a bottom sheet. Resolves true on the confirm button,
 * false on Cancel, the scrim, a swipe down or Back. `ConfirmHost` must be
 * mounted (App mounts it in the phone app).
 */
export function askConfirm(
  question: string,
  opts: { confirm?: string; cancel?: string; danger?: boolean } = {},
): Promise<boolean> {
  // The default buttons are read when the question is asked, so they are in
  // the language the app is in now.
  const t = getT()
  const confirm = opts.confirm ?? t('native.confirm_ok')
  const cancel = opts.cancel ?? t('common.cancel')
  const danger = opts.danger ?? false
  return new Promise((resolve) => {
    if (!showAsk) {
      resolve(window.confirm(question))
      return
    }
    showAsk({ question, confirm, cancel, danger, resolve })
  })
}

export function ConfirmHost() {
  const [ask, setAsk] = useState<Ask | null>(null)
  useEffect(() => {
    showAsk = setAsk
    return () => {
      showAsk = null
    }
  }, [])
  if (!ask) return null
  const answer = (ok: boolean) => {
    setAsk(null)
    ask.resolve(ok)
  }
  const [head, ...rest] = ask.question.split('\n\n')
  return (
    <PhoneSheet label={head} onClose={() => answer(false)} z={1300}>
      <p className="pt-1 text-[17px] font-bold leading-snug text-slate-900 dark:text-slate-100">{head}</p>
      {rest.length > 0 && <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-slate-600 dark:text-slate-400">{rest.join('\n\n')}</p>}
      <div className="mt-5 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => answer(true)}
          className={`min-h-[50px] rounded-xl px-4 text-[16px] font-semibold text-white ${ask.danger ? 'bg-red-600 active:bg-red-700' : 'bg-slate-900 dark:bg-slate-100 dark:text-slate-900'}`}
        >
          {ask.confirm}
        </button>
        <button
          type="button"
          onClick={() => answer(false)}
          className="min-h-[50px] rounded-xl bg-slate-100 dark:bg-slate-800 px-4 text-[16px] font-semibold text-slate-700 dark:text-slate-200"
        >
          {ask.cancel}
        </button>
      </div>
    </PhoneSheet>
  )
}

// --- Gestures (Universal_PDF/src/native/parts.tsx) -----------------------------

type GripProps = Pick<React.HTMLAttributes<HTMLDivElement>, 'onPointerDown' | 'onPointerMove' | 'onPointerUp' | 'onPointerCancel'>

/** The grip: the sheet comes down with the finger; past a third, or flicked, it closes. */
function useSheetPull(ref: React.RefObject<HTMLElement | null>, onClose: () => void): GripProps {
  const drag = useRef<{ y: number; dy: number; t: number; v: number } | null>(null)
  const close = useRef(onClose)
  close.current = onClose

  function finish(cancelled: boolean) {
    const d = drag.current
    drag.current = null
    const el = ref.current
    if (!d || !el) return
    const away = !cancelled && (d.dy > Math.min(140, el.offsetHeight / 3) || (d.v > 0.5 && d.dy > 16))
    el.style.transition = 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)'
    if (away) {
      el.style.transform = `translateY(${el.offsetHeight + 24}px)`
      window.setTimeout(() => close.current(), 160)
    } else {
      el.style.transform = ''
    }
  }

  return {
    onPointerDown(e) {
      const el = ref.current
      if (!el) return
      drag.current = { y: e.clientY, dy: 0, t: e.timeStamp, v: 0 }
      e.currentTarget.setPointerCapture(e.pointerId)
      el.getAnimations?.().forEach((a) => a.cancel())
      el.style.animation = 'none'
      el.style.transition = 'none'
    },
    onPointerMove(e) {
      const d = drag.current
      const el = ref.current
      if (!d || !el) return
      const dy = Math.max(0, e.clientY - d.y)
      const dt = e.timeStamp - d.t
      if (dt > 0) d.v = (dy - d.dy) / dt
      d.dy = dy
      d.t = e.timeStamp
      el.style.transform = dy ? `translateY(${dy}px)` : ''
    },
    onPointerUp: () => finish(false),
    onPointerCancel: () => finish(true),
  }
}

const PULL_EXEMPT = 'input, textarea, select, canvas, [contenteditable="true"], [data-swipe-x], [data-sheet-grip]'
const TYPE_BOX = 'input:not([type]), input[type="text"], input[type="search"], input[type="url"], input[type="email"], input[type="tel"], input[type="number"], textarea'

function firstTypeBox(root: HTMLElement | null): HTMLInputElement | HTMLTextAreaElement | null {
  if (!root) return null
  for (const el of root.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(TYPE_BOX)) {
    if (el.disabled || el.readOnly) continue
    if (el.getClientRects().length === 0) continue
    return el
  }
  return null
}

/** A big swipe down anywhere on a sheet closes it; a shorter pull types in its box. */
function useSheetBodyPull(sheetRef: React.RefObject<HTMLElement | null>, bodyRef: React.RefObject<HTMLElement | null>, onClose: () => void) {
  const close = useRef(onClose)
  close.current = onClose
  useEffect(() => {
    const sheet = sheetRef.current
    const body = bodyRef.current
    if (!sheet || !body) return
    let g: { x: number; y: number; dy: number; t: number; v: number; pull: boolean | null } | null = null
    const onStart = (e: TouchEvent) => {
      g = null
      if (e.touches.length !== 1) return
      const target = e.target as Element | null
      if (target?.closest?.(PULL_EXEMPT)) return
      if (target?.closest?.('[data-phone-layer]') !== sheet) return
      if (body.scrollTop > 0) return
      const tt = e.touches[0]
      g = { x: tt.clientX, y: tt.clientY, dy: 0, t: e.timeStamp, v: 0, pull: null }
    }
    const onMove = (e: TouchEvent) => {
      if (!g) return
      const tt = e.touches[0]
      const dx = tt.clientX - g.x
      const dy = tt.clientY - g.y
      if (g.pull === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        g.pull = dy > 0 && dy > Math.abs(dx) * 1.2 && body.scrollTop <= 0
        if (!g.pull) {
          g = null
          return
        }
        sheet.getAnimations?.().forEach((a) => a.cancel())
        sheet.style.animation = 'none'
        sheet.style.transition = 'none'
      }
      e.preventDefault()
      const d = Math.max(0, dy)
      const dt = e.timeStamp - g.t
      if (dt > 0) g.v = (d - g.dy) / dt
      g.dy = d
      g.t = e.timeStamp
      sheet.style.transform = d ? `translateY(${d}px)` : ''
    }
    const onEnd = () => {
      const d = g
      g = null
      if (!d?.pull) return
      const big = d.dy > Math.min(180, sheet.offsetHeight * 0.4) || (d.v > 0.8 && d.dy > 90)
      sheet.style.transition = 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      if (big) {
        sheet.style.transform = `translateY(${sheet.offsetHeight + 24}px)`
        window.setTimeout(() => close.current(), 160)
        return
      }
      sheet.style.transform = ''
      if (d.dy > 36) firstTypeBox(body)?.focus()
    }
    sheet.addEventListener('touchstart', onStart, { passive: true })
    sheet.addEventListener('touchmove', onMove, { passive: false })
    sheet.addEventListener('touchend', onEnd)
    sheet.addEventListener('touchcancel', onEnd)
    return () => {
      sheet.removeEventListener('touchstart', onStart)
      sheet.removeEventListener('touchmove', onMove)
      sheet.removeEventListener('touchend', onEnd)
      sheet.removeEventListener('touchcancel', onEnd)
    }
  }, [sheetRef, bodyRef])
}

/** A pull down on a page puts the finger in its first text box, keyboard up. */
function usePagePullToType(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const page = ref.current
    if (!page || !enabled) return
    let g: { x: number; y: number; dy: number; pull: boolean | null } | null = null
    const onStart = (e: TouchEvent) => {
      g = null
      if (e.touches.length !== 1) return
      const target = e.target as Element | null
      if (target?.closest?.(PULL_EXEMPT)) return
      if (target?.closest?.('[data-phone-layer]') !== page.closest('[data-phone-layer]')) return
      if (!firstTypeBox(page)) return
      if (page.scrollTop > 0) return
      const tt = e.touches[0]
      g = { x: tt.clientX, y: tt.clientY, dy: 0, pull: null }
    }
    const onMove = (e: TouchEvent) => {
      if (!g) return
      const tt = e.touches[0]
      const dx = tt.clientX - g.x
      const dy = tt.clientY - g.y
      if (g.pull === null) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
        g.pull = dy > 0 && dy > Math.abs(dx) * 1.2 && page.scrollTop <= 0
        if (!g.pull) {
          g = null
          return
        }
        page.style.transition = 'none'
      }
      e.preventDefault()
      g.dy = Math.max(0, dy)
      page.style.transform = `translateY(${Math.min(48, g.dy * 0.35)}px)`
    }
    const onEnd = () => {
      const d = g
      g = null
      if (!d?.pull) return
      page.style.transition = 'transform 180ms cubic-bezier(0.2, 0.8, 0.2, 1)'
      page.style.transform = ''
      if (d.dy > 50) firstTypeBox(page)?.focus()
    }
    page.addEventListener('touchstart', onStart, { passive: true })
    page.addEventListener('touchmove', onMove, { passive: false })
    page.addEventListener('touchend', onEnd)
    page.addEventListener('touchcancel', onEnd)
    return () => {
      page.removeEventListener('touchstart', onStart)
      page.removeEventListener('touchmove', onMove)
      page.removeEventListener('touchend', onEnd)
      page.removeEventListener('touchcancel', onEnd)
    }
  }, [ref, enabled])
}
