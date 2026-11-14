import SourceTag from '../ui/SourceTag'
import { EmptyState } from '../ui/StateViews'
import { STATUS_COLOR } from '../../config/status'

const SEV = {
  risk: STATUS_COLOR.risk,
  attention: STATUS_COLOR.attention,
  info: STATUS_COLOR.unknown,
}

export default function EventTimeline({ alerts = [] }) {
  const items = [...alerts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  if (!items.length) return <EmptyState text="No events recorded." />

  return (
    <ol className="relative ml-1.5 space-y-5 border-l border-white/15 pl-5">
      {items.map((a) => (
        <li key={a.id} className="relative">
          <span
            className="absolute -left-[26px] top-1 h-3 w-3 rounded-full ring-4 ring-space-navy"
            style={{ background: SEV[a.severity] ?? SEV.info }}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-white">{a.title}</p>
          <p className="mt-0.5 text-sm text-ice">{a.message}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <SourceTag source={a.source} />
            <time className="font-mono text-[11px] text-ice/60">
              {new Date(a.timestamp).toLocaleString()}
            </time>
          </div>
        </li>
      ))}
    </ol>
  )
}