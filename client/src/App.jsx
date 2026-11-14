import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ComingSoon from './pages/ComingSoon'
import CommandCenter from './pages/CommandCenter'
import { NAV_ITEMS } from './config/navigation'
import DigitalTwin from './pages/DigitalTwin'
import Cardiovascular from './pages/Cardiovascular'


const PAGES = {
  '/': <CommandCenter />,
  '/twin': <DigitalTwin />,
  '/cardiovascular': <Cardiovascular />,
}


export default function App() {
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
