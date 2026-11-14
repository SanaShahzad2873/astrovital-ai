import Card from '../ui/Card'
import SourceTag from '../ui/SourceTag'

export default function MissionProgressCard({ day, total, source }) {
  const valid = Number.isFinite(day) && Number.isFinite(total) && total > 0
  const pct = valid ? Math.min(100, Math.round((day / total) * 100)) : 0

  return (
    <Card title="Mission progress" action={<SourceTag source={source} />}>
      <p className="eyebrow">Demo mission</p>
      <p className="mt-1 num text-4xl text-white">
        {valid ? <>Day <span className="text-mission-yellow">{day}</span></> : '—'}
        {valid && <span className="ml-2 font-mono text-sm font-medium text-ice/70">of {total}</span>}
      </p>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
        <div className="h-full rounded-full bg-mission-yellow transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-2 flex justify-between font-mono text-[11px] text-ice/70">
        <span>{pct}% complete</span>
        <span>{valid ? `${total - day} days remaining` : 'no data'}</span>
      </div>
    </Card>
  )
}