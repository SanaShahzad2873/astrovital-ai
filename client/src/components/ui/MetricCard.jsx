import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import SourceTag from './SourceTag'
import Sparkline from '../charts/Sparkline'
import { STATUS_COLOR } from '../../config/status'

export default function MetricCard({
  label, value, unit, status = 'unknown', source, footnote, to, icon: Icon, history,
}) {
  const missing = value === null || value === undefined
  const st = missing ? 'unknown' : status
  const color = STATUS_COLOR[st] ?? STATUS_COLOR.unknown

  // Change over the last 7 days, computed from the supplied history only
  const delta =
    history && history.length > 1
      ? history[history.length - 1].value - history[Math.max(0, history.length - 8)].value
      : null

  const body = (
    <div className="glass-card relative h-full overflow-hidden p-4 transition duration-200 hover:border-white/25 flex flex-col">
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: color }} aria-hidden="true" />

      <div className="flex items-center gap-2.5">
        {Icon && (
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-md"
            style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
          >
            <Icon size={17} />
          </span>
        )}
        <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{label}</p>
      </div>

      <div className="mt-4 mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="num text-4xl leading-none text-white">
            {missing ? '—' : value}
            {!missing && unit && (
              <span className="ml-1 font-mono text-xs font-medium text-ice/70">{unit}</span>
            )}
          </p>
          <p className="mt-1.5 h-4 font-mono text-[11px] text-ice/70">
            {delta !== null && !missing ? `${delta > 0 ? '+' : ''}${delta} / 7d` : ''}
          </p>
        </div>
        <div className="h-12 w-28 shrink-0">
          <Sparkline data={history} color={color} />
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-white/10 pt-3">
        <StatusBadge status={st} />
        <SourceTag source={source} />
        {footnote && <span className="font-mono text-[11px] text-ice/60">{footnote}</span>}
      </div>
    </div>
  )

  return to ? <Link to={to} className="block h-full">{body}</Link> : body
}