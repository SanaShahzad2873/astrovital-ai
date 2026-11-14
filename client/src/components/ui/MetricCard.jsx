import { Link } from 'react-router-dom'
import Card from './Card'
import StatusBadge from './StatusBadge'
import SourceTag from './SourceTag'

export default function MetricCard({ label, value, unit, status, source, footnote, to }) {
  const missing = value === null || value === undefined
  const body = (
    <Card className="h-full transition-colors hover:border-mission-yellow/40">
      <div className="mb-3 flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-ice">{label}</p>
        <StatusBadge status={missing ? 'unknown' : status} />
      </div>

      <p className="font-display text-4xl font-bold text-white">
        {missing ? '—' : value}
        {!missing && unit && <span className="ml-1 text-base font-medium text-ice">{unit}</span>}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <SourceTag source={source} />
        {footnote && <span className="text-xs text-ice/70">{footnote}</span>}
      </div>
    </Card>
  )
  return to ? <Link to={to} className="block">{body}</Link> : body
}