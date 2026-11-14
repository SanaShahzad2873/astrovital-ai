import { useId } from 'react'
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts'

export default function Sparkline({ data = [], color = 'var(--color-ice)' }) {
  const gid = 'spark' + useId().replace(/:/g, '')

  if (!data || data.length === 0) {
    return (
      <div
        className="flex h-full w-full items-center justify-center rounded border border-dashed border-white/15 font-mono text-[10px] text-ice/50"
        aria-label="No trend data"
      >
        no trend
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 2, bottom: 2, left: 2 }}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <YAxis hide domain={[0, 100]} />
        <Area
          type="monotone" dataKey="value" stroke={color} strokeWidth={2}
          fill={`url(#${gid})`} dot={false} isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}