import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { REGION_LABELS } from '../../config/bodyRegions'
import { STATUS_COLOR, STATUS_TEXT } from '../../config/status'

// Cute chibi astronaut, drawn in a 300 x 440 space.
// "Left" = the astronaut's own left (right side of the screen).
const INK = '#061A35'
const BLUE = '#0B3D91'
const ICE = '#DCE6F1'
const YELLOW = '#FFD100'

const SHAPES = {
  head: {
    tag: 'circle', props: { cx: 150, cy: 118, r: 98 }, center: [150, 46],
  },
  chest: {
    tag: 'path', center: [150, 238],
    props: { d: 'M104 222 Q104 216 112 216 L188 216 Q196 216 196 222 L200 290 L100 290 Z' },
  },
  abdomen: {
    tag: 'path', center: [150, 303],
    props: { d: 'M100 290 L200 290 L196 328 Q195 334 188 334 L112 334 Q105 334 104 328 Z' },
  },
  rightArm: {
    tag: 'path', center: [78, 268],
    props: { d: 'M98 232 Q74 228 64 254 Q56 276 61 300 Q63 312 76 312 Q88 312 90 300 L96 262 Z' },
  },
  leftArm: {
    tag: 'path', center: [222, 268],
    props: { d: 'M202 232 Q226 228 236 254 Q244 276 239 300 Q237 312 224 312 Q212 312 210 300 L204 262 Z' },
  },
  rightLeg: {
    tag: 'path', center: [127, 364],
    props: { d: 'M106 334 L148 334 L146 394 Q146 402 138 402 L116 402 Q108 402 108 394 Z' },
  },
  leftLeg: {
    tag: 'path', center: [173, 364],
    props: { d: 'M194 334 L152 334 L154 394 Q154 402 162 402 L184 402 Q192 402 192 394 Z' },
  },
}

