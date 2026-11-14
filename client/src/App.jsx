import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ComingSoon from './pages/ComingSoon'
import CommandCenter from './pages/CommandCenter'
import { NAV_ITEMS } from './config/navigation'
import DigitalTwin from './pages/DigitalTwin'
import Cardiovascular from './pages/Cardiovascular'
import BrainSleep from './pages/BrainSleep'
import Radiation from './pages/Radiation'
import MuscleBone from './pages/MuscleBone'
import ResearchLibrary from './pages/ResearchLibrary'
import BlackoutMode from './pages/BlackoutMode'
import Copilot from './pages/Copilot'
import { getAstronautState } from './services/api'
import { saveSnapshot } from './services/offlineStore'

const PAGES = {
  '/': <CommandCenter />,
  '/twin': <DigitalTwin />,
  '/cardiovascular': <Cardiovascular />,
  '/brain-sleep': <BrainSleep />,
  '/radiation': <Radiation />,
  '/musculoskeletal': <MuscleBone />,
  '/copilot': <Copilot />,
  '/blackout': <BlackoutMode />,
  '/research': <ResearchLibrary />,
}

export default function App() {
  // While online, keep a local copy of the latest state for Blackout Mode.
  useEffect(() => {
    if (!navigator.onLine) return
    getAstronautState()
      .then((s) => saveSnapshot(s, s.overall?.source ?? 'SIMULATED_DEMO'))
      .catch(() => {})
  }, [])

  return (
    <Routes>
      <Route element={<AppShell />}>
        {NAV_ITEMS.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={PAGES[item.path] ?? <ComingSoon name={item.label} />}
          />
        ))}
      </Route>
    </Routes>
  )
}