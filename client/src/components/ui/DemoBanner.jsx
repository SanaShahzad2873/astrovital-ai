import { Info } from 'lucide-react'

export default function DemoBanner() {
  return (
    <div
      role="note"
      className="flex items-center gap-3 rounded-xl border border-mission-yellow/25 bg-mission-yellow/[0.07] px-4 py-3 text-[13px] leading-snug text-ice"
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-mission-yellow/15 text-mission-yellow">
        <Info size={16} />
      </span>
      <p>
        <span className="font-semibold text-mission-yellow">Demo mode.</span>{' '}
        Every value on this screen is SIMULATED_DEMO, not real NASA or astronaut data.
      </p>
    </div>
  )
}