import { Link } from 'react-router-dom'
import { MousePointerClick } from 'lucide-react'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'
import SourceTag from '../ui/SourceTag'
import { REGION_LABELS } from '../../config/bodyRegions'
import { DOMAINS } from '../../config/domains'
import { STATUS_COLOR } from '../../config/status'

function Stat({ label, children }) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-3">
      <dt className="text-xs font-medium text-ice/55">{label}</dt>
      <dd className="mt-1 text-[15px] font-semibold text-white">{children}</dd>
    </div>
  )
}

export default function RegionDetailPanel({ regionKey, regions, domains }) {
  if (!regionKey) {
    return (
      <Card title="Region details">
        <div className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/[0.05] text-ice/70">
            <MousePointerClick size={22} />
          </span>
          <p className="max-w-[240px] text-sm leading-relaxed text-ice/65">
            Select a body region on the astronaut to see its health information.
          </p>
        </div>
      </Card>
    )
  }

  const region = regions[regionKey] ?? { status: 'unknown', domain: null, summary: 'No data available.' }
  const domainMeta = DOMAINS.find((d) => d.key === region.domain)
  const domain = region.domain ? domains[region.domain] : null
  const color = STATUS_COLOR[region.status] ?? STATUS_COLOR.unknown
  const score = domain?.riskScore
  const pct = score != null ? Math.max(0, Math.min(100, Number(score))) : 0

  return (
    <Card title={REGION_LABELS[regionKey]} action={<StatusBadge status={region.status} />}>
      <p className="text-sm leading-relaxed text-ice/85">{region.summary}</p>

      {domain ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-3">
            <Stat label="Linked domain">{domainMeta?.label ?? region.domain}</Stat>
            <Stat label="Data quality">
              <span className="capitalize">{domain.dataQuality ?? 'unknown'}</span>
            </Stat>
            <Stat label="Domain risk score">
              {score ?? '—'}
              {score != null && <span className="ml-1 text-xs font-medium text-ice/50">/100</span>}
            </Stat>
            <Stat label="Confidence">{Math.round((domain.confidence ?? 0) * 100)}%</Stat>
          </dl>

          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
                boxShadow: `0 0 10px ${color}`,
              }}
            />
          </div>
        </>
      ) : (
        <p className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-ice/65">
          No health domain is linked to this region yet.
        </p>
      )}

      {domain?.contributingFactors?.length > 0 && (
        <div className="mt-6">
          <p className="eyebrow mb-3">Contributing factors</p>
          <ul className="space-y-3">
            {domain.contributingFactors.map((f, i) => (
              <li key={i} className="flex gap-3">
                <span
                  className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-mission-yellow"
                  style={{ boxShadow: '0 0 8px rgba(255,209,0,0.7)' }}
                />
                <p className="text-sm leading-relaxed text-ice/80">
                  <span className="font-semibold text-white">{f.label}</span>
                  <span className="block text-[13px] text-ice/60">{f.detail}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-white/[0.08] pt-4">
        <SourceTag source={domain?.source} />
        {domain?.lastUpdated && (
          <span className="text-xs text-ice/50">
            Updated {new Date(domain.lastUpdated).toLocaleString()}
          </span>
        )}
        {domainMeta && (
          <Link to={domainMeta.path} className="ac-link ml-auto">
            Open {domainMeta.label}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        )}
      </div>

      <p className="mt-4 text-xs leading-relaxed text-ice/45">
        Decision-support prototype. This is not a medical diagnosis.
      </p>
    </Card>
  )
}