import { Routes, Route } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import ComingSoon from './pages/ComingSoon'
import { NAV_ITEMS } from './config/navigation'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {NAV_ITEMS.map((item) => (
          <Route
            key={item.path}
            path={item.path}
            element={<ComingSoon name={item.label} />}
          />
        ))}
      </Route>
    </Routes>
  )
}