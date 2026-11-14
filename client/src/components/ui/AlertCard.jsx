import { AlertTriangle, Info, OctagonAlert } from 'lucide-react'
import SourceTag from './SourceTag'

const SEVERITY = {
  attention: { icon: AlertTriangle, cls: 'border-l-status-attention text-status-attention' },
  risk:      { icon: OctagonAlert,  cls: 'border-l-status-risk text-status-risk' },
  info:      { icon: Info,          cls: 'border-l-ice text-ice' },
}

export default function AlertCard({ alert }) {
  const s = SEVERITY[alert.severity] ?? SEVERITY.info
  const Icon = s.icon
  return (
    <article className={`rounded-lg border border-white/10 border-l-4 bg-panel p-4 ${s.cls.split(' ')[0]}`}>
      <div className="flex items-start gap-3">
        <Icon size={20} className={s.cls.split(' ')[1]} />
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-white">{alert.title}</h4>
          <p className="mt-1 text-sm text-ice">{alert.message}</p>
          {alert.contributingFactors?.length > 0 && (
            <ul className="mt-2 list-disc pl-5 text-xs text-ice/80">
              {alert.contributingFactors.map((f, i) => (
                <li key={i}>{f.label}: {f.detail}</li>
              ))}
            </ul>
          )}
          <div className="mt-2 flex items-center gap-2">
            <SourceTag source={alert.source} />
            <time className="text-xs text-ice/60">{new Date(alert.timestamp).toLocaleString()}</time>
          </div>
        </div>
      </div>
    </article>
  )
}