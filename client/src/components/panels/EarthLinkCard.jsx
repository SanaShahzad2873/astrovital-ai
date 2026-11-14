import { Link } from 'react-router-dom'
import { Satellite } from 'lucide-react'
import Card from '../ui/Card'
import useOnline from '../../hooks/useOnline'
import { USE_MOCK } from '../../services/api'

export default function EarthLinkCard({ generatedAt }) {
  const online = useOnline()
  const rows = [
    ['Earth link', online ? 'Active' : 'Offline', true],
    ['Data mode', USE_MOCK ? 'Simulated demo' : 'Live API'],
    ['Last data update', generatedAt ? new Date(generatedAt).toLocaleTimeString() : '—'],
  ]
  return (
    <Card
      title="Earth link"
      action={
        <span
          className="grid h-8 w-8 place-items-center rounded-xl"
          style={{
            background: online ? 'rgba(34,197,94,0.12)' : 'rgba(255,209,0,0.12)',
          }}
        >
          <Satellite size={16} className={online ? 'text-status-optimal' : 'text-mission-yellow'} />
        </span>
      }
    >
      <dl className="text-sm">
        {rows.map(([k, v, dot]) => (
          <div
            key={k}
            className="flex items-center justify-between border-t border-white/[0.07] py-2.5 first:border-t-0 first:pt-0"
          >
            <dt className="text-ice/60">{k}</dt>
            <dd className="flex items-center gap-2 font-semibold tabular-nums text-white">
              {dot && (
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: online ? 'var(--color-status-optimal)' : 'var(--color-mission-yellow)',
                    boxShadow: `0 0 8px ${online ? 'var(--color-status-optimal)' : 'var(--color-mission-yellow)'}`,
                  }}
                />
              )}
              {v}
            </dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-xs leading-relaxed text-ice/55">
        {online
          ? 'Connected. Blackout Mode keeps the last saved records available if the link drops.'
          : 'Link lost. Showing last locally saved records. Open Blackout Mode.'}
      </p>
      <Link to="/blackout" className="ac-link mt-4">
        Open Blackout Mode
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </Card>
  )
}