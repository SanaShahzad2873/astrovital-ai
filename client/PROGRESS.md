# PROGRESS — Member 2 (Frontend, UI/UX, 2D Digital Twin)

Last updated: 2026-11-14
Branch: feature/frontend-ui

## Completed
- Vite + React (JavaScript) project created in `client/`
- Tailwind CSS v4 with the shared NASA-inspired design tokens (`src/index.css`)
- Fonts bundled offline (Barlow, Barlow Condensed) so Blackout Mode works without internet
- App shell: Sidebar, Header, responsive mobile menu
- React Router with all 10 screens (placeholders for now)
- Reusable components: Card, StatusBadge
- Online/Offline indicator in the header (real browser connection state)

## Current work
- Milestone 2: SourceTag, MetricCard, mock API service, SVG astronaut twin

## Files created / modified
- `client/vite.config.js` (added Tailwind plugin)
- `client/src/index.css` (design tokens, base styles)
- `client/src/main.jsx`, `client/src/App.jsx`
- `client/src/config/navigation.js`
- `client/src/components/layout/AppShell.jsx`
- `client/src/components/layout/Sidebar.jsx`
- `client/src/components/layout/Header.jsx`
- `client/src/components/ui/Card.jsx`
- `client/src/components/ui/StatusBadge.jsx`
- `client/src/pages/ComingSoon.jsx`

## Dependencies
react, react-dom, react-router-dom, recharts, framer-motion, lucide-react,
tailwindcss, @tailwindcss/vite, @fontsource/barlow, @fontsource/barlow-condensed

## Design system (everyone must follow)
Use token class names only, never raw hex codes:
- Backgrounds: `bg-space-navy`, `bg-panel`, `bg-nasa-blue`
- Highlight / active: `text-mission-yellow`
- Secondary text: `text-ice`
- Alerts: `text-nasa-red`
- Status colors: `status-optimal`, `status-attention`, `status-risk`, `status-radiation`, `status-fatigue`
- Fonts: `font-display` (headings), `font-sans` (body)
Tokens are defined in `client/src/index.css`.

## API contracts (proposed, waiting for Member 3 and 4 to confirm)
- `GET /api/astronaut/state` -> overall status, 4 domain scores, bodyRegions, alerts
- `GET /api/domains/:domain/timeseries` -> series with points, unit, source, datasetId
- Status values must be exactly: optimal, attention, risk, fatigue, radiation, unknown
- Missing data = `unknown`, never `optimal`
- Every value has a `source`: NASA_RESEARCH, MEASURED, SELF_REPORTED, SIMULATED_DEMO
- Backend needs CORS enabled for the frontend origin

## Pending tasks
- SourceTag and MetricCard components
- `src/services/api.js` with mock adapter (SIMULATED_DEMO)
- SVG astronaut twin with clickable regions
- All 10 real screens, Recharts charts
- Modal, loading and empty states, alert cards
- PWA and offline integration (with Member 3)

## Known bugs
- None yet

## Integration instructions
1. `git pull origin main`
2. `cd client`
3. `npm install`
4. `npm run dev` (opens at http://localhost:5173)
5. Always run npm commands inside `client/`, not the repo root.