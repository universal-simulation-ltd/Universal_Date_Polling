// App Settings — the one place the poll's options live, and the preferences
// that decide what the create page offers on its own.
//
// The options used to be a "More options" fold on the create form. They are now
// reached only through the navbar's Actions → App Settings, which is the same
// place every app in the suite keeps its settings — but the navbar is rendered
// by App.tsx and the options belong to CreatePoll's draft state, so the two
// need a wire between them that isn't a prop drilled through the SDK's bar.
// A window event is that wire: the menu row announces "open settings", and
// whichever screen owns settings right now answers.

/** Which part of the settings panel to open on. The panel shows everything
 *  either way; this only decides what is scrolled to and focused, so a host who
 *  clicked "Change timezone?" lands on the timezone control rather than at the
 *  top of a list they then have to read through. */
export type SettingsSection = 'general' | 'timezone'

const OPEN_EVENT = 'unisim-polling:open-app-settings'

/** Ask the current screen to open its settings panel. Does nothing when no
 *  screen is listening (a poll page has no settings of its own), which is why
 *  the menu row is only offered where there is something to open. */
export function openAppSettings(section: SettingsSection = 'general'): void {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<SettingsSection>(OPEN_EVENT, { detail: section }))
}

/** Listen for the menu row above. Returns the unsubscribe, for an effect. */
export function onOpenAppSettings(fn: (section: SettingsSection) => void): () => void {
  if (typeof window === 'undefined') return () => {}
  const handler = (e: Event) => fn((e as CustomEvent<SettingsSection>).detail ?? 'general')
  window.addEventListener(OPEN_EVENT, handler)
  return () => window.removeEventListener(OPEN_EVENT, handler)
}

// --- "Don't show again" for the connect-a-calendar prompt --------------------
// The prompt beside the calendar grid is an offer, not a step, and a host who
// has decided against it should be able to say so once rather than scroll past
// it on every poll they ever make. Dismissing it does NOT take the feature
// away: App Settings connects a calendar too, and offers this prompt back.

const HIDE_CALENDAR_PROMPT_KEY = 'unisim.polling.calendarPrompt.hidden'

/** Storage that cannot throw. `localStorage` is absent in a Node test run, and
 *  ACCESSING it throws in a browser with site data blocked — so a preference
 *  nobody can read must degrade to "not set", never to a broken page. */
function readFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === '1'
  } catch {
    return false
  }
}

function writeFlag(key: string, on: boolean): void {
  try {
    if (on) window.localStorage.setItem(key, '1')
    else window.localStorage.removeItem(key)
  } catch {
    /* preference simply doesn't stick — the prompt is still dismissible for
       this page, it just comes back next time. */
  }
}

/** Has the host asked not to be offered the calendar prompt again? */
export function calendarPromptHidden(): boolean {
  return readFlag(HIDE_CALENDAR_PROMPT_KEY)
}

export function setCalendarPromptHidden(hidden: boolean): void {
  writeFlag(HIDE_CALENDAR_PROMPT_KEY, hidden)
}
