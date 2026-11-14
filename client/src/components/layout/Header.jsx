import { useEffect, useState } from 'react'
import { Menu, Wifi, WifiOff } from 'lucide-react'

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine)
  useEffect(() => {
    const on = () => setOnline(true)
    const off = () => setOnline(false)
    window.addEventListener('online', on)
    window.addEventListener('offline', off)
    return () => {
      window.removeEventListener('online', on)
      window.removeEventListener('offline', off)
    }
  }, [])
  return online
}

export default function Header({ title, onMenuClick }) {
  const online = useOnline()
  return (
    <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-space-navy/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="text-ice lg:hidden" aria-label="Open menu">
          <Menu size={22} />
        </button>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </div>

      <div
        className={`flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
          online
            ? 'border-status-optimal/40 text-status-optimal'
            : 'border-mission-yellow/50 text-mission-yellow'
        }`}
      >
        {online ? <Wifi size={14} /> : <WifiOff size={14} />}
        {online ? 'Link Active' : 'Offline'}
      </div>
    </header>
  )
}