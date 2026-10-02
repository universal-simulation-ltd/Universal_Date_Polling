import { useCallback, useEffect, useState } from 'react'
import { useUniversal } from '@unisim/sdk'
import { parseFreeAllowance, type FreeAllowanceStatus } from './freeAllowance'

// The workspace's free Polling allowance, straight from the
// `free_allowance_status` RPC (universal-platform migration 0199). Asked
// through the suite client: the RPC answers for the Universal ID's active
// company, which the app's own email-code session does not have.
//
// Fails quiet: signed out, no company, an RPC error or an unexpected shape all
// give `status: null`, and a null status means "say nothing". Gating itself
// stays with `create_poll_gated` on the backend.
export function useFreeAllowance(enabled = true) {
  const { supabase, session, activeOrgId } = useUniversal()
  const [status, setStatus] = useState<FreeAllowanceStatus | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const userId = session?.user && session.user.is_anonymous !== true ? session.user.id : null

  useEffect(() => {
    if (!enabled || !userId) {
      setStatus(null)
      return
    }
    let cancelled = false
    Promise.resolve(supabase.rpc('free_allowance_status', { p_app: 'polling' }))
      .then(({ data, error }) => {
        if (!cancelled) setStatus(error ? null : parseFreeAllowance(data))
      })
      .catch(() => { if (!cancelled) setStatus(null) })
    return () => { cancelled = true }
  }, [supabase, enabled, userId, activeOrgId, reloadKey])

  // A poll expiring is the one change nothing in this tab triggers, so look
  // again whenever the host comes back to the tab.
  useEffect(() => {
    if (!enabled || !userId) return
    const onVisible = () => { if (document.visibilityState === 'visible') setReloadKey((k) => k + 1) }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [enabled, userId])

  const refresh = useCallback(() => setReloadKey((k) => k + 1), [])
  return { status, refresh }
}
