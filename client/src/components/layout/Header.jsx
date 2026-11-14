import { useEffect, useState } from 'react'
import { Menu, Wifi, WifiOff } from 'lucide-react'
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
    <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-space-navy/60 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ice lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-xl font-bold text-white">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="eyebrow hidden sm:inline">
          UTC <span className="text-white">{clock}</span>
        </span>
        <div
          className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[11px] font-medium uppercase tracking-wider ${
            online
              ? 'border-status-optimal/40 text-status-optimal'
              : 'border-mission-yellow/50 text-mission-yellow'
          }`}
        >
          {online ? <Wifi size={13} /> : <WifiOff size={13} />}
          {online ? 'Link active' : 'Offline'}
        </div>
      </div>
    </header>
  )
}