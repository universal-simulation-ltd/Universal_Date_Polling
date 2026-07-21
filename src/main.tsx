import React from 'react'
import ReactDOM from 'react-dom/client'
import { UniversalProvider } from '@unisim/sdk'
import type { ProductCode } from '@unisim/sdk'
import App from './App'
import UsageTracker from './UsageTracker'
import { SUITE_SUPABASE_URL, SUITE_SUPABASE_ANON } from './lib/supabase'
import './index.css'

console.log(`build: ${import.meta.env.VITE_BUILD_SHA}`)

// Polling keeps its OWN client (src/lib/supabase.ts) on an isolated storage key
// for the guest host email-OTP flow. Separately, <UniversalProvider> is now
// wired to the REAL shared suite project so the SDK hooks (useUser /
// useSubscription / useOrgBranding / useProfile) can recognise a visitor who is
// already signed into the suite and personalise the poll for them — including
// showing their profile avatar + tier badge in the navbar.
//
// In production we set cookieDomain so the SDK session is read from the
// `.unisim.co.uk` suite cookie (cross-subdomain SSO). Locally there's no such
// cookie, so the SDK falls back to localStorage and enterprise mode is simply
// inert — the guest OTP flow is unaffected either way.
//
// IMPORTANT: use the SAME baked public fallback as the app's own client. Before
// this, the provider read VITE_SUPABASE_* directly and fell back to a placeholder
// project when those env vars were absent at build time — so on the deployed
// site the SDK couldn't reach the real project, the suite session never resolved,
// and the navbar showed no profile/avatar. (PDF was fine because its provider
// reads VITE_PLATFORM_SUPABASE_*, which are set in that build.)
const universalConfig = {
  supabaseUrl: SUITE_SUPABASE_URL,
  supabaseAnonKey: SUITE_SUPABASE_ANON,
  // 'polling' isn't in the SDK's ProductCode union yet; the value only scopes
  // changelog/usage, neither of which this navbar path uses.
  product: 'polling' as unknown as ProductCode,
  // Suite SSO cookie only exists in production under the shared parent domain.
  ...(import.meta.env.PROD ? { cookieDomain: '.unisim.co.uk' } : {}),
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <UsageTracker />
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
