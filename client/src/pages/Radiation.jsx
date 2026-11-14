import { Radiation as RadiationIcon } from 'lucide-react'
import DomainPage from './DomainPage'

const LIMITATIONS = [
  'NASA RadLab data describes environmental radiation. It is not an individual astronaut personal dosimeter reading.',
  'Units are validated before any cumulative exposure is calculated. Incompatible units are never mixed.',
  'Values on this screen are simulated demo values, not NASA data and not an individual diagnosis.',
  'Warning levels are configurable demonstration rules, not official radiation limits.',
]

export default function Radiation() {
  return (
    <DomainPage
      domainKey="radiation"
      title="Radiation"
      icon={RadiationIcon}
      limitations={LIMITATIONS}
    />
  )
}