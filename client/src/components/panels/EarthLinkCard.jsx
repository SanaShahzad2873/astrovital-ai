import { Link } from 'react-router-dom'
import { Satellite } from 'lucide-react'
import Card from '../ui/Card'
import useOnline from '../../hooks/useOnline'
import { USE_MOCK } from '../../services/api'

export default function EarthLinkCard({ generatedAt }) {
  const online = useOnline()
  const rows = [
    ['Earth link', online ? 'Active' : 'Offline'],
    ['Data mode', USE_MOCK ? 'Simulated demo' : 'Live API'],
    ['Last data update', generatedAt ? new Date(generatedAt).toLocaleTimeString() : '—'],
  ]
  return (
    <Card
      title="Earth link"
      action={
        <Satellite size={18} className={online ? 'text-status-optimal' : 'text-mission-yellow'} />
      }
    >
      <dl className="divide-y divide-white/10 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-2">
            <dt className="text-ice/70">{k}</dt>
            <dd className="font-mono text-white">{v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-3 text-xs text-ice/60">
        {online
          ? 'Connected. Blackout Mode keeps the last saved records available if the link drops.'
          : 'Link lost. Showing last locally saved records. Open Blackout Mode.'}
      </p>
      <Link to="/blackout" className="mt-2 inline-block text-sm font-semibold text-mission-yellow hover:underline">
        Open Blackout Mode →
      </Link>
    </Card>
  )
}