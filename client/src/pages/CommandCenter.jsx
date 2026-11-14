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
    <div className="ac-page">
      <DemoBanner />

      {/* Row 1: domain KPI strip */}
      <section aria-label="Health domains">
        <div className="ac-kpi-grid">
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
      <div className="ac-hero-grid">
        <Card
          title="Astronaut digital twin"
          className="hero-stage"
          action={
            <div className="flex items-center gap-3">
            
              <Link to="/twin" className="ac-link">
                Open full view
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          }
        >
          <TwinHero regions={data.bodyRegions} selected={null} onSelect={openRegion} />
        </Card>

        <div className="ac-side">
          <section className="ac-panel">
            <div className="ac-panel-head">
              <p className="ac-eyebrow">Overall status</p>
              <StatusBadge status={overall.status} />
            </div>

            <div className="ac-gauge">
              <RiskGauge value={overall.riskScore} status={overall.status} />
            </div>

            <dl className="ac-rows">
              {rows.map(([k, v]) => (
                <div key={k} className="ac-row">
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>

            <div className="ac-factors">
              <p className="ac-eyebrow">Contributing factors</p>
              {factors.length ? (
                <ul>
                  {factors.map((f, i) => (
                    <li key={i}>
                      <span className="ac-dot" />
                      <div>
                        <span className="ac-factor-title">{f.label}</span>
                        <span className="ac-factor-detail">{f.domain}: {f.detail}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="ac-muted">No contributing factors reported.</p>
              )}
            </div>
          </section>

          <Card title="Alerts timeline">
            <EventTimeline alerts={alerts} />
          </Card>
        </div>
      </div>

      {/* Row 3: telemetry | mission + link */}
      <div className="ac-bottom-grid">
        <Card title="Telemetry: overall risk trend">
          {overall.history?.length ? (
            <RiskTrendChart data={overall.history} color={STATUS_COLOR[overall.status]} />
          ) : (
            <EmptyState text="No trend data available." />
          )}
          <p className="ac-summary">{overall.summary}</p>
        </Card>
        <div className="ac-stack">
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