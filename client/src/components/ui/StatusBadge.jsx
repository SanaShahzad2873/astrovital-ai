const STATUS = {
  optimal:   { label: 'Optimal',              cls: 'bg-status-optimal/12 text-status-optimal border-status-optimal/35' },
  attention: { label: 'Attention',            cls: 'bg-status-attention/12 text-status-attention border-status-attention/35' },
  risk:      { label: 'High risk',            cls: 'bg-status-risk/12 text-status-risk border-status-risk/40' },
  fatigue:   { label: 'Fatigue',              cls: 'bg-status-fatigue/12 text-status-fatigue border-status-fatigue/35' },
  radiation: { label: 'Radiation protection', cls: 'bg-status-radiation/12 text-status-radiation border-status-radiation/35' },
  unknown:   { label: 'No data',              cls: 'bg-white/[0.05] text-ice/75 border-white/15' },
}

export default function StatusBadge({ status = 'unknown' }) {
  const s = STATUS[status] ?? STATUS.unknown
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${s.cls}`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full bg-current"
        style={{ boxShadow: status === 'unknown' ? 'none' : '0 0 6px currentColor' }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  )
}