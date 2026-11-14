import Card from '../ui/Card'
import SourceTag from '../ui/SourceTag'

export default function MissionProgressCard({ day, total, source }) {
  const valid = Number.isFinite(day) && Number.isFinite(total) && total > 0
  const pct = valid ? Math.min(100, Math.round((day / total) * 100)) : 0

  return (
    <Card title="Mission progress" action={<SourceTag source={source} />}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-ice/55">Demo mission</p>
          <p className="num mt-1 text-[42px] leading-none text-white">
            {valid ? (
              <>
                Day <span className="text-mission-yellow">{day}</span>
              </>
            ) : (
              '—'
            )}
            {valid && <span className="ml-2 text-sm font-medium text-ice/55">of {total}</span>}
          </p>
        </div>
        <span className="rounded-full bg-white/[0.06] px-3 py-1 text-xs font-semibold tabular-nums text-ice/85">
          {pct}%
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, rgba(255,209,0,0.45), #FFD100)',
            boxShadow: '0 0 12px rgba(255,209,0,0.55)',
          }}
        />
      </div>

      <p className="mt-3 text-xs text-ice/55">
        {valid ? `${total - day} days remaining` : 'No mission data'}
      </p>
    </Card>
  )
}