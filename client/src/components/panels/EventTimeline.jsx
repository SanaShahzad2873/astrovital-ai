import SourceTag from '../ui/SourceTag'
import { EmptyState } from '../ui/StateViews'
import { STATUS_COLOR } from '../../config/status'

const SEV = {
  risk: STATUS_COLOR.risk,
  attention: STATUS_COLOR.attention,
  info: STATUS_COLOR.unknown,
}

const fmt = (ts) =>
  new Date(ts).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

export default function EventTimeline({ alerts = [] }) {
  const items = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  if (!items.length) return <EmptyState text="No events recorded." />

  return (
    <ol className="relative ml-2 space-y-4 border-l border-white/10 pl-6">
      {items.map((a) => {
        const color = SEV[a.severity] ?? SEV.info
        return (
          <li
            key={a.id}
            className="relative rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3"
          >
            <span
              className="absolute -left-[31px] top-4 h-2.5 w-2.5 rounded-full ring-4 ring-[#081631]"
              style={{ background: color, boxShadow: `0 0 10px ${color}` }}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white">{a.title}</p>
              <time className="shrink-0 text-xs tabular-nums text-ice/50">{fmt(a.timestamp)}</time>
            </div>
            <p className="mt-1 text-[13px] leading-relaxed text-ice/75">{a.message}</p>
            <SourceTag source={a.source} className="mt-2" />
          </li>
        )
      })}
    </ol>
  )
}