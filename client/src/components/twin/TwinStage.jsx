import { useReducedMotion } from 'framer-motion'
import AstronautTwin, { TwinLegend } from './AstronautTwin'

export default function TwinStage(props) {
  const reduce = useReducedMotion()

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[420px]" style={{ aspectRatio: '400 / 420' }}>
        {/* HUD background */}
        <svg viewBox="0 0 400 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="stage-floor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5AA9FF" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#5AA9FF" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="205" r="176" fill="none" stroke="rgba(90,169,255,0.18)" />
          <circle cx="200" cy="205" r="148" fill="none" stroke="rgba(90,169,255,0.3)" strokeDasharray="4 8" />
          <g className="hud-spin">
            <circle cx="200" cy="205" r="190" fill="none" stroke="rgba(220,230,241,0.35)" strokeDasharray="1 11" strokeWidth="3" />
          </g>

          {/* corner brackets */}
          <g fill="none" stroke="rgba(220,230,241,0.45)" strokeWidth="2">
            <path d="M12 38 V12 H38" />
            <path d="M388 38 V12 H362" />
            <path d="M12 382 V408 H38" />
            <path d="M388 382 V408 H362" />
          </g>

          {/* platform under the feet */}
          <ellipse cx="200" cy="386" rx="110" ry="18" fill="url(#stage-floor)" />
          <ellipse cx="200" cy="384" rx="92" ry="13" fill="none" stroke="rgba(90,169,255,0.6)" />

          <text x="200" y="412" textAnchor="middle" fontSize="9" letterSpacing="2"
            fill="rgba(220,230,241,0.5)" fontFamily="IBM Plex Mono, monospace">
            BODY MAP / FRONT VIEW
          </text>
        </svg>

        {/* Astronaut */}
        <div className="absolute left-[19%] top-[3%] w-[62%]">
          <AstronautTwin {...props} />
        </div>

        {/* Scan line (on top, ignores clicks) */}
        {!reduce && (
          <svg viewBox="0 0 400 420" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="80" y="40" width="240" height="2" fill="#5AA9FF" opacity="0.45">
              <animate attributeName="y" values="40;375;40" dur="7s" repeatCount="indefinite" />
            </rect>
          </svg>
        )}
      </div>
      <TwinLegend />
    </div>
  )
}