const PULSING = ['attention', 'risk', 'fatigue', 'radiation']

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

  const body = ['rightLeg', 'leftLeg', 'rightArm', 'leftArm', 'abdomen', 'chest']

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg viewBox="0 0 300 440" className="h-auto w-full" role="group" aria-label="Interactive astronaut body map">
        <motion.g
          animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ===== Layer 1: suit artwork (not clickable) ===== */}
          <g pointerEvents="none" aria-hidden="true">
            {/* backpack */}
            <rect x="60" y="214" width="180" height="96" rx="28" fill={BLUE} stroke={INK} strokeWidth="2.5" />
            {/* body parts */}
            {body.map((key) => {
              const s = SHAPES[key]
              const Tag = s.tag
              return <Tag key={key} {...s.props} fill="#FFFFFF" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
            })}
            {/* boots */}
            <rect x="102" y="394" width="48" height="28" rx="14" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
            <rect x="150" y="394" width="48" height="28" rx="14" fill="#FFFFFF" stroke={INK} strokeWidth="2.5" />
            <rect x="106" y="414" width="40" height="8" rx="4" fill={BLUE} />
            <rect x="154" y="414" width="40" height="8" rx="4" fill={BLUE} />
            {/* gloves */}
            <circle cx="77" cy="318" r="14" fill={ICE} stroke={INK} strokeWidth="2.5" />
            <circle cx="223" cy="318" r="14" fill={ICE} stroke={INK} strokeWidth="2.5" />
            {/* helmet */}
            <circle cx="150" cy="118" r="98" fill="#FFFFFF" stroke={INK} strokeWidth="3" />
            <circle cx="150" cy="118" r="88" fill="none" stroke={ICE} strokeWidth="3" opacity="0.8" />
            {/* ear caps */}
            <circle cx="52" cy="122" r="14" fill={BLUE} stroke={INK} strokeWidth="2.5" />
            <circle cx="248" cy="122" r="14" fill={BLUE} stroke={INK} strokeWidth="2.5" />
            {/* neck ring */}
            <rect x="116" y="208" width="68" height="16" rx="8" fill={BLUE} stroke={INK} strokeWidth="2.5" />
          </g>

          {/* ===== Layer 2: clickable regions ===== */}
          {Object.entries(SHAPES).map(([key, shape]) => {
            const status = regions[key]?.status ?? 'unknown'
            const color = STATUS_COLOR[status] ?? STATUS_COLOR.unknown
            const isUnknown = status === 'unknown'
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
                  fill={isUnknown ? '#8FA3BF' : color}
                  fillOpacity={isUnknown ? 0.2 : 0.4}
                  stroke={isSelected ? YELLOW : isUnknown ? '#8FA3BF' : color}
                  strokeWidth={isSelected ? 4 : 3}
                  strokeLinejoin="round"
                  strokeDasharray={isUnknown ? '6 4' : undefined}
                />
              </g>
            )
          })}

          {/* ===== Layer 3: face and suit details (drawn on top, not clickable) ===== */}
          <g pointerEvents="none" aria-hidden="true">
            {/* helmet stripe */}
            <path d="M112 38 Q150 22 188 38" stroke={YELLOW} strokeWidth="7" fill="none" strokeLinecap="round" />
            {/* visor */}
            <ellipse cx="150" cy="124" rx="72" ry="60" fill={INK} stroke={BLUE} strokeWidth="6" />
            <path d="M104 100 Q112 78 140 72" stroke="#FFFFFF" strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
            <circle cx="160" cy="74" r="3.5" fill="#FFFFFF" opacity="0.9" />
            <circle cx="112" cy="116" r="2.5" fill="#FFFFFF" opacity="0.8" />
            {/* face */}
            <ellipse cx="128" cy="126" rx="7" ry="8" fill={ICE}>
              {!reduceMotion && (
                <animate attributeName="ry" values="8;8;1;8" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
              )}
            </ellipse>
            <ellipse cx="172" cy="126" rx="7" ry="8" fill={ICE}>
              {!reduceMotion && (
                <animate attributeName="ry" values="8;8;1;8" keyTimes="0;0.9;0.95;1" dur="4.5s" repeatCount="indefinite" />
              )}
            </ellipse>
            <circle cx="130" cy="123" r="2" fill="#FFFFFF" />
            <circle cx="174" cy="123" r="2" fill="#FFFFFF" />
            <ellipse cx="112" cy="142" rx="8" ry="5" fill="#FC3D21" opacity="0.35" />
            <ellipse cx="188" cy="142" rx="8" ry="5" fill="#FC3D21" opacity="0.35" />
            <path d="M138 146 Q150 160 162 146" stroke={ICE} strokeWidth="4" fill="none" strokeLinecap="round" />

            {/* chest patch "AV" and button */}
            <circle cx="122" cy="246" r="12" fill={BLUE} stroke={ICE} strokeWidth="2" />
            <text x="122" y="250" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" fontFamily="Barlow Condensed, sans-serif">AV</text>
            <circle cx="176" cy="246" r="7" fill={YELLOW} stroke={INK} strokeWidth="2" />
            {/* control panel */}
            <rect x="134" y="266" width="32" height="10" rx="5" fill={INK} />
            <circle cx="142" cy="271" r="2.5" fill="var(--color-status-optimal)" />
            <circle cx="150" cy="271" r="2.5" fill={YELLOW} />
            <circle cx="158" cy="271" r="2.5" fill="var(--color-signal)" />

            {/* wrist cuffs */}
            <path d="M63 298 Q76 306 90 298" stroke={BLUE} strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M210 298 Q224 306 237 298" stroke={BLUE} strokeWidth="5" fill="none" strokeLinecap="round" />

            {/* belt */}
            <rect x="100" y="312" width="100" height="12" rx="6" fill={BLUE} stroke={INK} strokeWidth="2" />
            <rect x="142" y="311" width="16" height="14" rx="3" fill={YELLOW} stroke={INK} strokeWidth="2" />

            {/* knee seams */}
            <path d="M110 366 Q127 372 144 366" stroke={INK} strokeWidth="2" fill="none" opacity="0.45" />
            <path d="M156 366 Q173 372 190 366" stroke={INK} strokeWidth="2" fill="none" opacity="0.45" />
          </g>

          {/* ===== Animated hotspots ===== */}
          {Object.entries(SHAPES).map(([key, shape]) => {
            const status = regions[key]?.status ?? 'unknown'
            if (!PULSING.includes(status)) return null
            const color = STATUS_COLOR[status]
            const [cx, cy] = shape.center
            return (
              <g key={`hot-${key}`} pointerEvents="none" aria-hidden="true">
                <circle cx={cx} cy={cy} r="7" fill={color} stroke={INK} strokeWidth="2" />
                {!reduceMotion && (
                  <motion.circle
                    cx={cx} cy={cy} fill="none" stroke={color} strokeWidth="2.5"
                    initial={{ r: 7, opacity: 0.9 }}
                    animate={{ r: 24, opacity: 0 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
        </motion.g>
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