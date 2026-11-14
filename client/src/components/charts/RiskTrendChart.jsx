import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const tick = { fill: 'rgba(220,230,241,0.55)', fontSize: 12 }

export default function RiskTrendChart({ data = [], color = 'var(--color-mission-yellow)' }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 12, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="riskFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.38} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="rgba(220,230,241,0.06)" strokeDasharray="3 6" vertical={false} />
          <XAxis
            dataKey="day"
            tickFormatter={(d) => `D${d}`}
            tick={tick}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={tick}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ stroke: 'rgba(220,230,241,0.25)', strokeWidth: 1 }}
            contentStyle={{
              background: 'rgba(7,15,36,0.92)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 13,
              boxShadow: '0 12px 28px -10px rgba(0,0,0,0.8)',
            }}
            labelStyle={{ color: 'rgba(220,230,241,0.7)', marginBottom: 2 }}
            labelFormatter={(d) => `Mission day ${d}`}
            formatter={(v) => [v, 'Risk score']}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2.5}
            fill="url(#riskFill)"
            activeDot={{ r: 5, stroke: '#061A35', strokeWidth: 2, fill: color }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}