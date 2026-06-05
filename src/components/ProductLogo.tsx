// Universal Polling brand icon — icon-only by design. The SDK's
// UniversalAppsNavBar renders the product name from its catalogue beside this
// slot, so a wordmark here would duplicate it.
export default function ProductLogo() {
  return (
    <span
      className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-orange-600 text-white"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5 H20.5" />
        <path d="M8 3.5 V6.5 M16 3.5 V6.5" />
        <path d="M8.5 14 l2.5 2.5 L16 11" />
      </svg>
    </span>
  )
}
