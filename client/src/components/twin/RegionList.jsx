import { REGION_LABELS } from '../../config/bodyRegions'
import StatusBadge from '../ui/StatusBadge'

export default function RegionList({ regions = {}, selected, onSelect }) {
  return (
    <ul className="space-y-2">
      {Object.keys(REGION_LABELS).map((key) => {
        const status = regions[key]?.status ?? 'unknown'
        const active = selected === key
        return (
          <li key={key}>
            <button
              type="button"
              onClick={() => onSelect?.(key)}
              aria-pressed={active}
              className={`relative flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[14px] font-medium transition-colors ${
                active
                  ? 'border-mission-yellow/45 bg-white/[0.08] text-white'
                  : 'border-white/[0.08] bg-white/[0.03] text-ice/85 hover:bg-white/[0.06] hover:text-white'
              }`}
            >
              <span
                className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-mission-yellow ${
                  active ? 'opacity-100' : 'opacity-0'
                }`}
                aria-hidden="true"
              />
              <span>{REGION_LABELS[key]}</span>
              <StatusBadge status={status} />
            </button>
          </li>
        )
      })}
    </ul>
  )
}