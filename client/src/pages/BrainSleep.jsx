import { Brain } from 'lucide-react'
import DomainPage from './DomainPage'

const LIMITATIONS = [
  'Raw individual NASA sleep-wake actigraphy records are used only if they are actually accessible. Otherwise this screen shows self-reported inputs and simulated demo telemetry.',
  'Sleep, fatigue, mood and stress values on this screen are simulated demo values or self-reported inputs, not NASA data.',
  'Fatigue and cognitive indicators are wellness signals. They are not a clinical diagnosis.',
  'Any thresholds are configurable demonstration rules, not clinical limits.',
]

export default function BrainSleep() {
  return (
    <DomainPage
      domainKey="sleepCognitive"
      title="Brain & Sleep"
      icon={Brain}
      limitations={LIMITATIONS}
    />
  )
}