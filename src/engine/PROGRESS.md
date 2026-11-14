# PROGRESS.md: Intelligence Engine (OSD-575 + health fusion)

## Completed
- Personal baseline engine: median, MAD, robust z-score, baseline confidence
- Anomaly detection: robust z, EWMA, CUSUM, persistence, direction-aware
- OSD-575 run on real NASA cardiovascular biomarkers (9 analytes x 4 astronauts), compared on a log10 scale
- Handling of suspicious repeated values (haptoglobin 17,907,000 ng/ml appears 7 times; cause unverified), original values preserved
- Seeded SIMULATED_DEMO sleep and exercise simulators
- Risk fusion across 4 domains; missing data is never healthy (`unknown` / `incomplete`)
- Digital twin body-region mapping (proposed)
- One-call demo builder `buildDemoState()` and single entry point `index.js`
- INTEGRATION.md for teammates
- 38 automated tests, all passing

## Current work
- Handover to the integration member

## Files (src/engine/)
baselineEngine.js, anomalyDetector.js, riskFusion.js, twinMapping.js, sleepSimulator.js,
exerciseSimulator.js, demoScenario.js, index.js, runOsd575.js (Node only), runFusion.js (Node only),
INTEGRATION.md, PROGRESS.md, __tests__/ (7 test files)
Data: src/data/nasa/raw/*.csv (input), osd575_cardio_analysis.json, fusion_demo.json (generated)

## Dependencies
None. Plain JavaScript (ES modules). Needs "type": "module" wherever tests run.

## API contracts
See INTEGRATION.md section 4. Core function:
`analyzeSeries({ observations:[{label,value}], baselineValues:number[], meta:{signal,unit,direction,sourceLabel,datasetId} })`
Statuses: normal | attention | high | unknown (overall also: incomplete).

## Pending
- Radiation module results in analyzeSeries format (Member 1 radiation module)
- Connect engine to the real app, copy engine into client/ and test in Vite (integration member)
- Confirm twin mapping with the digital twin owner
- Replace simulated sleep/exercise with real check-in data where available
- Investigate the repeated haptoglobin value if the dataset documentation can be found

## Known issues / honesty notes
- NASA baseline = 3 preflight samples per astronaut, so confidence is LOW
- Cardiovascular panel = research blood biomarkers, NOT heart rate or HRV
- Results are deviations from a personal baseline, NOT diagnoses
- Thresholds, floors, targets and baseline windows are configurable demonstration rules, not clinical limits
- Haptoglobin for C003 and C004 is `unknown` because most of their values are the suspicious repeated value
- Sleep and exercise are SIMULATED_DEMO; exercise logs do not measure bone density or muscle mass
- The engine has not yet been tested inside client/ (Vite)

## Integration instructions
Read INTEGRATION.md. Import only from engine/index.js.