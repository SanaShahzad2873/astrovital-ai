import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { REGION_LABELS } from '../../config/bodyRegions'
import { STATUS_COLOR, STATUS_TEXT } from '../../config/status'

// Drawn in a 300 x 560 space. "Left" = the astronaut's own left (right side of screen).
const SHAPES = {
  head: {
    tag: 'ellipse', props: { cx: 150, cy: 68, rx: 52, ry: 56 }, center: [150, 68],
  },
  chest: {
    tag: 'path', center: [150, 186],
    props: { d: 'M92 152 Q92 136 110 134 L190 134 Q208 136 208 152 L204 230 Q204 237 196 237 L104 237 Q96 237 96 230 Z' },
  },
  abdomen: {
    tag: 'path', center: [150, 278],
    props: { d: 'M100 241 L200 241 L196 302 Q195 313 184 314 L116 314 Q105 313 104 302 Z' },
  },
  rightArm: {
    tag: 'path', center: [68, 230],
    props: { d: 'M84 146 Q54 148 50 178 L40 288 Q38 304 54 306 L76 306 Q90 304 92 290 L90 190 Z' },
  },
  leftArm: {
    tag: 'path', center: [232, 230],
    props: { d: 'M216 146 Q246 148 250 178 L260 288 Q262 304 246 306 L224 306 Q210 304 208 290 L210 190 Z' },
  },
  rightLeg: {
    tag: 'path', center: [124, 415],
    props: { d: 'M104 318 L148 318 L144 430 L142 500 Q142 512 130 512 L112 512 Q104 512 104 500 L100 430 Z' },
  },
  leftLeg: {
    tag: 'path', center: [176, 415],
    props: { d: 'M196 318 L152 318 L156 430 L158 500 Q158 512 170 512 L188 512 Q196 512 196 500 L200 430 Z' },
  },
}

const PULSING = ['attention', 'risk', 'fatigue', 'radiation']
const SOFT = 'rgba(220,230,241,0.3)'

export function TwinLegend() {
  return (
    <ul className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-ice">
      {Object.keys(STATUS_TEXT).map((s) => (
        <li key={s} className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[s] }} />
          {STATUS_TEXT[s]}
        </li>
      ))}
    </ul>
  )
}

