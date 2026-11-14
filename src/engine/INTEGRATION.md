# Engine integration guide

For the frontend, backend, digital twin, Copilot and integration members.
The engine is plain JavaScript. It works offline, so Blackout Mode can use it.

## 1. Import from one place

```js
import { buildDemoState, fuseRisk, bodyRegionStates, analyzeSeries } from './engine/index.js';
```

Only import from `engine/index.js`. Do NOT import `runOsd575.js` or `runFusion.js` (Node-only scripts).

## 2. Where the engine lives (decide this first)

The engine is in `src/engine/` at the repo root, but the React app is in `client/`.
Vite may not serve files outside `client/`. Simplest fix: the integration member copies
`src/engine/` into `client/src/engine/` (without `__tests__` and the two `run*.js` scripts),
and copies `src/data/nasa/osd575_cardio_analysis.json` into `client/src/data/`.
Check this works in the real app, because it has not been tested inside `client/`.

## 3. Quickest way to show something

```js
import cardio from '../data/osd575_cardio_analysis.json';
const state = buildDemoState({
  cardiovascular: cardio.results.filter((r) => r.subject_id === 'C001'),
  night: 30,            // mission day for the SIMULATED sleep + exercise; raise it to advance the mission
});
state.fused   // overall status + 4 domain results
state.twin    // body region states for the SVG astronaut
```

## 4. Output shapes

`state.fused`:
```
{ status: 'normal'|'attention'|'high'|'incomplete'|'unknown',
  score: 0-100 | null, confidence: 'none'|'low'|'moderate'|'high',
  dataCompleteness: 'complete'|'partial'|'none',
  domains: [{ domain, status ('unknown' possible), score, confidence, contributingFactors[], dataQuality, sources[] }],
  domainsMissing: [], contributingFactors: [], sources: ['NASA_RESEARCH'|'SIMULATED_DEMO'|...],
  timestamp, thresholdsNote }
```

`state.twin`:
```
{ regions: { head, chest, abdomen, leftArm, rightArm, leftLeg, rightLeg },   // each:
      { region, state: 'optimal'|'attention'|'high_risk'|'fatigue'|'unknown', domain, status, score, confidence, reasons[], sources[] }
  radiationOverlay: { active, status, reasons[] }, timestamp }
```
Mapping (proposed): head=sleep, chest=cardiovascular, limbs=musculoskeletal, abdomen=overall, radiation=whole-body overlay.

## 5. UI rules (please follow)

- `unknown` and `incomplete` are NOT healthy. Show grey / "not enough data", never green.
- Always show the source label (`NASA_RESEARCH`, `SIMULATED_DEMO`, ...) next to values.
- Show `confidence`. The NASA baseline has only 3 preflight samples, so it is `low`.
- Show `thresholdsNote` somewhere (About / Reports): thresholds are demo rules, not clinical limits.
- Use the Copilot text straight from `contributingFactors` / `reasons`. Do not invent explanations.
- Colours come from the shared design system, keyed by `state` (green / amber / red / purple / grey). Radiation overlay = blue.
- Never describe results as a diagnosis. Cardiovascular data = research blood biomarkers, not heart rate.

## 6. Plugging in radiation (Member 1 radiation module)

Produce an array of `analyzeSeries()` results and pass it as `radiation` to `fuseRisk()` / `buildDemoState()`.
Use `sourceLabel: 'NASA_RESEARCH'` only for real research data. Never invent individual dosimeter values.

## 7. Real sleep / exercise / check-in data

Replace the simulators with `analyzeSeries({ baselineValues, observations, meta })`
(see `anomalyDetector.js`). Use `sourceLabel: 'SELF_REPORTED'` or `'MEASURED'`, not `SIMULATED_DEMO`.

## 8. Run the tests (from the repo root)

```
node --test src/engine/__tests__/engine.test.js
node --test src/engine/__tests__/sleepSimulator.test.js
node --test src/engine/__tests__/exerciseSimulator.test.js
node --test src/engine/__tests__/riskFusion.test.js
node --test src/engine/__tests__/twinMapping.test.js
node --test src/engine/__tests__/demoScenario.test.js
node --test src/engine/__tests__/browserSafe.test.js
```
Expected: all pass (38 tests).

## 9. Regenerate the NASA results and demo files

```
node src/engine/runOsd575.js        # needs src/data/nasa/raw/LSDS-8_Multiplex_serum.cardiovascular.EvePanel_SUBMITTED.csv
node src/engine/runFusion.js C001 30
```