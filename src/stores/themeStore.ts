import { createThemeStore, type ThemePref } from '@unisim/sdk'

// The light/dark/system preference for the APP's chrome. The store itself lives
// in @unisim/sdk (createThemeStore) — this file only names the key. It opens
// LIGHT and stays light until the user chooses otherwise (the suite rule), even
// on a device set to dark.
//
// Since SDK 0.143 the key holds this app's OVERRIDE, chosen in App preferences
// (App.tsx passes this store to the navbar as `themeStore`). Absent — "Follow
// global" — the app uses the suite-wide colour scheme from Global preferences,
// `universal:color-scheme`, which is light until chosen.
//
// ⚠️ Not the same thing as `lib/theme.ts`, which is the POLL's booking-page
// accent (orange / blue / pink / green / a custom hex) carried on a
// `data-theme` attribute. This one is a `.dark` class on <html>, so the two
// never collide: every poll accent has a light and a dark rendering.
//
// ⚠️ The key is every user's saved choice for this app, and it is written down
// TWICE — here and in the pre-paint script in index.html. `lib/darkMode.test.ts`
// fails if the two drift. Renaming it silently puts everybody back to following
// global.
export type { ThemePref }

export const useThemeStore = createThemeStore('unisim-polling-theme')
