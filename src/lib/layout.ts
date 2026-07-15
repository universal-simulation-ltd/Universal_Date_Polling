// The page containers. Unusually for the suite, this app has two legitimate
// page widths: the create form is deliberately narrower than a poll's results
// table. So there is no single container — App.tsx picks the one matching the
// current view and hands it to BOTH the navbar (via the SDK's
// `contentClassName`) and the footer, so the suite switcher, the page content
// and the footer all share one edge on either view, at every breakpoint.
export const CONTAINER_POLL = 'mx-auto w-full max-w-3xl px-4 sm:px-6'
export const CONTAINER_CREATE = 'mx-auto w-full max-w-2xl px-4 sm:px-6'
