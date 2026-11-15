# AstroVital AI
Space Health & Mission Wellness Platform (NASA Space Apps 2026: health monitoring software for astronauts)

Decision-support prototype. Not a medical diagnostic system. Not affiliated with or endorsed by NASA.

## Run it (2 commands)
```
npm run install:all
npm run dev
```
Web app: http://localhost:5173  |  API: http://localhost:4000 (see `server/API.md`)

In dev the web app reads from the Express API. If the API is down it falls back to the in-browser engine automatically.
The production build (`npm run build`, output in `client/dist`) uses the in-browser engine only, so it deploys as a static site
(Vercel / Netlify / GitHub Pages) with no backend needed and works offline (PWA + Blackout Mode).

## Structure
- `client/`  React + Vite frontend, PWA, offline Blackout Mode
- `server/`  Node/Express API (engine-backed `/api/astronaut/state`, real NASA data at `/api/nasa/osd575`)
- `src/engine/`  reference copy of the intelligence engine and its tests (`npm run test:engine`); the app runs `client/src/engine/`
- `src/data/nasa/`  real NASA OSD-575 input and analysis

## Data honesty
Every value carries a source label: NASA_RESEARCH, MEASURED, SELF_REPORTED or SIMULATED_DEMO.
Real NASA data: Inspiration4 serum biomarkers (OSD-575), shown on the Cardiovascular screen.
Heart rate, HRV, sleep, radiation dose and exercise are SIMULATED_DEMO because the NASA dataset has no such per-astronaut series.
No ML model is trained: the NASA dataset is too small (4 astronauts, 3 baseline samples each), so the app uses transparent
personal-baseline statistics (robust z-score, EWMA, CUSUM) instead.
