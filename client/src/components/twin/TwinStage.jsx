import AstronautTwin, { TwinLegend } from './AstronautTwin'

export default function TwinStage(props) {
  return (
    <div>
      <div className="relative mx-auto w-full max-w-[400px]" style={{ aspectRatio: '400 / 560' }}>
        <svg viewBox="0 0 400 560" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="200" cy="280" r="172" fill="none" stroke="rgba(46,111,216,0.35)" strokeDasharray="3 7" />
          <circle cx="200" cy="280" r="128" fill="none" stroke="rgba(46,111,216,0.18)" />
          <g className="orbit-spin">
            <ellipse cx="200" cy="280" rx="190" ry="62" fill="none" stroke="rgba(46,111,216,0.5)" strokeWidth="1.5" />
            <circle cx="390" cy="280" r="5" fill="var(--color-mission-yellow)" />
          </g>
        </svg>
        <div className="absolute inset-y-0 left-[12.5%] flex w-[75%] items-center">
          <AstronautTwin {...props} />
        </div>
      </div>
      <TwinLegend />
    </div>
  )
}