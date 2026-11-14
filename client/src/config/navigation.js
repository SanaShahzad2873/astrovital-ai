import {
  LayoutDashboard, UserRound, HeartPulse, Brain, Radiation,
  Bone, Bot, WifiOff, BookOpen, FileText,
} from 'lucide-react'

export const NAV_ITEMS = [
  { path: '/',                label: 'Command Center',   icon: LayoutDashboard },
  { path: '/twin',            label: 'Digital Twin',     icon: UserRound },
  { path: '/cardiovascular',  label: 'Cardiovascular',   icon: HeartPulse },
  { path: '/brain-sleep',     label: 'Brain & Sleep',    icon: Brain },
  { path: '/radiation',       label: 'Radiation',        icon: Radiation },
  { path: '/musculoskeletal', label: 'Muscle & Bone',    icon: Bone },
  { path: '/copilot',         label: 'Health Copilot',   icon: Bot },
  { path: '/blackout',        label: 'Blackout Mode',    icon: WifiOff },
  { path: '/research',        label: 'Research Library', icon: BookOpen },
  { path: '/reports',         label: 'Mission Reports',  icon: FileText },
]