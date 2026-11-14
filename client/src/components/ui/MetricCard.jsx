import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import SourceTag from './SourceTag'
import Sparkline from '../charts/Sparkline'
import { STATUS_COLOR } from '../../config/status'

function Arrow({ up }) {
  return (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path
        d={up ? 'M6 10V2M2.5 5.5L6 2l3.5 3.5' : 'M6 2v8M2.5 6.5L6 10l3.5-3.5'}
        stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

// showSource: the project rules require a source label on every value,
// so it is shown by default (pass showSource={false} only if a parent already labels it).
export default function MetricCard({
  label, value, unit, status = 'unknown', source, footnote, to, icon: Icon, history,
  showSource = true,
}) {
  const missing = value === null || value === undefined
  const st = missing ? 'unknown' : status
  const color = STATUS_COLOR[st] ?? STATUS_COLOR.unknown
  const hasTrend = Array.isArray(history) && history.length > 1

  // Change over the last 7 days, computed from the supplied history only
  const delta = hasTrend
    ? Number((history[history.length - 1].value - history[Math.max(0, history.length - 8)].value).toFixed(1))
    : null

  const footText = footnote ? footnote.replace(/^data:/i, 'Data quality:') : null
  const pct = missing ? 0 : Math.max(0, Math.min(100, Number(value)))

  const body = (
    <div className="glass-card group relative flex h-full flex-col overflow-hidden p-5 transition duration-200 hover:border-white/25">
      {/* fine status-coloured glow along the top edge */}
      <span
        className="absolute inset-x-6 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
        aria-hidden="true"
      />

      {/* header: icon + name, status on the right */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {Icon && (
            <span
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl"
              style={{ background: `color-mix(in srgb, ${color} 14%, transparent)`, color }}
            >
              <Icon size={18} />
            </span>
          )}
          <p className="min-w-0 truncate text-[15px] font-semibold text-white">{label}</p>
        </div>
        <StatusBadge status={st} />
      </div>

      {/* score on the left, trend on the right */}
      <div className="mt-5 flex items-end justify-between gap-4">
        <div className="min-w-0">
          {missing ? (
            <p className="text-lg font-semibold text-ice/50">No data yet</p>
          ) : (
            <p className="flex items-baseline gap-1.5">
              <span className="num text-[46px] leading-none tracking-tight text-white">{value}</span>
              {unit && <span className="text-sm font-medium text-ice/50">{unit}</span>}
            </p>
          )}
          <p className="mt-2 flex h-5 items-center gap-1 text-xs font-medium text-ice/70 tabular-nums">
            {delta !== null && !missing ? (
              <>
                <Arrow up={delta >= 0} />
                {delta > 0 ? '+' : ''}{delta} this week
              </>
            ) : (
              <span className="text-ice/40">{missing ? 'Waiting for sensor data' : ''}</span>
            )}
          </p>
        </div>

        <div className="h-14 w-32 shrink-0">
          {hasTrend ? (
            <Sparkline data={history} color={color} />
          ) : (
            <div className="flex h-full items-end">
              <div className="h-px w-full bg-white/10" />
            </div>
          )}
        </div>
      </div>

      {/* score bar: how full the 0-100 scale is */}
      <div className="mt-5" role="img" aria-label={missing ? 'No score' : `Score ${pct} out of 100`}>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.08]">
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
              boxShadow: missing ? 'none' : `0 0 10px ${color}`,
            }}
          />
        </div>
      </div>

      {/* quiet footer */}
      <div className="mt-3 flex min-h-[18px] flex-wrap items-center gap-2">
        {footText && <span className="text-xs text-ice/55">{footText}</span>}
        {showSource && <SourceTag source={source} />}
      </div>
    </div>
  )

  return to ? <Link to={to} className="block h-full">{body}</Link> : body
}