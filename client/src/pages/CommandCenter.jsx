import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'
import MetricCard from '../components/ui/MetricCard'
import AlertCard from '../components/ui/AlertCard'
import { LoadingState, ErrorState, EmptyState } from '../components/ui/StateViews'
import useAsync from '../hooks/useAsync'
import { getAstronautState, USE_MOCK } from '../services/api'
import { DOMAINS } from '../config/domains'

export default function CommandCenter() {
  const { data, error, loading, reload } = useAsync(getAstronautState)

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={reload} />
  if (!data) return <EmptyState />

  const { overall, domains, alerts } = data

  return (
    <div className="space-y-6">
      {USE_MOCK && (
        <div className="rounded-lg border border-dashed border-mission-yellow/50 bg-mission-yellow/5 px-4 py-2 text-sm text-mission-yellow">
          Demo mode: every value on this screen is SIMULATED_DEMO, not real NASA or astronaut data.
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-ice/70">Mission day</p>
            <p className="font-display text-5xl font-bold text-mission-yellow">{data.missionDay}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ice/70">Overall status</p>
            <div className="mt-2"><StatusBadge status={overall.status} /></div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ice/70">Risk score</p>
            <p className="font-display text-5xl font-bold text-white">
              {overall.riskScore ?? '—'}<span className="text-lg text-ice">/100</span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-ice/70">Confidence</p>
            <p className="font-display text-3xl font-bold text-white">
              {Math.round((overall.confidence ?? 0) * 100)}%
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-ice">{overall.summary}</p>
        <p className="mt-1 text-xs text-ice/60">
          Generated {new Date(data.generatedAt).toLocaleString()}
        </p>
      </Card>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">Health domains</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {DOMAINS.map((d) => {
            const dom = domains[d.key]
            return (
              <MetricCard
                key={d.key}
                to={d.path}
                label={d.label}
                value={dom?.riskScore}
                unit="/100 risk"
                status={dom?.status}
                source={dom?.source}
                footnote={dom?.dataQuality ? `Data: ${dom.dataQuality}` : undefined}
              />
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold text-white">Active alerts</h2>
        {alerts?.length ? (
          <div className="space-y-3">
            {alerts.map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        ) : (
          <EmptyState text="No active alerts." />
        )}
      </section>
    </div>
  )
}