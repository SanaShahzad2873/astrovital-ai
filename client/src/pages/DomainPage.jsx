import { Info } from 'lucide-react'
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
  const pct = hasScore ? Math.max(0, Math.min(100, Number(dom.riskScore))) : 0

  const facts = [
    ['Confidence', `${Math.round((dom.confidence ?? 0) * 100)}%`],
    ['Data quality', dom.dataQuality ?? 'unknown'],
    ['Last updated', dom.lastUpdated ? new Date(dom.lastUpdated).toLocaleString() : 'No data yet'],
  ]

  return (
    <div className="ac-page">
      <DemoBanner />

      {/* Header: domain identity, status and score */}
      <section className="glass-card relative overflow-hidden p-6">
        <span
          className="absolute inset-x-8 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
          aria-hidden="true"
        />
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {Icon && (
              <span
                className="grid h-14 w-14 place-items-center rounded-2xl"
                style={{
                  background: `color-mix(in srgb, ${color} 14%, transparent)`,
                  color,
                  boxShadow: `0 0 28px -8px ${color}`,
                }}
              >
                <Icon size={28} />
              </span>
            )}
            <div>
              <p className="text-sm font-medium text-ice/55">Health domain</p>
              <h1 className="mt-0.5 text-[30px] font-semibold leading-tight tracking-tight text-white">
                {title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <StatusBadge status={dom.status} />
                <SourceTag source={dom.source} />
              </div>
            </div>
          </div>

          <div className="min-w-[180px] text-right">
            <p className="text-xs font-medium text-ice/55">Risk score</p>
            <p className="num text-[52px] leading-none text-white">
              {hasScore ? dom.riskScore : '—'}
              {hasScore && <span className="ml-1.5 text-base font-medium text-ice/50">/100</span>}
            </p>
          </div>
        </div>

        <div
          className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/[0.08]"
          role="img"
          aria-label={hasScore ? `Risk score ${pct} out of 100` : 'No risk score'}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, color-mix(in srgb, ${color} 55%, transparent), ${color})`,
              boxShadow: hasScore ? `0 0 10px ${color}` : 'none',
            }}
          />
        </div>
      </section>

      {/* Metrics */}
      <section aria-label="Measurements">
        {metrics.length ? (
          <div className="ac-kpi-grid">
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
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_380px]">
        <Card title={`${title} risk trend`} action={<SourceTag source={dom.source} />}>
          {dom.history?.length ? (
            <RiskTrendChart data={dom.history} color={color} />
          ) : (
            <EmptyState text="No trend data available." />
          )}
        </Card>

        <Card title="Contributing factors">
          {dom.contributingFactors?.length ? (
            <ul className="space-y-4">
              {dom.contributingFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="ac-dot" />
                  <div>
                    <span className="ac-factor-title">{f.label}</span>
                    <span className="ac-factor-detail">{f.detail}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-ice/60">No contributing factors reported.</p>
          )}

          <dl className="ac-rows mt-5 border-t border-white/[0.08] pt-1">
            {facts.map(([k, v]) => (
              <div key={k} className="ac-row" style={{ borderTop: 'none' }}>
                <dt>{k}</dt>
                <dd className="capitalize">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>

      {/* Data limitations */}
      {limitations.length > 0 && (
        <Card title="Data limitations">
          <ul className="grid gap-3 md:grid-cols-2">
            {limitations.map((t, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5"
              >
                <Info size={17} className="mt-0.5 shrink-0 text-hud" />
                <p className="text-sm leading-relaxed text-ice/80">{t}</p>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}