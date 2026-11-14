# PROGRESS.md: Member 2 (Frontend, UI/UX and 2D Digital Twin)

Branch: `feature/frontend-ui`  |  Last updated: 2026-11-15

## Completed work
- Vite + React 19 + Tailwind v4 (`@tailwindcss/vite`) project in `client/`
- NASA-inspired design system in `src/index.css` (`@theme` colors, fonts, `.glass-card`, `.eyebrow`, `.num`)
- Layout shell: `AppShell`, `Header`, `Sidebar`, routing for all 10 screens (`config/navigation.js`)
- Reusable UI: `Card`, `MetricCard`, `StatusBadge`, `SourceTag`, `AlertCard`, `RiskGauge`, `DemoBanner`, `OrbitMark`, `StateViews` (loading/error/empty)
- Charts: `RiskTrendChart`, `Sparkline` (Recharts)
- Panels: `MissionProgressCard`, `EarthLinkCard`, `EventTimeline`
- 2D SVG astronaut twin: `AstronautTwin`, `TwinStage`, `RegionList`, `RegionDetailPanel`
- Pages: Command Center, Digital Twin, Cardiovascular (via shared `DomainPage`)
- Frontend API service with mock mode (`services/api.js`, `services/mockData.js`)

## Current work
- Cardiovascular screen: verifying that `metrics` render (CRP, IL-6, Heart rate, HRV)
- Next: Brain & Sleep (with reaction-time test), then Radiation, Muscle & Bone

## Files created / modified
- `src/pages/DomainPage.jsx` (shared layout for the 4 health-domain screens)
- `src/pages/Cardiovascular.jsx`
- `src/App.jsx` (added `/cardiovascular` route)
- `src/services/mockData.js` (added `domains.cardiovascular.metrics`)

## Dependencies
react, react-dom, react-router-dom, recharts, framer-motion, lucide-react,
tailwindcss + @tailwindcss/vite, @fontsource/barlow, barlow-condensed, ibm-plex-mono

## API contracts (frontend expects)
- `GET /api/astronaut/state` returns `MOCK_STATE` shape (see `mockData.js`)
- Mock mode is on by default; set `VITE_USE_MOCK=false` and `VITE_API_URL` to use the real API
- PROPOSED addition (needs Member 3/4 agreement): each domain gets `metrics[]`:
  `{ key, label, value, unit, status, source, quality, collectedAt, history[{day,value}], note? }`
- `value: null` means no data. The UI shows "No Data", never "Optimal"

## Pending tasks
- Brain & Sleep, Radiation, Muscle & Bone screens
- Reaction-time test
- AI Health Copilot, Blackout Mode, NASA Research Library, Mission Reports
- PWA / offline integration with Member 3
- Replace mock data with real API once endpoints exist

## Known bugs
- Cardiovascular `metrics` cards not rendering yet (checking `mockData.js` placement)
- Terminal shows odd characters (`â†’`, `â€”`): console display only; verify in browser

## Instructions for integration
1. `cd client && npm install && npm run dev` (opens http://localhost:5173)
2. All screens read data only through `src/services/api.js`. Do not hardcode health values in pages.
3. Source labels must be one of NASA_RESEARCH, MEASURED, SELF_REPORTED, SIMULATED_DEMO.
- Design v3: HUD-style panels (index.css), chibi astronaut twin (SVG), new TwinStage, Command Center re-layout
- Files modified: index.css, AstronautTwin.jsx, TwinStage.jsx, CommandCenter.jsx