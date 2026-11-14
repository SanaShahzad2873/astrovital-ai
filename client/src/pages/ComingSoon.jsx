import Card from '../components/ui/Card'
import StatusBadge from '../components/ui/StatusBadge'

export default function ComingSoon({ name }) {
  return (
    <Card title={name} action={<StatusBadge status="unknown" />}>
      <p className="text-ice">This screen is under construction.</p>
    </Card>
  )
}