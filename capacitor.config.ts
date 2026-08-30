import type { CapacitorConfig } from '@capacitor/cli'

// Capacitor wraps the same Vite build that ships to the web, but NOT the same
// MODE. `webDir` is the Vite output directory; Capacitor then serves it from a
// local `capacitor://localhost` origin whose document root IS that directory,
// so every asset URL has to resolve relatively and no service worker may be
// present. Build with `npm run build:mobile` (Vite `--mode desktop`: base `./`,
// PWA plugin off) before `npx cap sync` — the production `/polling/` base build
// installs and launches as a blank screen, with nothing before the phone
// saying so. `npm run cap:sync` does both and then verifies the copy.
const config: CapacitorConfig = {
  appId: 'uk.co.unisim.polling',
  appName: 'Universal Date Polling',
  webDir: 'dist',
}

export default config
