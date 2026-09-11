import { describe, expect, it } from 'vitest'
import { centreScrollTop } from './layout'

// A 1000px-tall screen with a 60px sticky navbar over it: 940px is what the
// reader can actually see, starting 60px down.
const SCREEN = { viewportHeight: 1000, stickyHeight: 60 }

describe('centreScrollTop', () => {
  it('puts the block in the middle of the visible area', () => {
    const top = centreScrollTop({
      ...SCREEN, targetTop: 2000, targetHeight: 400, titleTop: 1900,
    })
    // 940 visible - 400 tall = 540 of gap, half above: the block's top should
    // sit 270px below the bar, i.e. 330px down the screen.
    expect(top).toBe(2000 - 60 - 270)
    expect(2000 - top).toBe(330)
  })

  it('stops with the title at the top rather than scrolling past it', () => {
    // A tall grid — 900px of it against 940px of visible screen — so centring
    // would scroll 1920, which is past the heading at 1900. The heading wins,
    // and lands exactly under the sticky bar rather than behind it.
    const top = centreScrollTop({
      ...SCREEN, targetTop: 2000, targetHeight: 900, titleTop: 1900,
    })
    expect(top).toBe(1900 - 60)
    expect(1900 - top).toBe(60)
  })

  it('leaves a short block centred — the title is a limit, not a target', () => {
    const top = centreScrollTop({
      ...SCREEN, targetTop: 2000, targetHeight: 100, titleTop: 1960,
    })
    // Centred at 1520, well short of the 1900 the heading would allow.
    expect(top).toBe(1520)
  })

  it('aligns a block taller than the screen under the bar instead of above it', () => {
    const top = centreScrollTop({
      ...SCREEN, targetTop: 3000, targetHeight: 2000, titleTop: 2900,
    })
    // No gap to share, so the top of the block meets the bottom of the bar —
    // still capped by the title, which is only 100px higher up.
    expect(top).toBe(2900 - 60)
  })

  it('never scrolls above the top of the page', () => {
    expect(centreScrollTop({ ...SCREEN, targetTop: 80, targetHeight: 200, titleTop: 40 })).toBe(0)
  })

  it('works with no sticky bar at all', () => {
    const top = centreScrollTop({
      viewportHeight: 800, stickyHeight: 0, targetTop: 1500, targetHeight: 200, titleTop: 1400,
    })
    expect(top).toBe(1500 - 300)
  })
})
