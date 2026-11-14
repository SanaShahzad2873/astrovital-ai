import { HeartPulse } from 'lucide-react'
import DomainPage from './DomainPage'

const LIMITATIONS = [
  'NASA Inspiration4 OSD-575 contains blood serum biomarkers. It does not contain continuous heart-rate or HRV readings.',
  'Heart rate and HRV stay "No Data" until a real measurement source is connected.',
  'Values on this screen are simulated demo values, not NASA data and not an individual diagnosis.',
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