import { HeartPulse, Brain, Radiation, Bone } from 'lucide-react'

export const DOMAINS = [
  { key: 'cardiovascular',  label: 'Cardiovascular', path: '/cardiovascular',  icon: HeartPulse },
  { key: 'sleepCognitive',  label: 'Brain & Sleep',  path: '/brain-sleep',     icon: Brain },
  { key: 'radiation',       label: 'Radiation',      path: '/radiation',       icon: Radiation },
  { key: 'musculoskeletal', label: 'Muscle & Bone',  path: '/musculoskeletal', icon: Bone },
]