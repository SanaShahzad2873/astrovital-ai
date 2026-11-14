import { USE_MOCK } from '../../services/api'

export default function DemoBanner() {
  if (!USE_MOCK) return null
  return (
    <div className="rounded-lg border border-dashed border-mission-yellow/50 bg-mission-yellow/5 px-4 py-2 text-sm text-mission-yellow">
      Demo mode: every value on this screen is SIMULATED_DEMO, not real NASA or astronaut data.
    </div>
  )
}