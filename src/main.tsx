import React from 'react'
import ReactDOM from 'react-dom/client'
import { UniversalProvider } from '@unisim/sdk'
import type { ProductCode } from '@unisim/sdk'
import App from './App'
import './index.css'

// Polling keeps its OWN client (src/lib/supabase.ts) on an isolated storage key
// for the guest host email-OTP flow. Separately, <UniversalProvider> is now
// wired to the REAL shared suite project so the SDK hooks (useUser /
// useSubscription / useOrgBranding) can recognise an enterprise visitor who is
// already signed into the suite and personalise the poll for them.
//
// In production we set cookieDomain so the SDK session is read from the
// `.unisim.co.uk` suite cookie (cross-subdomain SSO). Locally there's no such
// cookie, so the SDK falls back to localStorage and enterprise mode is simply
// inert — the guest OTP flow is unaffected either way.
const SUITE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUITE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

const universalConfig = {
  // Placeholders keep the provider happy when env vars are absent (the SDK
  // hooks then just report "logged out"); real creds enable enterprise SSO.
  supabaseUrl: SUITE_URL ?? 'https://placeholder.supabase.co',
  supabaseAnonKey: SUITE_ANON ?? 'public-anon-placeholder',
  // 'polling' isn't in the SDK's ProductCode union yet; the value only scopes
  // changelog/usage, neither of which this navbar path uses.
  product: 'polling' as unknown as ProductCode,
  // Suite SSO cookie only exists in production under the shared parent domain.
  ...(import.meta.env.PROD ? { cookieDomain: '.unisim.co.uk' } : {}),
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
