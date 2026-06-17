import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import pkg from './package.json' with { type: 'json' }

// Universal Polling is served at opensource.unisim.co.uk/polling in production.
// `base` + PWA scope derive from Vite's `mode`; local dev stays `/`.
export default defineConfig(({ mode }) => {
  const BASE_PATH = mode === 'production' ? '/polling/' : '/'
  return {
    base: BASE_PATH,
    // Honour an externally-assigned PORT (e.g. preview tooling) when provided.
    server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version)
    },
    resolve: {
      // Force a single React instance so @unisim/sdk's hooks share the same
      // dispatcher as the host app (mirrors the other Universal Apps).
      dedupe: ['react', 'react-dom']
    },
    optimizeDeps: {
      exclude: ['@unisim/sdk']
    },
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'og-image.png'],
        manifest: {
          name: 'Universal Polling',
          short_name: 'UniPoll',
          description: 'Create a poll, share a link, find a time that works for everyone.',
          theme_color: '#0f172a',
          background_color: '#f8fafc',
          display: 'standalone',
          start_url: BASE_PATH,
          scope: BASE_PATH,
          icons: [
            { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
            { src: 'icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          // SPA navigations under the base path fall back to the prefixed shell.
          navigateFallback: `${BASE_PATH}index.html`,
        },
        devOptions: { enabled: false }
      })
    ]
  }
})
