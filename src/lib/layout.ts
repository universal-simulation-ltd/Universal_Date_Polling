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
