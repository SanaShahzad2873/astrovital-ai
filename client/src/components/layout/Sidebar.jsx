import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_ITEMS } from '../../config/navigation'

export function Wordmark() {
  return (
    <div>
      <div className="font-display text-2xl font-bold leading-none tracking-widest text-white">
        ASTROVITAL <span className="text-mission-yellow">AI</span>
      </div>
      <div className="mt-1 text-[10px] font-medium uppercase leading-tight tracking-[0.18em] text-ice/70">
        Space Health &amp; Mission Wellness Platform
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* dark overlay on mobile when menu is open */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/10 bg-nasa-blue/30 backdrop-blur
        transition-transform duration-200 lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-start justify-between p-5">
          <Wordmark />
          <button onClick={onClose} className="text-ice lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-6" aria-label="Main navigation">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg border-l-4 px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-mission-yellow bg-white/10 text-mission-yellow'
                    : 'border-transparent text-ice hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <p className="border-t border-white/10 p-4 text-[11px] leading-snug text-ice/60">
          Decision-support prototype. Not a medical diagnostic system. Not affiliated with or endorsed by NASA.
        </p>
      </aside>
    </>
  )
}