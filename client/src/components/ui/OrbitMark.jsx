export default function OrbitMark({ size = 44 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <ellipse cx="32" cy="32" rx="28" ry="11" transform="rotate(-28 32 32)"
        stroke="var(--color-signal)" strokeWidth="2.5" />
      <circle cx="32" cy="32" r="12" fill="var(--color-nasa-blue)"
        stroke="var(--color-ice)" strokeWidth="1.5" />
      <path d="M26 33 L30 37 L38 27" stroke="var(--color-mission-yellow)"
        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="55" cy="23" r="3.2" fill="var(--color-mission-yellow)" />
    </svg>
  )
}