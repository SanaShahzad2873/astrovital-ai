import { useReducedMotion } from 'framer-motion'
import AstronautTwin, { TwinLegend } from './AstronautTwin'

export default function TwinStage(props) {
  const reduce = useReducedMotion()

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[560px]" style={{ aspectRatio: '400 / 420' }}>
        {/* HUD background */}
        <svg viewBox="0 0 400 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="stage-floor" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#5AA9FF" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#5AA9FF" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="stage-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2E6FD8" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2E6FD8" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="200" cy="205" r="170" fill="url(#stage-glow)" />
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
          <ellipse cx="200" cy="374" rx="118" ry="19" fill="url(#stage-floor)" />
          <ellipse cx="200" cy="372" rx="98" ry="13" fill="none" stroke="rgba(90,169,255,0.7)" />
          <ellipse cx="200" cy="372" rx="72" ry="9" fill="none" stroke="rgba(255,209,0,0.55)" strokeDasharray="3 5" />

          <text x="200" y="406" textAnchor="middle" fontSize="9" letterSpacing="2"
            fill="rgba(220,230,241,0.5)" fontFamily="IBM Plex Mono, monospace">
            BODY MAP / FRONT VIEW
          </text>
        </svg>

        {/* Astronaut */}
        <div className="absolute left-[18%] top-[2%] w-[64%]">
          <AstronautTwin {...props} />
        </div>

        {/* Scan line (on top, ignores clicks) */}
        {!reduce && (
          <svg viewBox="0 0 400 420" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
            <rect x="80" y="40" width="240" height="2" fill="#5AA9FF" opacity="0.4">
              <animate attributeName="y" values="40;360;40" dur="7s" repeatCount="indefinite" />
            </rect>
          </svg>
        )}
      </div>
      <TwinLegend />
    </div>
  )
}