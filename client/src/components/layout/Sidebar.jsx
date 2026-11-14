import { NavLink } from 'react-router-dom'
import { X } from 'lucide-react'
import { NAV_ITEMS, NAV_GROUPS } from '../../config/navigation'
import OrbitMark from '../ui/OrbitMark'

export function Wordmark() {
  return (
    <div className="flex items-center gap-3">
      <OrbitMark />
      <div>
        <div className="font-display text-[22px] font-bold leading-none tracking-[0.12em] text-white">
          ASTROVITAL <span className="text-mission-yellow">AI</span>
        </div>
        <div className="mt-1.5 text-[11px] font-medium leading-tight text-ice/55">
          Space health &amp; mission wellness
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
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-white/[0.08] backdrop-blur-xl
        transition-transform duration-200 lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, rgba(8,22,49,0.96), rgba(6,26,53,0.92))',
        }}
      >
        <div className="flex items-start justify-between px-5 pb-5 pt-6">
          <Wordmark />
          <button onClick={onClose} className="text-ice lg:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-4" aria-label="Main navigation">
          {NAV_GROUPS.map((group) => (
            <div key={group} className="mb-6">
              <p className="eyebrow px-3 pb-2">{group}</p>
              <div className="space-y-0.5">
                {NAV_ITEMS.filter((i) => i.group === group).map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    end={path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors ${
                        isActive
                          ? 'bg-white/[0.07] text-white'
                          : 'text-ice/70 hover:bg-white/[0.04] hover:text-white'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {/* yellow accent bar on the active page */}
                        <span
                          className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-mission-yellow transition-opacity ${
                            isActive ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{ boxShadow: isActive ? '0 0 12px rgba(255,209,0,0.7)' : 'none' }}
                          aria-hidden="true"
                        />
                        <Icon
                          size={18}
                          className={isActive ? 'text-mission-yellow' : 'text-ice/55 group-hover:text-ice'}
                        />
                        {label}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <p className="mx-4 mb-4 rounded-xl border border-white/[0.07] bg-white/[0.03] p-3 text-[11px] leading-snug text-ice/50">
          Decision-support prototype. Not a medical diagnostic system. Not affiliated with or endorsed by NASA.
        </p>
      </aside>
    </>
  )
}