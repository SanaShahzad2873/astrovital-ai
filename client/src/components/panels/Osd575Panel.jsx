import { useState } from 'react'
import Card from '../ui/Card'
import StatusBadge from '../ui/StatusBadge'
import SourceTag from '../ui/SourceTag'
import { STATUS_COLOR } from '../../config/status'
import osd from '../../data/osd575_cardio_analysis.json'

// REAL NASA data: Inspiration4 serum biomarkers (OSDR OSD-575), analysed by the team's engine.
// Deviation is measured against each astronaut's OWN pre-flight baseline. Not a diagnosis.
const UI_STATUS = { normal: 'optimal', attention: 'attention', high: 'risk', unknown: 'unknown' }
const SUBJECTS = [...new Set(osd.results.map((r) => r.subject_id))].sort()

function ZTrace({ points, color }) {
  const zs = points.map((p) => p.z).filter((z) => typeof z === 'number')
  if (zs.length < 2) return <span className="font-mono text-[10px] text-ice/50">no trend</span>
  const w = 96, h = 28, max = Math.max(3, ...zs.map(Math.abs))
  const x = (i) => (i / (zs.length - 1)) * (w - 4) + 2
  const y = (z) => h / 2 - (z / max) * (h / 2 - 3)
  const path = zs.map((z, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(z).toFixed(1)}`).join(' ')
  return (
    <svg width={w} height={h} role="img" aria-label="deviation from baseline over time">
      <line x1="0" x2={w} y1={h / 2} y2={h / 2} stroke="currentColor" opacity="0.18" strokeDasharray="2 3" />
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Osd575Panel() {
  const [subject, setSubject] = useState(SUBJECTS[0])
  const rows = osd.results.filter((r) => r.subject_id === subject)
  const counts = rows.reduce((a, r) => ((a[r.status] = (a[r.status] ?? 0) + 1), a), {})

  return (
    <Card
      title="Real NASA data: Inspiration4 blood biomarkers (OSD-575)"
      action={<SourceTag source="NASA_RESEARCH" />}
    >
      <p className="mb-4 text-sm leading-relaxed text-ice/75">
        {osd.panel}. Each value is compared with the same astronaut's own pre-flight baseline
        ({osd.baseline_timepoints.join(', ')}) at post-flight points ({osd.observation_timepoints.join(', ')}).
        These are research blood biomarkers, not heart rate or HRV.
      </p>

      <div className="mb-4 flex flex-wrap items-center gap-2" role="tablist" aria-label="Astronaut">
        {SUBJECTS.map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={s === subject}
            onClick={() => setSubject(s)}
            className={
              'rounded-full border px-3.5 py-1 text-xs font-semibold transition ' +
              (s === subject
                ? 'border-hud bg-hud/15 text-white'
                : 'border-white/15 bg-white/[0.04] text-ice/70 hover:text-white')
            }
          >
            {s}
          </button>
        ))}
        <span className="ml-auto text-xs text-ice/60">
          {counts.high ?? 0} high · {counts.attention ?? 0} attention · {counts.normal ?? 0} normal · {counts.unknown ?? 0} no data
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="text-[11px] uppercase tracking-wide text-ice/50">
              <th className="py-2 pr-3 font-medium">Biomarker</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 font-medium">Latest ({osd.observation_timepoints.at(-1)})</th>
              <th className="py-2 pr-3 font-medium">Deviation trend</th>
              <th className="py-2 font-medium">Why</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const st = UI_STATUS[r.status] ?? 'unknown'
              return (
                <tr key={r.signal} className="border-t border-white/[0.07] align-top">
                  <td className="py-3 pr-3 font-medium text-white">{r.signal}</td>
                  <td className="py-3 pr-3"><StatusBadge status={st} /></td>
                  <td className="num py-3 pr-3 text-ice/85">
                    {r.latest ? `${r.latest.z > 0 ? '+' : ''}${r.latest.z.toFixed(1)} SD` : '—'}
                  </td>
                  <td className="py-3 pr-3 text-ice/80">
                    <ZTrace points={r.points ?? []} color={STATUS_COLOR[st]} />
                  </td>
                  <td className="py-3 text-xs leading-relaxed text-ice/65">{r.status === 'normal'
                      ? "Within this astronaut's own baseline range (baseline has only 3 samples, so confidence is low)."
                      : (r.contributingFactors?.[0] ?? '—')}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ul className="mt-5 space-y-1.5 border-t border-white/[0.08] pt-4 text-xs leading-relaxed text-ice/60">
        {osd.notes.map((n, i) => <li key={i}>• {n}</li>)}
      </ul>
    </Card>
  )
}
