export function XMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="#fcf5e8"
      strokeWidth="10"
      strokeLinecap="round"
      aria-label="X"
    >
      <path d="M14 14L50 50M50 14L14 50" />
    </svg>
  );
}

export function OMark({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="#f59a45"
      strokeWidth="10"
      aria-label="O"
    >
      <circle cx="32" cy="32" r="19" />
    </svg>
  );
}
