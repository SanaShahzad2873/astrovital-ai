const STATUS = {
  optimal:   { label: 'Optimal',        cls: 'bg-status-optimal/15 text-status-optimal border-status-optimal/40' },
  attention: { label: 'Attention',      cls: 'bg-status-attention/15 text-status-attention border-status-attention/40' },
  risk:      { label: 'High Risk',      cls: 'bg-status-risk/15 text-status-risk border-status-risk/40' },
  fatigue:   { label: 'Fatigue',        cls: 'bg-status-fatigue/15 text-status-fatigue border-status-fatigue/40' },
  radiation: { label: 'Radiation Prot.', cls: 'bg-status-radiation/15 text-status-radiation border-status-radiation/40' },
  unknown:   { label: 'No Data',        cls: 'bg-white/5 text-ice border-white/20' },
}

export default function StatusBadge({ status = 'unknown' }) {
  const s = STATUS[status] ?? STATUS.unknown
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${s.cls}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {s.label}
    </span>
  )
}