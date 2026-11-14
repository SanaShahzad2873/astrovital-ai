const SOURCES = {
  NASA_RESEARCH:  { label: 'NASA Research',  cls: 'border-nasa-blue bg-nasa-blue/40 text-white' },
  MEASURED:       { label: 'Measured',       cls: 'border-status-optimal/50 text-status-optimal' },
  SELF_REPORTED:  { label: 'Self-reported',  cls: 'border-ice/40 text-ice' },
  SIMULATED_DEMO: { label: 'Simulated demo', cls: 'border-dashed border-mission-yellow/60 text-mission-yellow' },
}

export default function SourceTag({ source }) {
  const s = SOURCES[source]
  if (!s) {
    return (
      <span className="rounded border border-dashed border-white/30 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-ice/70">
        Source unknown
      </span>
    )
  }
  return (
    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.cls}`}>
      {s.label}
    </span>
  )
}