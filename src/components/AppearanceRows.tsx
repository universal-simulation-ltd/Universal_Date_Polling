import { MENU } from '@unisim/sdk'
import { useThemeStore, type ThemePref } from '../stores/themeStore'

// "Appearance" — Light / Dark / Match my device, as rows in the navbar's
// Actions menu. ROWS ONLY: the SDK renders them inside its own dropdown, so
// there is no trigger or panel here.
//
// Offered on EVERY screen, unlike the create-only App Settings row: a voter who
// opens a poll link wants the choice as much as the host who made it.
//
// Styling is inline rather than Tailwind to match the SDK dropdown's own rows
// (the same 8px/14px rhythm and 13px label). Those rows are inline styles too,
// so they cannot answer the `.dark` class — hence two palettes chosen from the
// resolved theme. The light column is Universal Video's, unchanged; the dark
// one is the SDK's own `MENU.dark`, so these rows sit in a dark dropdown the
// way its own rows do.
const PALETTE = {
  light: {
    rest: '#374151',
    label: '#9ca3af',
    hoverBg: '#fff7ed',
    hoverText: '#c2410c',
    selectedBg: '#fff7ed',
    selectedText: '#c2410c',
  },
  dark: {
    rest: MENU.dark.body,
    label: MENU.dark.faint,
    hoverBg: MENU.dark.rowHover,
    hoverText: MENU.dark.rowHoverText,
    selectedBg: MENU.dark.accentBg,
    selectedText: MENU.dark.accentText,
  },
} as const

const CHOICES: { pref: ThemePref; label: string; glyph: string }[] = [
  { pref: 'light', label: 'Light', glyph: '☀️' },
  { pref: 'dark', label: 'Dark', glyph: '🌙' },
  // Offered, but deliberately NOT the default — see stores/themeStore.ts.
  { pref: 'system', label: 'Match my device', glyph: '🖥️' },
]

export default function AppearanceRows() {
  const pref = useThemeStore((s) => s.pref)
  const effective = useThemeStore((s) => s.effective)
  const setPref = useThemeStore((s) => s.setPref)
  const p = PALETTE[effective]

  return (
    <>
      <div
        style={{
          padding: '8px 14px 4px',
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: p.label,
        }}
      >
        Appearance
      </div>
      {CHOICES.map((c) => {
        const selected = pref === c.pref
        const restBg = selected ? p.selectedBg : 'transparent'
        const restText = selected ? p.selectedText : p.rest
        return (
          <button
            key={c.pref}
            type="button"
            role="menuitemradio"
            aria-checked={selected}
            onClick={() => setPref(c.pref)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              width: '100%',
              padding: '8px 14px',
              fontSize: 13,
              fontFamily: 'inherit',
              textAlign: 'left',
              border: 0,
              background: restBg,
              color: restText,
              cursor: 'pointer',
              transition: 'background 120ms, color 120ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = p.hoverBg
              e.currentTarget.style.color = p.hoverText
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = restBg
              e.currentTarget.style.color = restText
            }}
          >
            <span aria-hidden>{c.glyph}</span>
            <span style={{ flex: 1, minWidth: 0, fontWeight: 500, lineHeight: 1.3 }}>{c.label}</span>
            {selected && <span aria-hidden style={{ color: 'inherit' }}>✓</span>}
          </button>
        )
      })}
    </>
  )
}
