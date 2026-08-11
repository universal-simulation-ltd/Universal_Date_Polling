// The page containers. Unusually for the suite, this app has two legitimate
// page widths: since 2026-08-11 the create screen is a two-column card (form
// fields left, the availability picker right), so it is the WIDER of the two;
// a poll's results page stays at reading width. There is no single container —
// App.tsx picks the one matching the current view and hands it to BOTH the
// navbar (via the SDK's `contentClassName`) and the footer, so the suite
// switcher, the page content and the footer all share one edge on either view,
// at every breakpoint.
export const CONTAINER_POLL = 'mx-auto w-full max-w-3xl px-4 sm:px-6'
export const CONTAINER_CREATE = 'mx-auto w-full max-w-5xl px-4 sm:px-6'
