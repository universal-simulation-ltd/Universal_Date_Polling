import { useEffect, useRef, useState } from 'react'
import { useUser } from '@unisim/sdk'
import { supabase } from './supabase'
import { shouldClearGuestSession } from './authReturn'

// The guest host's own session (this app's client), as React state that FOLLOWS
// the client instead of being read once.
//
// Both screens used to call `currentUser()` in a mount effect, so any later
// change — signing out from the navbar, a session arriving from an email link —
// left the page naming an account that was no longer signed in.

export interface GuestUser {
  id: string
  email: string | null
}

/**
 * The guest host signed into THIS app, kept current.
 *
 * `undefined` while the first read is in flight, so a caller can tell "not
 * known yet" from "nobody" and avoid flashing the email step at a host who is
 * about to be recognised.
 */
export function useOtpUser(): GuestUser | null | undefined {
  const [user, setUser] = useState<GuestUser | null | undefined>(undefined)

  useEffect(() => {
    let live = true
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!live) return
        setUser(data.user ? { id: data.user.id, email: data.user.email ?? null } : null)
      })
      .catch(() => { if (live) setUser(null) })

    // Fires for this client only: its own sign-in, sign-out and token refresh.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!live) return
      setUser(session?.user ? { id: session.user.id, email: session.user.email ?? null } : null)
    })

    return () => { live = false; sub.subscription.unsubscribe() }
  }, [])

  return user
}

/**
 * Sign the guest host out of this app when the SUITE session goes away.
 *
 * The navbar's "Sign out" is the SDK's, and it only clears the suite client —
 * this app's separate guest session survived it, which is why signing out and
 * back in as somebody else left the old account on screen (2026-09-17).
 *
 * Mounted once, in App. Deliberately one-directional: signing out of this app's
 * guest session does NOT touch the suite session, which belongs to every other
 * suite app on the domain too.
 */
export function useGuestSessionFollowsSuiteSignOut(): void {
  const { user } = useUser()
  const previous = useRef<string | null>(null)

  useEffect(() => {
    const next = user?.id ?? null
    if (shouldClearGuestSession(previous.current, next)) {
      void supabase.auth.signOut()
    }
    previous.current = next
  }, [user])
}
