import type { CSSProperties } from 'react'
import { accessibleColor } from '@unisim/sdk'
import { isHexTheme, THEMES } from './types'

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
 *  stored theme stays raw; only the render is adjusted. */
export function themeVars(theme: string): CSSProperties {
  if (!isHexTheme(theme)) return {}
  const ink = accessibleColor(theme) ?? theme
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
