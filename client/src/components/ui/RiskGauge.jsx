import { motion } from 'framer-motion'
import { STATUS_COLOR } from '../../config/status'

const R = 54
const C = 2 * Math.PI * R

export default function RiskGauge({ value, status = 'unknown', size = 160 }) {
  const missing = value === null || value === undefined
  const color = STATUS_COLOR[missing ? 'unknown' : status] ?? STATUS_COLOR.unknown
  const pct = missing ? 0 : Math.min(100, Math.max(0, value)) / 100

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      role="img"
      aria-label={missing ? 'Risk score: no data' : `Risk score ${value} out of 100`}
    >
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(220,230,241,0.1)" strokeWidth="8" />
        <motion.circle
          cx="70" cy="70" r={R} fill="none" stroke={color} strokeWidth="8"
          strokeLinecap="round" strokeDasharray={C}
          initial={{ strokeDashoffset: C }}
          animate={{ strokeDashoffset: C * (1 - pct) }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ filter: `drop-shadow(0 0 3px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-5xl leading-none text-white">{missing ? '—' : value}</span>
        <span className="eyebrow mt-1.5 !text-[10px]">Risk / 100</span>
      </div>
    </div>
  )
}