# AstroVital API (http://localhost:5000)

| Method | Endpoint | Purpose |
|---|---|---|
| GET | /api/ping | Server alive check |
| GET | /api/health/overview | Overall status, risk score, domain scores |
| GET | /api/health/cardiovascular | Biomarker readings |
| GET | /api/health/sleep | Sleep records |
| GET | /api/health/radiation | Radiation records |
| GET | /api/health/fitness | Exercise records |
| GET | /api/health/alerts | Active alerts |
| GET | /api/astronaut/twin-state | Body region colors |
| GET | /api/nasa/datasets | NASA dataset metadata |
| POST | /api/checkins | body: mood, stress, fatigue (1-10), sleepHours (0-24) |
| POST | /api/reaction-test | body: reactionTimeMs (50-5000) |
| POST | /api/blackout/events | body: type (required), note |
| GET | /api/reports/mission | Mission summary |

Every record has `source` (NASA_RESEARCH, MEASURED, SELF_REPORTED, SIMULATED_DEMO) and `timestamp`.
Errors: `{ "error": "...", "details": [...] }` with status 400, 404 or 500.