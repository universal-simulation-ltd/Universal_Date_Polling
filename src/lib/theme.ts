import type { CSSProperties } from 'react'
import { accessibleColor } from '@unisim/sdk'
import { isHexTheme, THEMES } from './types'

/** The app's light/dark mode, as the theme store resolves it. */
export type ColorMode = 'light' | 'dark'

/** The dark card surface (slate-900) the poll's tinted pieces sit on. */
const DARK_CARD = '#0f172a'
/** The raised dark surface (slate-800) — menus, tracks, hovered rows. */
const DARK_RAISED = '#1e293b'

/** `a` mixed into `b` by `weight` (0..1), per sRGB channel — the same colour
 *  `color-mix(in srgb, a W%, b)` paints, but as a hex so its contrast can be
 *  measured. Both inputs must be '#rrggbb'. */
function mixHex(a: string, b: string, weight: number): string {
  const ch = (hex: string, i: number) => parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16)
  let out = '#'
  for (let i = 0; i < 3; i++) {
    out += Math.round(ch(a, i) * weight + ch(b, i) * (1 - weight)).toString(16).padStart(2, '0')
  }
  return out
}

/** `data-theme` attribute value: the preset name, or 'custom' for a hex (so the
 *  preset CSS selectors don't apply and the inline vars below take over). */
export function themeAttr(theme: string): string {
  return isHexTheme(theme) ? 'custom' : theme
}

/** Inline CSS custom properties for a custom hex theme (empty for presets,
 *  which are styled by [data-theme="…"] rules in index.css). Inline styles beat
 *  the attribute selectors, so these override the orange defaults. Derived
 *  shades use color-mix — already relied on for the heat cells.
 *
 *  --accent is a FILL UNDER WHITE TEXT (the selected segment, today's date,
 *  the primary button), so it and the shades derived from it use the nearest
 *  shade of the picked colour that reaches 4.5:1 against white — an amber like
 *  #f59e0b is 2.15:1 as picked. The pale tints (--accent-soft/-softer) sit
 *  UNDER dark text, so they keep mixing from the colour exactly as picked. The
 *  stored theme stays raw; only the render is adjusted.
 *
 *  `mode` is the APP's light/dark mode (stores/themeStore.ts), not the accent.
 *  It has to be passed in, because these are inline styles and inline beats
 *  the `.dark [data-theme]` rules in index.css. In DARK the fills stay exactly
 *  as they are (white text still sits on them), but the pale tints become the
 *  colour mixed into the dark card, and accent-coloured TEXT is lifted until it
 *  reaches 4.5:1 on that tint and on the card. Light output is unchanged. */
export function themeVars(theme: string, mode: ColorMode = 'light'): CSSProperties {
  if (!isHexTheme(theme)) return {}
  const ink = accessibleColor(theme) ?? theme
  if (mode === 'dark') {
    const soft = mixHex(theme, DARK_CARD, 0.24)
    // Readable on the tint first, then on the lightest dark surface the text
    // lands on (slate-800: the timezone list, a hovered row) — which also
    // covers the slate-900 card. The second call only ever lightens, and that
    // cannot cost contrast on a dark tint.
    const onTint = accessibleColor(theme, { against: soft }) ?? theme
    return {
      '--accent': ink,
      '--accent-strong': `color-mix(in srgb, ${ink} 82%, black)`,
      '--accent-soft': soft,
      '--accent-softer': mixHex(theme, DARK_CARD, 0.12),
      '--accent-text': accessibleColor(onTint, { against: DARK_RAISED }) ?? onTint,
    } as CSSProperties
  }
  return {
    '--accent': ink,
    '--accent-strong': `color-mix(in srgb, ${ink} 82%, black)`,
    '--accent-soft': `color-mix(in srgb, ${theme} 16%, white)`,
    '--accent-softer': `color-mix(in srgb, ${theme} 7%, white)`,
    '--accent-text': `color-mix(in srgb, ${ink} 72%, black)`,
  } as CSSProperties
}

/** The representative hex for a theme — the value itself for a custom hex, or
 *  the preset's swatch. Used for branding snapshots / initials tiles. */
export function hexOfTheme(theme: string): string | null {
  if (isHexTheme(theme)) return theme
  return THEMES.find((t) => t.name === theme)?.swatch ?? null
}
