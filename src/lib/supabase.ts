import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** False when env vars are missing — the UI shows a friendly notice instead of
 *  throwing, so the app still builds and renders without a backend configured. */
export const SUPABASE_CONFIGURED = Boolean(url && anon)

// One client. The host's email-OTP session is persisted in localStorage under a
// Polling-specific storage key, so it can't be clobbered by (or clobber) the
// SDK provider's own Supabase client. Polling does not use the suite's
// cross-subdomain cookie SSO — its session stays scoped to this origin.
export const supabase = createClient(
  url ?? 'https://placeholder.supabase.co',
  anon ?? 'public-anon-placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'unipoll-auth',
    },
  }
)
