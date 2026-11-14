import { Link, useNavigate } from 'react-router-dom'
import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import SourceTag from '../components/ui/SourceTag'
import MetricCard from '../components/ui/MetricCard'
import RiskGauge from '../components/ui/RiskGauge'
import DemoBanner from '../components/ui/DemoBanner'
import RiskTrendChart from '../components/charts/RiskTrendChart'
import TwinHero from '../components/twin/TwinHero'
import MissionProgressCard from '../components/panels/MissionProgressCard'
import EarthLinkCard from '../components/panels/EarthLinkCard'
import EventTimeline from '../components/panels/EventTimeline'
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews'
import useAsync from '../hooks/useAsync'
import { getAstronautState } from '../services/api'
import { DOMAINS } from '../config/domains'
import { STATUS_COLOR } from '../config/status'

export default function CommandCenter() {
  const { data, error, loading, reload } = useAsync(getAstronautState)
  const navigate = useNavigate()

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return <EmptyState />

  const { overall, domains, alerts } = data
  const rows = [
    ['Confidence', `${Math.round((overall.confidence ?? 0) * 100)}%`],
    ['Active alerts', alerts?.length ?? 0],
    ['Generated', new Date(data.generatedAt).toLocaleTimeString()],
  ]
  const factors = DOMAINS.flatMap((d) =>
    (domains[d.key]?.contributingFactors ?? []).map((f) => ({ ...f, domain: d.label }))
  ).slice(0, 3)
  const openRegion = (key) => navigate(`/twin?region=${key}`)

  return (
    <div className="space-y-5">
      <DemoBanner />

      {/* Row 1: domain KPI strip */}
      <section aria-label="Health domains">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DOMAINS.map((d) => {
            const dom = domains[d.key]
            return (
              <MetricCard
                key={d.key}
                to={d.path}
                icon={d.icon}
                label={d.label}
                value={dom?.riskScore}
                unit="/100"
                status={dom?.status}
                source={dom?.source}
                history={dom?.history}
                footnote={dom?.dataQuality ? `data: ${dom.dataQuality}` : undefined}
              />
            )
          })}
        </div>
      </section>

      {/* Row 2: astronaut hero | status + alerts */}
      <div className="grid gap-4 2xl:grid-cols-[1fr_380px]">
        <Card
          title="Astronaut digital twin"
          className="hero-stage"
          action={
            <div className="flex items-center gap-3">
              <SourceTag source={overall.source} />
              <Link to="/twin" className="text-sm font-semibold text-mission-yellow hover:underline">
                Open full view →
              </Link>
            </div>
          }
        >
          <TwinHero regions={data.bodyRegions} selected={null} onSelect={openRegion} />
        </Card>

        <div className="grid content-start gap-4 md:grid-cols-2 2xl:grid-cols-1">
          <section className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="eyebrow">Overall status</p>
              <StatusBadge status={overall.status} />
            </div>
            <div className="my-4 flex justify-center">
              <RiskGauge value={overall.riskScore} status={overall.status} />
            </div>
            <dl className="divide-y divide-white/10 text-sm">
              {rows.map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2">
                  <dt className="text-ice/70">{k}</dt>
                  <dd className="font-mono text-white">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 border-t border-white/10 pt-3">
              <p className="eyebrow mb-2">Contributing factors</p>
              {factors.length ? (
                <ul className="space-y-2 text-sm">
                  {factors.map((f, i) => (
                    <li key={i}>
                      <span className="text-white">{f.label}</span>
                      <span className="block text-xs text-ice/70">{f.domain}: {f.detail}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-ice/60">No contributing factors reported.</p>
              )}
            </div>
          </section>

          <Card title="Alerts timeline">
            <EventTimeline alerts={alerts} />
          </Card>
        </div>
      </div>

      {/* Row 3: telemetry | mission + link */}
      <div className="grid gap-4 xl:grid-cols-[1fr_380px]">
        <Card title="Telemetry: overall risk trend" action={<SourceTag source={overall.source} />}>
          {overall.history?.length ? (
            <RiskTrendChart data={overall.history} color={STATUS_COLOR[overall.status]} />
          ) : (
            <EmptyState text="No trend data available." />
          )}
          <p className="mt-2 text-sm text-ice">{overall.summary}</p>
        </Card>
        <div className="space-y-4">
          <MissionProgressCard
            day={data.missionDay}
            total={data.missionTotalDays}
            source={overall.source}
          />
          <EarthLinkCard generatedAt={data.generatedAt} />
        </div>
      </div>
    </div>
  )
}