export default function AstronautTwin({ regions = {}, selected, onSelect }) {
  const reduceMotion = useReducedMotion()
  const wrapRef = useRef(null)
  const [hover, setHover] = useState(null)

  const track = (e, key) => {
    const box = wrapRef.current.getBoundingClientRect()
    setHover({ key, x: e.clientX - box.left, y: e.clientY - box.top })
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg viewBox="0 0 300 560" className="h-auto w-full" role="group" aria-label="Interactive astronaut body map">
        {/* Backpack (decoration) */}
        <g pointerEvents="none" aria-hidden="true">
          <rect x="80" y="128" width="140" height="132" rx="18"
            fill="var(--color-panel-raised)" stroke="rgba(220,230,241,0.22)" />
          <rect x="70" y="150" width="14" height="60" rx="6" fill="rgba(220,230,241,0.18)" />
          <rect x="216" y="150" width="14" height="60" rx="6" fill="rgba(220,230,241,0.18)" />
        </g>

        {/* Clickable regions */}
        {Object.entries(SHAPES).map(([key, shape]) => {
          const status = regions[key]?.status ?? 'unknown'
          const color = STATUS_COLOR[status] ?? STATUS_COLOR.unknown
          const isSelected = selected === key
          const Tag = shape.tag
          return (
            <g
              key={key}
              role="button"
              tabIndex={0}
              aria-label={`${REGION_LABELS[key]}: ${STATUS_TEXT[status]}`}
              aria-pressed={isSelected}
              style={{ cursor: 'pointer' }}
              onClick={() => onSelect?.(key)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect?.(key)
                }
              }}
              onMouseEnter={(e) => track(e, key)}
              onMouseMove={(e) => track(e, key)}
              onMouseLeave={() => setHover(null)}
            >
              <Tag
                {...shape.props}
                fill={color}
                fillOpacity={status === 'unknown' ? 0.14 : 0.32}
                stroke={isSelected ? 'var(--color-mission-yellow)' : color}
                strokeWidth={isSelected ? 4 : 2}
                strokeLinejoin="round"
                strokeDasharray={status === 'unknown' ? '6 4' : undefined}
              />
            </g>
          )
        })}

        {/* Suit details (decoration, drawn on top) */}
        <g pointerEvents="none" aria-hidden="true">
          {/* visor */}
          <ellipse cx="150" cy="72" rx="36" ry="30" fill="var(--color-space-navy)" stroke={SOFT} strokeWidth="2" />
          <path d="M126 68 Q138 54 158 58" stroke="rgba(220,230,241,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* neck ring */}
          <rect x="126" y="124" width="48" height="12" rx="6" fill={SOFT} />
          {/* chest control box */}
          <rect x="128" y="160" width="44" height="30" rx="5" fill="rgba(6,26,53,0.7)" stroke={SOFT} />
          <circle cx="138" cy="170" r="3" fill="var(--color-mission-yellow)" />
          <circle cx="150" cy="170" r="3" fill="var(--color-status-optimal)" />
          <circle cx="162" cy="170" r="3" fill="var(--color-signal)" />
          <rect x="136" y="178" width="28" height="4" rx="2" fill={SOFT} />
          {/* waist belt */}
          <rect x="98" y="304" width="104" height="14" rx="7" fill="rgba(220,230,241,0.22)" />
          {/* elbow and knee seams */}
          <line x1="46" y1="238" x2="88" y2="238" stroke={SOFT} strokeWidth="2" />
          <line x1="212" y1="238" x2="254" y2="238" stroke={SOFT} strokeWidth="2" />
          <line x1="104" y1="420" x2="147" y2="420" stroke={SOFT} strokeWidth="2" />
          <line x1="153" y1="420" x2="196" y2="420" stroke={SOFT} strokeWidth="2" />
          {/* gloves */}
          <circle cx="64" cy="320" r="17" fill="rgba(220,230,241,0.32)" />
          <circle cx="236" cy="320" r="17" fill="rgba(220,230,241,0.32)" />
          {/* boots */}
          <rect x="96" y="506" width="54" height="30" rx="13" fill="rgba(220,230,241,0.32)" />
          <rect x="150" y="506" width="54" height="30" rx="13" fill="rgba(220,230,241,0.32)" />
        </g>

        {/* Animated hotspots */}
        {Object.entries(SHAPES).map(([key, shape]) => {
          const status = regions[key]?.status ?? 'unknown'
          if (!PULSING.includes(status)) return null
          const color = STATUS_COLOR[status]
          const [cx, cy] = shape.center
          return (
            <g key={`hot-${key}`} pointerEvents="none" aria-hidden="true">
              <circle cx={cx} cy={cy} r="7" fill={color} />
              {!reduceMotion && (
                <motion.circle
                  cx={cx} cy={cy} fill="none" stroke={color} strokeWidth="2"
                  initial={{ r: 7, opacity: 0.8 }}
                  animate={{ r: 24, opacity: 0 }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                />
              )}
            </g>
          )
        })}
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 max-w-[220px] rounded-lg border border-white/15 bg-space-navy px-3 py-2 text-xs shadow-lg"
          style={{ left: hover.x + 14, top: hover.y + 14 }}
        >
          <p className="font-semibold text-white">{REGION_LABELS[hover.key]}</p>
          <p style={{ color: STATUS_COLOR[regions[hover.key]?.status ?? 'unknown'] }}>
            {STATUS_TEXT[regions[hover.key]?.status ?? 'unknown']}
          </p>
          <p className="mt-1 text-ice/70">Click for details</p>
        </div>
      )}
    </div>
  )
}