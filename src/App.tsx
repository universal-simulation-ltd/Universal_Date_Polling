import { useEffect, useState } from 'react'
import { AdvancedMenu, AdvancedMenuItem, UniversalAppsNavBar, UpdateNotice, useCloseAppMenu } from '@unisim/sdk'
// Generated — `npm run credits` after any dependency change. Never edit it by
// hand: it is read off the installed tree, so a hand-kept list drifts from the
// lockfile the first time anyone upgrades anything, and a credits list naming a
// package we removed is worse than no list at all.
import credits from './generated/credits.json'
import ProductLogo from './components/ProductLogo'
import CreatePoll from './components/CreatePoll'
import PollPage from './components/PollPage'
import { CONTAINER_CREATE, CONTAINER_POLL } from './lib/layout'
import { openAppSettings } from './lib/appSettings'

const REPO_URL = 'https://github.com/universal-simulation-ltd/Universal_Date_Polling'
const BASE = import.meta.env.BASE_URL // '/' in dev, '/polling/' in production

type Route = { view: 'create' } | { view: 'poll'; id: string }

function route(): Route {
  const path = window.location.pathname
  let rel = path.startsWith(BASE) ? path.slice(BASE.length) : path.replace(/^\//, '')
  rel = rel.replace(/^\/+/, '')
  if (rel.startsWith('p/')) {
    const id = rel.slice(2).replace(/\/+$/, '')
    if (id) return { view: 'poll', id }
  }
  return { view: 'create' }
}

export default function App() {
  const [loc, setLoc] = useState<Route>(() => route())

  useEffect(() => {
    const onPop = () => setLoc(route())
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  // The create form is deliberately narrower than a poll's results view, so the
  // page width is per-view. Navbar + main + footer all take this one value, so
  // whichever view is up, they share an edge.
  const container = loc.view === 'poll' ? CONTAINER_POLL : CONTAINER_CREATE

  return (
    // ⚠️ pt-[env(safe-area-inset-top)] is for the native (Capacitor) build, not
    // the web one. Capacitor runs the app in a FULL-SCREEN WKWebView, and
    // index.html asks for `viewport-fit=cover`, so without this the navbar
    // renders UNDERNEATH the status bar and Dynamic Island, which puts the
    // product name on the clock and the menu out of reach. In a browser the
    // inset is 0, so this is a no-op on web. Universal Converter, PDF, QR and
    // Images all carry the same line.
    <div className="flex flex-col min-h-screen bg-slate-100 pt-[env(safe-area-inset-top)]">
      <UniversalAppsNavBar
        product="polling"
        productLogo={<ProductLogo />}
        actions={
          <>
          {/* App Settings — the ONLY way to a poll's options. They used to be a
              "More options" fold on the create form; a host now reaches them
              here, where every app in the suite keeps its settings. Offered on
              the create screen alone, because that is the screen that owns the
              draft the options belong to — a poll page would open nothing. */}
          {loc.view === 'create' && <AppSettingsRow />}

          {/* Advanced — the SDK's own category, so every app in the suite has
             one in the same place, and whatever goes in it next is one change
             rather than nineteen. "About this app" is always its last row. */}
          <AdvancedMenu
            about={{
              repo:    'https://github.com/universal-simulation-ltd/Universal_Date_Polling',
              // Server-backed: the local-first claim is not true here.
              privacy: false,
              version: __APP_VERSION__,
              credits,
              noticesHref: 'https://github.com/universal-simulation-ltd/Universal_Date_Polling/blob/main/THIRD-PARTY-NOTICES.md',
            }}
          />
          </>
        }
        productHomeHref={BASE}
        suiteSwitcherIconSrc={`${BASE}unisim-icon.png`}
        contentClassName={container}
      />

      {/* Renders nothing until this tab is genuinely running superseded code.
          See the SDK's useAppUpdate: an autoUpdate PWA hands the new worker
          control but leaves the running page on its old JavaScript. */}
      <div className={`${container} pt-4 empty:hidden`}>
        <UpdateNotice />
      </div>

      <main className="flex-1">
        {loc.view === 'poll' ? <PollPage id={loc.id} pollBase={BASE} /> : <CreatePoll pollBase={BASE} />}
      </main>

      {/* pb-[env(safe-area-inset-bottom)] keeps the last line of the page off
          the home indicator in the native build; 0 everywhere else. */}
      <footer className="border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className={`${container} py-4 flex flex-row items-center gap-3 sm:gap-4 text-xs text-slate-500`}>
          <span>
            With{' '}
            <span aria-hidden="true" className="text-orange-600">&hearts;</span>
            <span className="sr-only">love</span>{' '}
            from{' '}
            <a href="https://www.unisim.co.uk" target="_blank" rel="noreferrer" className="text-slate-700 hover:text-orange-700 underline-offset-2 hover:underline">
              UNISIM.co.uk
            </a>
          </span>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Universal Date Polling on GitHub"
            title="View source on GitHub"
            className="ml-auto shrink-0 inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12.02c0 5.09 3.29 9.4 7.86 10.92.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.69-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.95.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.39-5.26 5.68.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .3.21.66.79.55 4.57-1.52 7.86-5.83 7.86-10.92C23.5 5.65 18.35.5 12 .5z" />
            </svg>
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </footer>
    </div>
  )
}

/** The "App Settings" row of the navbar's Actions menu.
 *
 *  Its own component only so it can call `useCloseAppMenu` — the hook reads the
 *  context the SDK wraps `actions` in, so it has to run inside those rows
 *  rather than in App itself. Closing matters here: the panel it opens is a
 *  dialog, and leaving the dropdown hanging over it would put two layers of
 *  menu on the screen at once. */
function AppSettingsRow() {
  const closeMenu = useCloseAppMenu()
  return (
    <AdvancedMenuItem
      label="App Settings"
      info="Booking page, link expiry, response alerts, calendar and timezone"
      icon={
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 8.8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
        </svg>
      }
      onSelect={() => { closeMenu(); openAppSettings() }}
    />
  )
}
