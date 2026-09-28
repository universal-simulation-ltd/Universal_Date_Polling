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
  // cutout (edge-to-edge is enforced from targetSdk 35, with no opt-out at 36).
  // Capacitor 8 removed `android.adjustMarginsForEdgeToEdge` in favour of its
  // core SystemBars plugin, which reads index.html's `viewport-fit=cover`: on a
  // WebView from Chromium 140 the page is drawn edge-to-edge and
  // `env(safe-area-inset-*)` carries the real insets, which this app pads by,
  // exactly as on iOS. On an older WebView, where those env values read 0, it
  // pads the web view natively instead and the strips show the WINDOW
  // background, which values/styles.xml pins light.
  plugins: {
    SystemBars: {
      // The glyphs' colour at launch: dark, for the white strip / light navbar.
      // Left at DEFAULT it would follow the phone's dark mode — white glyphs on
      // the pinned white strip. src/lib/systemBars.ts switches it to follow the
      // app's own theme wherever the page itself is under the status bar.
      style: 'LIGHT',
      // index.html says cover; saying so here spares a layout jump on start.
      initialViewportFitValueHint: 'cover',
    },
  },
}

export default config
