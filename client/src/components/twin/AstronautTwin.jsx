import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { REGION_LABELS } from '../../config/bodyRegions'
import { STATUS_COLOR, STATUS_TEXT } from '../../config/status'

// Professional "holographic suit" astronaut, drawn in a 300 x 440 space.
// Same hit-regions and props as before, so TwinHero / DigitalTwin keep working.
// "Left" = the astronaut's own left (right side of the screen).
const ICE = '#DCE6F1'
const YELLOW = '#FFD100'
const EDGE = 'rgba(220,230,241,0.38)'
const EDGE_SOFT = 'rgba(220,230,241,0.16)'

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
    <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-ice/80">
      {Object.keys(STATUS_TEXT).map((s) => (
        <li key={s} className="flex items-center gap-2">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: STATUS_COLOR[s], boxShadow: `0 0 8px ${STATUS_COLOR[s]}` }}
          />
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
  const hoverStatus = regions[hover?.key]?.status ?? 'unknown'

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        viewBox="0 0 300 440"
        className="h-auto w-full overflow-visible"
        role="group"
        aria-label="Interactive astronaut body map"
      >
        <defs>
          <linearGradient id="at2-suit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1B3C75" />
            <stop offset="100%" stopColor="#0A1F45" />
          </linearGradient>
          <radialGradient id="at2-helmet" cx="35%" cy="25%" r="90%">
            <stop offset="0%" stopColor="#2A5199" />
            <stop offset="55%" stopColor="#12306A" />
            <stop offset="100%" stopColor="#081631" />
          </radialGradient>
          <linearGradient id="at2-visor" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#0F2A57" />
            <stop offset="100%" stopColor="#030B1C" />
          </linearGradient>
          <linearGradient id="at2-scan" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ICE} stopOpacity="0" />
            <stop offset="50%" stopColor={ICE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={ICE} stopOpacity="0" />
          </linearGradient>
          <radialGradient id="at2-floor" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={YELLOW} stopOpacity="0.28" />
            <stop offset="100%" stopColor={YELLOW} stopOpacity="0" />
          </radialGradient>
          <filter id="at2-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ===== Backdrop: orbit ring + floor glow (static) ===== */}
        <g pointerEvents="none" aria-hidden="true">
          <ellipse cx="150" cy="232" rx="146" ry="200" fill="none" stroke={EDGE_SOFT} strokeDasharray="2 6" />
          <ellipse cx="150" cy="232" rx="118" ry="170" fill="none" stroke="rgba(220,230,241,0.07)" />
          <ellipse cx="150" cy="428" rx="100" ry="11" fill="url(#at2-floor)" />
        </g>

        <motion.g
          animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* ===== Layer 1: suit artwork (not clickable) ===== */}
          <g pointerEvents="none" aria-hidden="true">
            {/* life-support pack */}
            <rect x="62" y="214" width="176" height="98" rx="26" fill="#0A1F45" stroke={EDGE_SOFT} strokeWidth="1.5" />
            {/* suit panels */}
            {body.map((key) => {
              const s = SHAPES[key]
              const Tag = s.tag
              return (
                <Tag key={key} {...s.props} fill="url(#at2-suit)" stroke={EDGE} strokeWidth="1.5" strokeLinejoin="round" />
              )
            })}
            {/* panel seams */}
            <path d="M150 218 L150 262" stroke={EDGE_SOFT} strokeWidth="1" />
            <path d="M112 298 L188 298" stroke={EDGE_SOFT} strokeWidth="1" />
            <path d="M110 366 Q127 372 144 366" stroke={EDGE_SOFT} strokeWidth="1.2" fill="none" />
            <path d="M156 366 Q173 372 190 366" stroke={EDGE_SOFT} strokeWidth="1.2" fill="none" />
            {/* boots */}
            <rect x="102" y="394" width="48" height="26" rx="13" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            <rect x="150" y="394" width="48" height="26" rx="13" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            <rect x="108" y="412" width="36" height="3" rx="1.5" fill={YELLOW} opacity="0.8" />
            <rect x="156" y="412" width="36" height="3" rx="1.5" fill={YELLOW} opacity="0.8" />
            {/* gloves */}
            <circle cx="77" cy="318" r="12" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            <circle cx="223" cy="318" r="12" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            {/* wrist rings */}
            <path d="M64 299 Q76 306 89 299" stroke={YELLOW} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            <path d="M211 299 Q224 306 236 299" stroke={YELLOW} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
            {/* neck ring */}
            <rect x="118" y="208" width="64" height="14" rx="7" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            {/* helmet shell */}
            <circle cx="150" cy="118" r="98" fill="url(#at2-helmet)" stroke={EDGE} strokeWidth="2" />
            <circle cx="150" cy="118" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            {/* ear modules */}
            <rect x="40" y="108" width="20" height="28" rx="8" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
            <rect x="240" y="108" width="20" height="28" rx="8" fill="#0F2A57" stroke={EDGE} strokeWidth="1.5" />
          </g>

          {/* ===== Layer 2: clickable regions ===== */}
          {Object.entries(SHAPES).map(([key, shape]) => {
            const status = regions[key]?.status ?? 'unknown'
            const known = status !== 'unknown'
            const color = STATUS_COLOR[status] ?? STATUS_COLOR.unknown
            const isSelected = selected === key
            const isHover = hover?.key === key
            const Tag = shape.tag
            return (
              <g
                key={key}
                role="button"
                tabIndex={0}
                aria-label={`${REGION_LABELS[key]}: ${STATUS_TEXT[status]}`}
                aria-pressed={isSelected}
                style={{ cursor: 'pointer', outline: 'none' }}
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
                  fill={known ? color : ICE}
                  fillOpacity={isSelected ? 0.3 : isHover ? 0.24 : known ? 0.14 : isHover ? 0.08 : 0}
                  stroke={isSelected ? YELLOW : known ? color : isHover ? ICE : 'transparent'}
                  strokeWidth={isSelected ? 2.5 : 1.6}
                  strokeLinejoin="round"
                  filter={known ? 'url(#at2-glow)' : undefined}
                />
              </g>
            )
          })}

          {/* ===== Layer 3: visor + suit details (on top, not clickable) ===== */}
          <g pointerEvents="none" aria-hidden="true">
            {/* beacon */}
            <line x1="150" y1="21" x2="150" y2="12" stroke={EDGE} strokeWidth="2" strokeLinecap="round" />
            <circle cx="150" cy="8" r="3.5" fill={YELLOW}>
              {!reduceMotion && (
                <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
              )}
            </circle>

            {/* helmet crest */}
            <path d="M118 38 Q150 26 182 38" stroke={YELLOW} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.9" />

            {/* visor */}
            <ellipse cx="150" cy="124" rx="70" ry="56" fill="url(#at2-visor)" stroke="rgba(255,209,0,0.55)" strokeWidth="1.5" />
            <path d="M102 102 Q110 82 138 76" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.3" />
            <path d="M96 138 Q100 150 112 158" stroke="#FFFFFF" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.14" />

            {/* vitals trace on the visor */}
            <path
              d="M92 128 H120 L128 112 L138 146 L149 98 L160 138 L168 128 H208"
              fill="none" stroke={YELLOW} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              opacity={reduceMotion ? 0.7 : 0.25}
            />
            {!reduceMotion && (
              <path
                d="M92 128 H120 L128 112 L138 146 L149 98 L160 138 L168 128 H208"
                fill="none" stroke={YELLOW} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                pathLength="1" strokeDasharray="0.22 0.78" filter="url(#at2-glow)"
              >
                <animate attributeName="stroke-dashoffset" values="1;0" dur="2.6s" repeatCount="indefinite" />
              </path>
            )}

            {/* chest badge + status LEDs */}
            <circle cx="122" cy="246" r="11" fill="#0F2A57" stroke={YELLOW} strokeWidth="1.2" />
            <text x="122" y="250" textAnchor="middle" fontSize="10" fontWeight="700" fill="#FFFFFF" fontFamily="Barlow Condensed, sans-serif">AV</text>
            <rect x="136" y="262" width="30" height="8" rx="4" fill="#030B1C" stroke={EDGE_SOFT} />
            <circle cx="143" cy="266" r="2" fill="var(--color-status-optimal)" />
            <circle cx="151" cy="266" r="2" fill={YELLOW} />
            <circle cx="159" cy="266" r="2" fill="var(--color-signal)" />

            {/* belt */}
            <rect x="100" y="313" width="100" height="9" rx="4.5" fill="#0F2A57" stroke={EDGE} strokeWidth="1.2" />
            <rect x="144" y="312" width="12" height="11" rx="2.5" fill={YELLOW} />
          </g>

          {/* ===== Scan line sweeping the body ===== */}
          {!reduceMotion && (
            <motion.rect
              x="50" width="200" height="2" rx="1" fill="url(#at2-scan)" pointerEvents="none"
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: [24, 410], opacity: [0, 0.8, 0.8, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'linear', repeatDelay: 1.5 }}
            />
          )}

          {/* ===== Animated hotspots ===== */}
          {Object.entries(SHAPES).map(([key, shape]) => {
            const status = regions[key]?.status ?? 'unknown'
            if (!PULSING.includes(status)) return null
            const color = STATUS_COLOR[status]
            const [cx, cy] = shape.center
            return (
              <g key={`hot-${key}`} pointerEvents="none" aria-hidden="true">
                <circle cx={cx} cy={cy} r="4.5" fill={color} stroke="#030B1C" strokeWidth="1.5" />
                {!reduceMotion && (
                  <motion.circle
                    cx={cx} cy={cy} fill="none" stroke={color} strokeWidth="1.5"
                    initial={{ r: 5, opacity: 0.9 }}
                    animate={{ r: 20, opacity: 0 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
              </g>
            )
          })}
        </motion.g>
      </svg>

      {hover && (
        <div
          className="pointer-events-none absolute z-10 min-w-[150px] rounded-xl border border-white/10 px-3.5 py-2.5 text-xs shadow-2xl"
          style={{
            left: hover.x + 14,
            top: hover.y + 14,
            background: 'rgba(7,15,36,0.92)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <p className="text-[13px] font-semibold text-white">{REGION_LABELS[hover.key]}</p>
          <p className="mt-0.5 flex items-center gap-1.5" style={{ color: STATUS_COLOR[hoverStatus] }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[hoverStatus] }} />
            {STATUS_TEXT[hoverStatus]}
          </p>
          <p className="mt-1.5 text-ice/60">Click to open details</p>
        </div>
      )}
    </div>
  )
}