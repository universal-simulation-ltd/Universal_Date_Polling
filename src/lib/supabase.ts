import { createClient } from '@supabase/supabase-js'

// The shared suite Supabase project. The anon key below is a PUBLISHABLE key —
// it's designed to ship in the browser bundle (every Supabase web app exposes
// it); Row-Level Security is the real security boundary, and migration 0025/0040
// only lets an email-verified host write their own polls (never the service_role
// key, which must never be committed). Baking these public values in as a
// fallback means the deployed site works even if the Cloudflare Pages build has
// no VITE_SUPABASE_* env vars set — which is why the live site was showing
// "Polling needs its Supabase backend configured". An env var still overrides
// them, so local dev / self-hosting can point at a different project via
// .env.local.
const FALLBACK_URL = 'https://rygfxgalojojppxmhddo.supabase.co'
const FALLBACK_ANON =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2Z4Z2Fsb2pvanBweG1oZGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTY4MjUsImV4cCI6MjA5NDMzMjgyNX0.hLy_vt9vY_rdPKF3nL32yAuMCD604E3CH5VM7D7CaNE'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL
const anon = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || FALLBACK_ANON

/** Always true now that public production defaults are baked in; kept as a flag
 *  so the UI degrades gracefully if a build ever ships without a URL/key. */
export const SUPABASE_CONFIGURED = Boolean(url && anon)

// Re-exported so <UniversalProvider> (in main.tsx) shares the same baked public
// fallback. Without this, a build with no VITE_SUPABASE_* env vars left the SDK
// provider on placeholder creds — so it couldn't read the suite SSO session and
// the navbar showed no profile/avatar (or name/email/tier) even when the user
// was signed into the suite. PDF works because its provider reads its own
// VITE_PLATFORM_SUPABASE_* vars, which are set in that build.
export const SUITE_SUPABASE_URL = url
export const SUITE_SUPABASE_ANON = anon

// One client. The host's email-OTP session is persisted in localStorage under a
// Polling-specific storage key, so it can't be clobbered by (or clobber) the
// SDK provider's own Supabase client. Polling does not use the suite's
// cross-subdomain cookie SSO — its session stays scoped to this origin.
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: 'unipoll-auth',
  },
})
