import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tick = { fill: 'var(--color-ice)', fontSize: 11 }

export default function RiskTrendChart({ data = [], color = 'var(--color-mission-yellow)' }) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(220,230,241,0.08)" vertical={false} />
          <XAxis dataKey="day" tickFormatter={(d) => `D${d}`} tick={tick} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={tick} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: 'var(--color-space-navy)',
              border: '1px solid rgba(220,230,241,0.2)',
              borderRadius: 8,
              color: '#fff',
            }}
            labelFormatter={(d) => `Mission day ${d}`}
            formatter={(v) => [v, 'Risk score']}
          />
          <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} fill="url(#riskFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}