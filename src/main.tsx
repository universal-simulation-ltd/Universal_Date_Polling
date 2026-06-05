import React from 'react'
import ReactDOM from 'react-dom/client'
import { UniversalProvider } from '@unisim/sdk'
import type { ProductCode } from '@unisim/sdk'
import App from './App'
import './index.css'

// Polling talks to Supabase through its OWN client (src/lib/supabase.ts) so it
// can run the host email-OTP flow on an isolated storage key. We still mount
// <UniversalProvider> because the shared navbar reads language/changelog state
// from its context, and hand it harmless placeholders (the SDK's own client is
// never called by this app) — mirroring the other Universal Apps.
const universalConfig = {
  supabaseUrl: 'https://placeholder.supabase.co',
  supabaseAnonKey: 'public-anon-placeholder',
  // 'polling' isn't in the SDK's ProductCode union yet; the value only scopes
  // changelog/usage, neither of which this navbar path uses.
  product: 'polling' as unknown as ProductCode,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
