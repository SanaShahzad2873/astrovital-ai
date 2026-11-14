import { HeartPulse } from 'lucide-react'
import DomainPage from './DomainPage'

const LIMITATIONS = [
  'Resting heart rate and HRV on this screen are SIMULATED_DEMO values. No real measurement source is connected yet.',
  'NASA Inspiration4 OSD-575 contains blood serum biomarkers. It does not contain continuous heart-rate or HRV readings.',
  'Values on this screen are not NASA data and not an individual diagnosis.',
  'Any thresholds are configurable demonstration rules, not clinical limits.',
]

export default function Cardiovascular() {
  return (
    <DomainPage
      domainKey="cardiovascular"
      title="Cardiovascular"
      icon={HeartPulse}
      limitations={LIMITATIONS}
    />
  )
}