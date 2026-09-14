import { createThemeStore, type ThemePref } from '@unisim/sdk'

// The light/dark/system preference for the APP's chrome. The store itself lives
// in @unisim/sdk (createThemeStore) — this file only names the key. It opens
// LIGHT and stays light until the user chooses otherwise (the suite rule), even
// on a device set to dark.
//
// ⚠️ Not the same thing as `lib/theme.ts`, which is the POLL's booking-page
// accent (orange / blue / pink / green / a custom hex) carried on a
// `data-theme` attribute. This one is a `.dark` class on <html>, so the two
// never collide: every poll accent has a light and a dark rendering.
//
// ⚠️ The key is every user's saved choice, and it is written down TWICE — here
// and in the pre-paint script in index.html. `lib/darkMode.test.ts` fails if
// the two drift. Renaming it silently resets everybody to light.
export type { ThemePref }

export const useThemeStore = createThemeStore('unisim-polling-theme')
