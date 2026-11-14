import { useEffect, useState } from 'react'
import AstronautTwin, { TwinLegend } from './AstronautTwin'
import RegionList from './RegionList'
import { REGION_LABELS } from '../../config/bodyRegions'
import { STATUS_COLOR, STATUS_TEXT } from '../../config/status'

// Layout space is 760 x 520. The astronaut (300 x 440) sits in the middle.
const W = 760
const H = 520
const AX = 230
const AY = 40
const CHIP_W = 174
const CHIP_PAD = 14

// side: 'l' / 'r'. anchor = point on the astronaut (astronaut space). y = chip centre height.
const CALLOUTS = [
  { key: 'head',     side: 'l', anchor: [62, 118],  y: 110 },
  { key: 'rightArm', side: 'l', anchor: [64, 276],  y: 280 },
  { key: 'rightLeg', side: 'l', anchor: [118, 372], y: 440 },
  { key: 'chest',    side: 'r', anchor: [196, 240], y: 200 },
  { key: 'leftArm',  side: 'r', anchor: [238, 276], y: 280 },
  { key: 'abdomen',  side: 'r', anchor: [190, 316], y: 360 },
  { key: 'leftLeg',  side: 'r', anchor: [182, 372], y: 440 },
]

function useWide() {
  const query = '(min-width: 1024px)'
  const [wide, setWide] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setWide(m.matches)
    m.addEventListener('change', on)
    return () => m.removeEventListener('change', on)
  }, [])
  return wide
}

export default function TwinHero({ regions = {}, selected, onSelect }) {
  const wide = useWide()

  // Small screens: astronaut on top, region list below
  if (!wide) {
    return (
      <div>
        <div className="mx-auto max-w-[300px]">
          <AstronautTwin regions={regions} selected={selected} onSelect={onSelect} />
        </div>
        <div className="mt-4">
          <RegionList regions={regions} selected={selected} onSelect={onSelect} />
        </div>
        <TwinLegend />
      </div>
    )
  }

  const chipLeft = (side) => (side === 'l' ? CHIP_PAD : W - CHIP_PAD - CHIP_W)

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[900px]" style={{ aspectRatio: `${W} / ${H}` }}>
        {/* Layer 1: background, platform and callout lines (under the astronaut) */}
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="hero-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2E6FD8" stopOpacity="0.38" />
              <stop offset="100%" stopColor="#2E6FD8" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="hero-floor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5AA9FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5AA9FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="380" cy="260" r="240" fill="url(#hero-glow)" />
          <circle cx="380" cy="260" r="215" fill="none" stroke="rgba(90,169,255,0.22)" strokeDasharray="3 8" />
          <circle cx="380" cy="260" r="178" fill="none" stroke="rgba(90,169,255,0.16)" />

          <ellipse cx="380" cy="470" rx="125" ry="19" fill="url(#hero-floor)" />
          <ellipse cx="380" cy="468" rx="104" ry="13" fill="none" stroke="rgba(90,169,255,0.7)" />
          <ellipse cx="380" cy="468" rx="76" ry="9" fill="none" stroke="rgba(255,209,0,0.55)" strokeDasharray="3 5" />

          {CALLOUTS.map((c) => {
            const status = regions[c.key]?.status ?? 'unknown'
            const ax = AX + c.anchor[0]
            const ay = AY + c.anchor[1]
            const ex = c.side === 'l' ? CHIP_PAD + CHIP_W : W - CHIP_PAD - CHIP_W
            return (
              <line
                key={c.key}
                x1={ax} y1={ay} x2={ex} y2={c.y}
                stroke={STATUS_COLOR[status]}
                strokeOpacity={status === 'unknown' ? 0.35 : 0.75}
                strokeWidth="1.3"
              />
            )
          })}
        </svg>

        {/* Layer 2: astronaut */}
        <div
          className="absolute"
          style={{ left: `${(AX / W) * 100}%`, top: `${(AY / H) * 100}%`, width: `${(300 / W) * 100}%` }}
        >
          <AstronautTwin regions={regions} selected={selected} onSelect={onSelect} />
        </div>

        {/* Layer 3: anchor dots (on top of the suit, ignore clicks) */}
        <svg viewBox={`0 0 ${W} ${H}`} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
          {CALLOUTS.map((c) => {
            const status = regions[c.key]?.status ?? 'unknown'
            return (
              <circle
                key={c.key}
                cx={AX + c.anchor[0]} cy={AY + c.anchor[1]} r="4"
                fill="#061A35" stroke={STATUS_COLOR[status]} strokeWidth="2"
              />
            )
          })}
        </svg>

        {/* Layer 4: callout chips */}
        {CALLOUTS.map((c) => {
          const status = regions[c.key]?.status ?? 'unknown'
          const color = STATUS_COLOR[status]
          const active = selected === c.key
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => onSelect?.(c.key)}
              className={`absolute z-10 rounded-lg border px-3 py-2 text-left backdrop-blur transition-colors ${
                active
                  ? 'border-mission-yellow bg-mission-yellow/10'
                  : 'border-white/15 bg-space-navy/75 hover:border-white/40'
              }`}
              style={{
                left: `${(chipLeft(c.side) / W) * 100}%`,
                top: `${(c.y / H) * 100}%`,
                width: `${(CHIP_W / W) * 100}%`,
                transform: 'translateY(-50%)',
              }}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-ice/60">
                {REGION_LABELS[c.key]}
              </span>
              <span className="mt-0.5 flex items-center gap-2 text-sm font-semibold" style={{ color }}>
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
                {STATUS_TEXT[status]}
              </span>
            </button>
          )
        })}

        <p className="absolute bottom-0 left-0 font-mono text-[10px] tracking-[0.18em] text-ice/45">
          BODY MAP / FRONT VIEW
        </p>
      </div>
      <TwinLegend />
    </div>
  )
}