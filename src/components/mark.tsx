export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <clipPath id="mark-clip">
          <rect width="32" height="32" rx="3" />
        </clipPath>
      </defs>
      <g clipPath="url(#mark-clip)">
        <rect width="32" height="32" className="fill-primary" />
        <path d="M5 27 L14 5 H18 L9 27 Z" className="fill-bg" />
        <path d="M14 27 L23 5 H27 L18 27 Z" className="fill-bg opacity-80" />
        <rect y="28" width="10.7" height="4" fill="#e23b3b" />
        <rect x="10.7" y="28" width="10.6" height="4" fill="#f4efe4" />
        <rect x="21.3" y="28" width="10.7" height="4" fill="#2fbf6a" />
      </g>
    </svg>
  );
}