// Delete with Undo, for things that live on the server (BRANDING.md ▸ "A
// deletable row swipes": "Delete offers Undo").
//
// The SDK's useUndo deletes first and puts back on Undo, which needs a way to
// put a thing back. A poll can't be put back (its answers and bookings go
// with it), so here the delete WAITS instead: the row leaves the list at once,
// Undo brings it back, and only when the six seconds are up is the server
// asked. One at a time: a second delete sends the first straight away. The app
// going to the background, or the list going away, sends it too, so a delete
// is never silently forgotten.

import { useCallback, useEffect, useRef, useState } from 'react'

export interface DeferredDelete<T> {
  /** What is waiting to go (its row is hidden), or null. */
  item: T | null
  /** Take it out of the list now; delete it for real in six seconds. */
  remove: (item: T) => void
  /** Put it back; nothing is deleted. */
  undo: () => void
}

export function useDeferredDelete<T>(commit: (item: T) => void | Promise<void>, ms = 6000): DeferredDelete<T> {
  const [item, setItem] = useState<T | null>(null)
  const waiting = useRef<{ item: T; timer: ReturnType<typeof setTimeout> } | null>(null)
  const send = useRef(commit)
  send.current = commit

  const flush = useCallback(() => {
    const w = waiting.current
    if (!w) return
    clearTimeout(w.timer)
    waiting.current = null
    setItem(null)
    void send.current(w.item)
  }, [])

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    document.addEventListener('visibilitychange', onHide)
    return () => {
      document.removeEventListener('visibilitychange', onHide)
      flush()
    }
  }, [flush])

  return {
    item,
    remove: (x: T) => {
      flush()
      waiting.current = { item: x, timer: setTimeout(flush, ms) }
      setItem(x)
    },
    undo: () => {
      const w = waiting.current
      if (!w) return
      clearTimeout(w.timer)
      waiting.current = null
      setItem(null)
    },
  }
}
