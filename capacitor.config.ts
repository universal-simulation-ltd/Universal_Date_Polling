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
  // Android 15+ lays the window out under the status bar and the camera
  // cutout (edge-to-edge is enforced from targetSdk 35, with no opt-out at 36),
  // and no viewport meta tag moves an Android window. This margins the web
  // view by the system bars and the cutout. "auto", not "force": Android 14 and
  // below aren't edge-to-edge and would take a second inset. The margin shows
  // the WINDOW background, which is why values/styles.xml pins it light.
  android: { adjustMarginsForEdgeToEdge: 'auto' },
}

export default config
