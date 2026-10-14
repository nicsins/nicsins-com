export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="3" className="fill-primary" />
      <path d="M5 27 L14 5 H18 L9 27 Z" className="fill-bg" />
      <path d="M14 27 L23 5 H27 L18 27 Z" className="fill-bg opacity-80" />
    </svg>
  );
}
