// GENERATED FILE — do not edit by hand.
// Source: backoffice/universal-platform/scripts/app-marks/marks.mjs
// Regenerate: node scripts/app-marks/build.mjs (from backoffice/universal-platform)
// Mark: Universal Date Polling — A calendar, and a date that works.
// Hover: The tick draws itself across the date.
//
// Icon-only by design: the SDK's UniversalAppsNavBar renders the product name
// from its catalogue beside this slot, so a wordmark here would print it twice.

const CSS = `
  /* Resting states */
  .uam-polling-tick { stroke-dashoffset: 27; transition: stroke-dashoffset .5s cubic-bezier(0.16,1,0.3,1); }

  /* Active states */
  .uam-host-polling:hover .uam-polling-tick,
  .uam-host-polling:focus-visible .uam-polling-tick { stroke-dashoffset: 0; }

  @media (prefers-reduced-motion: reduce) {
    .uam-polling-tick { transition: none !important; }
  }
`

export default function ProductLogo() {
  return (
    <span
      className="uam-host-polling inline-flex h-6 w-6 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      <style>{CSS}</style>
      <svg viewBox="0 0 64 64" className="h-6 w-6" aria-hidden="true">
        <defs>
          <linearGradient id="uam-nav-polling-tile" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fe8c01" />
            <stop offset="1" stopColor="#e05504" />
          </linearGradient>
        </defs>
        <rect width="64" height="64" rx="14" fill="url(#uam-nav-polling-tile)" />
        <g fill="none" strokeWidth={4.8} strokeLinecap="round" stroke="#ffffff">
          <rect x={12} y={16} width={40} height={34} rx={6} />
          <path d="M12 26H52" />
          <path d="M22 11V21" />
          <path d="M42 11V21" />
        </g>
        <path d="M23 37 L29.5 43.5 L42 31" fill="none" strokeWidth={5.2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={27} stroke="#ffffff" className="uam-polling-tick" />
      </svg>
    </span>
  )
}
