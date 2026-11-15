import { HeartPulse } from 'lucide-react'
import DomainPage from './DomainPage'
import Osd575Panel from '../components/panels/Osd575Panel'

const LIMITATIONS = [
  'Resting heart rate and HRV on this screen are SIMULATED_DEMO values. No real measurement source is connected yet.',
  'NASA Inspiration4 OSD-575 contains blood serum biomarkers. It does not contain continuous heart-rate or HRV readings.',
  'The metric cards above are simulated demo values. Only the OSD-575 table below is real NASA data, and it is not a diagnosis.',
  'Any thresholds are configurable demonstration rules, not clinical limits.',
]

export default function Cardiovascular() {
  return (
    <DomainPage
      domainKey="cardiovascular"
      title="Cardiovascular"
      icon={HeartPulse}
      limitations={LIMITATIONS}
      extra={<Osd575Panel />}
    />
  )
}