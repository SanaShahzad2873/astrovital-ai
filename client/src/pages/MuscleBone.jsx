import { Bone } from 'lucide-react'
import DomainPage from './DomainPage'

const LIMITATIONS = [
  'Exercise logs do not directly measure bone density or muscle mass.',
  'NASA bone and muscle research provides scientific context only. It is not an individual diagnosis.',
  'Values on this screen are simulated demo values, not NASA data.',
  'Missed-exercise and deconditioning indicators are configurable demonstration rules, not clinical limits.',
]

export default function MuscleBone() {
  return (
    <DomainPage
      domainKey="musculoskeletal"
      title="Muscle & Bone"
      icon={Bone}
      limitations={LIMITATIONS}
    />
  )
}