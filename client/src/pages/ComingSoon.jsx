import { Link } from 'react-router-dom'
import { Rocket } from 'lucide-react'
import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'

export default function ComingSoon({ name }) {
  return (
    <Card title={name} action={<StatusBadge status="unknown" />}>
      <div className="flex flex-col items-center gap-4 px-4 py-14 text-center">
        <span
          className="grid h-14 w-14 place-items-center rounded-2xl text-mission-yellow"
          style={{
            background: 'rgba(255,209,0,0.10)',
            boxShadow: '0 0 28px -6px rgba(255,209,0,0.45)',
          }}
        >
          <Rocket size={26} />
        </span>
        <div>
          <p className="text-lg font-semibold text-white">{name} is in development</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm leading-relaxed text-ice/65">
            This screen is being built by the team and will appear here once it is ready.
          </p>
        </div>
        <Link to="/" className="ac-link">
          Back to Command Center
        </Link>
      </div>
    </Card>
  )
}