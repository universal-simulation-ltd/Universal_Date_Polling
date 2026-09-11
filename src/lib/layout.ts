// The page containers. They are the SAME width again as of 2026-08-30, when the
// create screen went back to a single column — it was widened to max-w-5xl on
// 2026-08-11 to fit a two-column card (fields left, availability picker right),
// and reading width is right for one column. The two names are kept because
// they are two independent decisions: a results page must stay at reading
// width whatever the create screen does.
// App.tsx picks the one matching the current view and hands it to BOTH the
// navbar (via the SDK's `contentClassName`) and the footer, so the suite
// switcher, the page content and the footer all share one edge on either view,
// at every breakpoint.
export const CONTAINER_POLL = 'mx-auto w-full max-w-3xl px-4 sm:px-6'
export const CONTAINER_CREATE = 'mx-auto w-full max-w-3xl px-4 sm:px-6'

/**
 * Where to scroll so a block lands in the MIDDLE of the screen without pushing
 * its own heading off the top of it.
 *
 * Used when the host picks the Calendar view: the grid is tall, it opens below
 * the fold, and leaving the page where it was means clicking a tab and seeing
 * nothing move. Centring it is the natural answer — but centring alone would
 * scroll a short grid past its "Availability" heading, so the host would land
 * on a calendar with no label above it. The heading is therefore a hard stop:
 * centre, unless that would take the title above the top of the screen, in
 * which case stop with the title AT the top.
 *
 * All measurements are DOCUMENT coordinates (page top = 0). `stickyHeight` is
 * the bar pinned over the top of the viewport — the suite navbar — because the
 * part of the screen a reader can actually see starts underneath it, and a
 * title scrolled to y=0 would be hidden behind it rather than at the top.
 *
 * Pure arithmetic, so the awkward cases (a grid taller than the screen, a page
 * too short to scroll) are testable without a browser.
 */
export function centreScrollTop({
  targetTop, targetHeight, titleTop, viewportHeight, stickyHeight = 0,
}: {
  targetTop: number
  targetHeight: number
  titleTop: number
  viewportHeight: number
  stickyHeight?: number
}): number {
  const visible = Math.max(0, viewportHeight - stickyHeight)
  // Never negative: a block taller than the visible area has no gap to share,
  // so it starts flush under the sticky bar instead of hanging above it.
  const gap = Math.max(0, (visible - targetHeight) / 2)
  const centred = targetTop - stickyHeight - gap
  const titleAtTop = titleTop - stickyHeight
  return Math.max(0, Math.min(centred, titleAtTop))
}
