import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_ITEMS, NAV_GROUPS } from '../../config/navigation'
import OrbitMark from '../ui/OrbitMark'

export function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <OrbitMark />
      <div>
        <div className="font-display text-xl font-bold leading-none tracking-widest text-white">
          ASTROVITAL <span className="text-mission-yellow">AI</span>
        </div>
        <div className="eyebrow mt-1.5 !text-[9px] !leading-tight">
          Space Health &amp; Mission Wellness
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-60 flex-col border-r border-white/10 bg-space-navy/90 backdrop-blur
        transition-transform duration-200 lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <Wordmark />
          <button onClick={onClose} className="text-ice lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group} className="mb-5">
              <p className="eyebrow px-3 pb-1.5">{group}</p>
              {NAV_ITEMS.filter((i) => i.group === group).map(({ path, label, icon: Icon }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'border-signal/60 bg-nasa-blue/50 text-white shadow-[0_0_18px_-6px_var(--color-signal)]'
                        : 'border-transparent text-ice/80 hover:bg-white/5 hover:text-white'
                    }`
                  }
                  
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={17} className={isActive ? 'text-mission-yellow' : ''} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <p className="border-t border-white/10 p-4 text-[11px] leading-snug text-ice/50">
          Decision-support prototype. Not a medical diagnostic system. Not affiliated with or endorsed by NASA.
        </p>
      </aside>
    </>
  )
}