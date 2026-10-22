// Back, in the phone app: Android's back gesture / button, and (through
// `useEdgeSwipeBack`) a swipe in from the left edge on either phone.
//
// Each page or sheet that is open says what Back does from it, and the newest
// one wins: a sheet closes, a page goes back. With nothing open, Android does
// what it did before this existed (the web view's own history: a poll page
// back to the create form), and at the start of that history the app goes to
// the background rather than closing. Universal_Family's src/lib/back.ts is the
// same idea.

import { useEffect, useRef } from 'react'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'

type Handler = () => void

const stack: Handler[] = []
let installed = false

export function installBack(): void {
  if (installed) return
  installed = true
  // Escape is Back too (a keyboard on an iPad, the dev browser): the top layer
  // only, never every open one at once.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && stack.length && dispatchBack()) e.preventDefault()
  })
  if (!Capacitor.isNativePlatform() || Capacitor.getPlatform() !== 'android') return
  void App.addListener('backButton', ({ canGoBack }) => {
    if (dispatchBack()) return
    if (canGoBack) window.history.back()
    else void App.minimizeApp()
  })
}

/** Runs the newest handler; false when nothing is open. */
export function dispatchBack(): boolean {
  const top = stack[stack.length - 1]
  if (!top) return false
  top()
  return true
}

/** Is anything open over the page (a sheet, a page)? */
export function layersOpen(): number {
  return stack.length
}

/** What Back does while `active`. The handler may change every render. */
export function useBack(active: boolean, handler: Handler): void {
  const latest = useRef(handler)
  latest.current = handler
  useEffect(() => {
    if (!active) return
    const h: Handler = () => latest.current()
    stack.push(h)
    return () => {
      const i = stack.lastIndexOf(h)
      if (i >= 0) stack.splice(i, 1)
    }
  }, [active])
}
