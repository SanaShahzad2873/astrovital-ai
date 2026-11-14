import { REGION_LABELS } from '../../config/bodyRegions'
import StatusBadge from '../ui/StatusBadge'

export default function RegionList({ regions = {}, selected, onSelect }) {
  return (
    <ul className="space-y-1.5">
      {Object.keys(REGION_LABELS).map((key) => {
        const status = regions[key]?.status ?? 'unknown'
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelect?.(key)}
              className={`flex w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors ${
                selected === key
                  ? 'border-mission-yellow/60 bg-white/10'
                  : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.07]'
              }`}
            >
              <span className="text-white">{REGION_LABELS[key]}</span>
              <StatusBadge status={status} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}