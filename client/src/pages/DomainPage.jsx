import Card from '../components/ui/Card'
import MetricCard from '../components/ui/MetricCard'
import StatusBadge from '../components/ui/StatusBadge'
import SourceTag from '../components/ui/SourceTag'
import DemoBanner from '../components/ui/DemoBanner'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews'
import useAsync from '../hooks/useAsync'
import { getAstronautState } from '../services/api'
import { STATUS_COLOR } from '../config/status'

export default function DomainPage({ domainKey, title, icon: Icon, limitations = [] }) {
  const { data, error, loading, reload } = useAsync(getAstronautState)

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={reload} />
  const dom = data?.domains?.[domainKey]
  if (!dom) return <EmptyState text="This domain is not in the data yet." />

  const metrics = dom.metrics ?? []
  const color = STATUS_COLOR[dom.status] ?? STATUS_COLOR.unknown
  const hasScore = dom.riskScore !== null && dom.riskScore !== undefined

  const facts = [
    ['Confidence', `${Math.round((dom.confidence ?? 0) * 100)}%`],
    ['Data quality', dom.dataQuality ?? 'unknown'],
    ['Last updated', dom.lastUpdated ? new Date(dom.lastUpdated).toLocaleString() : 'No data yet'],
  ]

  return (
    <div className="space-y-5">
      <DemoBanner />

      {/* Header */}
      <section className="glass-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex items-center gap-3">
          {Icon && (
            <span
              className="grid h-12 w-12 place-items-center rounded-lg"
              style={{ background: `color-mix(in srgb, ${color} 16%, transparent)`, color }}
            >
              <Icon size={26} />
            </span>
          )}
          <div>
            <p className="eyebrow">Health domain</p>
            <h1 className="text-3xl font-bold text-white">{title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <StatusBadge status={dom.status} />
          <SourceTag source={dom.source} />
          <p className="num text-4xl text-white">
            {hasScore ? dom.riskScore : '—'}
            {hasScore && <span className="ml-1 font-mono text-xs text-ice/70">/100</span>}
          </p>
        </div>
      </section>

      {/* Metrics */}
      <section aria-label="Measurements">
        {metrics.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((m) => (
              <MetricCard
                key={m.key}
                label={m.label}
                value={m.value}
                unit={m.unit}
                status={m.status}
                source={m.source}
                history={m.history}
                footnote={m.note ?? (m.quality ? `data: ${m.quality}` : undefined)}
              />
            ))}
          </div>
        ) : (
          <Card><EmptyState text="No measurements available for this domain yet." /></Card>
        )}
      </section>

      {/* Trend + factors */}
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Card title={`${title} risk trend`} action={<SourceTag source={dom.source} />}>
          {dom.history?.length ? (
            <RiskTrendChart data={dom.history} color={color} />
          ) : (
            <EmptyState text="No trend data available." />
          )}
        </Card>

        <Card title="Contributing factors">
          {dom.contributingFactors?.length ? (
            <ul className="space-y-3 text-sm">
              {dom.contributingFactors.map((f, i) => (
                <li key={i}>
                  <span className="text-white">{f.label}</span>
                  <span className="block text-xs text-ice/70">{f.detail}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ice/60">No contributing factors reported.</p>
          )}
          <dl className="mt-4 divide-y divide-white/10 border-t border-white/10 text-sm">
            {facts.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2">
                <dt className="text-ice/70">{k}</dt>
                <dd className="font-mono text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {/* Data limitations */}
      {limitations.length > 0 && (
        <Card title="Data limitations">
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ice">
            {limitations.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </Card>
      )}
    </div>
  )
}