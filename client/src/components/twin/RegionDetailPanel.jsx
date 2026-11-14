import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'
import SourceTag from '../ui/SourceTag'
import { EmptyState } from '../ui/StateViews'
import { REGION_LABELS } from '../../config/bodyRegions'
import { DOMAINS } from '../../config/domains'

export default function RegionDetailPanel({ regionKey, regions, domains }) {
  if (!regionKey) {
    return (
      <Card title="Region details">
        <EmptyState text="Click a body region to see its health information." />
      </Card>
    )
  }

  const region = regions[regionKey] ?? { status: 'unknown', domain: null, summary: 'No data available.' }
  const domainMeta = DOMAINS.find((d) => d.key === region.domain)
  const domain = region.domain ? domains[region.domain] : null

  return (
    <Card title={REGION_LABELS[regionKey]} action={<StatusBadge status={region.status} />}>
      <p className="text-sm text-ice">{region.summary}</p>

      {domain ? (
        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs uppercase tracking-wide text-ice/60">Linked domain</dt>
            <dd className="font-medium text-white">{domainMeta?.label ?? region.domain}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ice/60">Domain risk score</dt>
            <dd className="font-medium text-white">{domain.riskScore ?? '—'}{domain.riskScore != null && '/100'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ice/60">Confidence</dt>
            <dd className="font-medium text-white">{Math.round((domain.confidence ?? 0) * 100)}%</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-ice/60">Data quality</dt>
            <dd className="font-medium capitalize text-white">{domain.dataQuality ?? 'unknown'}</dd>
          </div>
        </dl>
      ) : (
        <p className="mt-4 text-sm text-ice/70">No health domain is linked to this region yet.</p>
      )}

      {domain?.contributingFactors?.length > 0 && (
        <div className="mt-4">
          <p className="mb-1 text-xs uppercase tracking-wide text-ice/60">Contributing factors</p>
          <ul className="list-disc pl-5 text-sm text-ice">
            {domain.contributingFactors.map((f, i) => (
              <li key={i}>{f.label}: {f.detail}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <SourceTag source={domain?.source} />
        {domain?.lastUpdated && (
          <span className="text-xs text-ice/60">
            Updated {new Date(domain.lastUpdated).toLocaleString()}
          </span>
        )}
        {domainMeta && (
          <Link to={domainMeta.path} className="ml-auto text-sm font-semibold text-mission-yellow hover:underline">
            Open {domainMeta.label} →
          </Link>
        )}
      </div>

      <p className="mt-4 border-t border-white/10 pt-3 text-xs text-ice/60">
        Decision-support prototype. This is not a medical diagnosis.
      </p>
    </Card>
  )
}