import { useEffect, useState } from 'react'
import { Menu, WifiOff } from 'lucide-react'
import useOnline from '../../hooks/useOnline'

function useUtcClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now.toISOString().slice(11, 19)
}

export default function Header({ title, onMenuClick }) {
  const online = useOnline()
  const clock = useUtcClock()

  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/[0.08] bg-space-navy/60 px-4 py-3.5 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ice lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-[22px] font-semibold tracking-tight text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-2.5">
        {/* UTC clock pill */}
        <span className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-ice/60 sm:inline-flex">
          UTC
          <span className="text-[13px] font-semibold tabular-nums text-white">{clock}</span>
        </span>

        {/* live link status */}
        <div
          className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
            online
              ? 'border-status-optimal/35 bg-status-optimal/10 text-status-optimal'
              : 'border-mission-yellow/45 bg-mission-yellow/10 text-mission-yellow'
          }`}
        >
          {online ? (
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-status-optimal opacity-60 motion-safe:animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-status-optimal" />
            </span>
          ) : (
            <WifiOff size={13} />
          )}
          {online ? 'Link active' : 'Offline'}
        </div>
      </div>
    </header>
  )
}