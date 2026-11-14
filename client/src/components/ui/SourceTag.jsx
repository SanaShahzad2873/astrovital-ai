// Data-honesty label required by the project rules: every displayed value
// must say where it comes from. Compact, quiet, but always visible.
const SOURCES = {
  NASA_RESEARCH: { text: 'NASA research', color: '#5AA9FF' },
  MEASURED: { text: 'Measured', color: '#22C55E' },
  SELF_REPORTED: { text: 'Self-reported', color: '#B9A5FF' },
  SIMULATED_DEMO: { text: 'Simulated demo', color: '#FFD100' },
}

export default function SourceTag({ source, className = '' }) {
  if (!source) return null
  const s = SOURCES[source] ?? { text: String(source).replace(/_/g, ' ').toLowerCase(), color: '#DCE6F1' }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-ice/75 ${className}`}
      title={`Data source: ${s.text}`}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} aria-hidden="true" />
      {s.text}
    </span>
  )
}