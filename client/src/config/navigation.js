import {
  LayoutDashboard, UserRound, HeartPulse, Brain, Radiation,
  Bone, Bot, WifiOff, BookOpen, FileText,
} from 'lucide-react'

export const NAV_GROUPS = ['Overview', 'Health domains', 'Tools', 'Reference']

export const NAV_ITEMS = [
  { group: 'Overview',       path: '/',                label: 'Command Center',   icon: LayoutDashboard },
  { group: 'Overview',       path: '/twin',            label: 'Digital Twin',     icon: UserRound },
  { group: 'Health domains', path: '/cardiovascular',  label: 'Cardiovascular',   icon: HeartPulse },
  { group: 'Health domains', path: '/brain-sleep',     label: 'Brain & Sleep',    icon: Brain },
  { group: 'Health domains', path: '/radiation',       label: 'Radiation',        icon: Radiation },
  { group: 'Health domains', path: '/musculoskeletal', label: 'Muscle & Bone',    icon: Bone },
  { group: 'Tools',          path: '/copilot',         label: 'Health Copilot',   icon: Bot },
  { group: 'Tools',          path: '/blackout',        label: 'Blackout Mode',    icon: WifiOff },
  { group: 'Reference',      path: '/research',        label: 'Research Library', icon: BookOpen },
  { group: 'Reference',      path: '/reports',         label: 'Mission Reports',  icon: FileText },
]