# PROGRESS.md — Member (Intelligence Engine / OSD-575)

## Completed
- Personal baseline engine (median, MAD, robust z-score, baseline confidence)
- Anomaly detector (robust z, EWMA, CUSUM, persistence)
- 10 unit tests (all passing)
- OSD-575 runner: real NASA cardiovascular biomarker panel, 9 analytes x 4 astronauts

## Current work
- Reviewing OSD-575 results and data-quality flags

## Files
- src/engine/baselineEngine.js
- src/engine/anomalyDetector.js
- src/engine/__tests__/engine.test.js
- src/engine/runOsd575.js
- src/data/nasa/raw/LSDS-8_Multiplex_serum.cardiovascular.EvePanel_SUBMITTED.csv (input)
- src/data/nasa/osd575_cardio_analysis.json (generated output)

## Dependencies
- None. Plain JavaScript (ES modules). Needs "type": "module" in package.json.

## API contract
`analyzeSeries({ observations, baselineValues, meta, config?, baselineConfig? })`
- observations: [{ label, value }]  (value may be null)
- baselineValues: number[] (the person's own earlier values)
- meta: { signal, unit, direction: 'both'|'low'|'high', sourceLabel, datasetId }
- returns: { signal, unit, status ('normal'|'attention'|'high'|'unknown'), confidence,
  baseline, points, detectors, contributingFactors[], dataQuality, sourceLabel,
  datasetId, timestamp, thresholdsNote }
- 'unknown' means no usable baseline. It never means healthy.

## Pending
- Flag assay-ceiling values (haptoglobin 17,907,000 ng/ml appears 7 times) as censored
- Optional log10 transform for biomarkers spanning orders of magnitude
- sleepSimulator.js (SIMULATED_DEMO, seeded)
- riskFusion.js (combine the four domains)

## Known issues / honesty notes
- Baseline = 3 preflight samples, so confidence is LOW
- Cardiovascular panel = blood biomarkers, NOT heart rate or HRV
- Results are deviations from a personal baseline, NOT diagnoses
- Thresholds are configurable demonstration rules, not clinical limits

## Integration
- Import analyzeSeries from src/engine/anomalyDetector.js
- Run `node src/engine/runOsd575.js` to regenerate the JSON