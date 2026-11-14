// src/engine/anomalyDetector.js
// Step 2: anomaly detection on top of a personal baseline.
// Robust z-score + EWMA + CUSUM + persistence. Fully explainable.
// All thresholds are configurable DEMONSTRATION RULES, not clinical limits.

import { buildBaseline, robustZ } from './baselineEngine.js';

export const DETECTOR_DEFAULTS = {
  attentionZ: 2.0,     // |z| above this -> 'attention'
  highZ: 3.5,          // |z| above this -> 'high'
  ewmaLambda: 0.3,     // EWMA smoothing (higher = reacts faster)
  ewmaL: 3,            // EWMA control limit width
  cusumK: 0.5,         // CUSUM slack
  cusumH: 4,           // CUSUM alarm level
  persistenceRun: 3,   // this many consecutive deviations = persistent
};

const ORDER = { normal: 0, attention: 1, high: 2 };
const worse = (a, b) => (ORDER[a] >= ORDER[b] ? a : b);

// direction: 'both' | 'low' | 'high' (which way is concerning for this signal).
// For 'low' we flip the sign so "bad" is always positive.
const orient = (z, direction) => (direction === 'low' ? -z : z);
const exceeds = (x, limit, direction) => (direction === 'both' ? Math.abs(x) > limit : x > limit);

export function classifyZ(z, direction = 'both', cfg = DETECTOR_DEFAULTS) {
  if (z === null) return 'missing';
  const x = orient(z, direction);
  if (exceeds(x, cfg.highZ, direction)) return 'high';
  if (exceeds(x, cfg.attentionZ, direction)) return 'attention';
  return 'normal';
}

// EWMA on a list of z-scores. Alarm limit uses the steady-state formula.
export function ewmaSeries(zs, cfg = DETECTOR_DEFAULTS) {
  const limit = cfg.ewmaL * Math.sqrt(cfg.ewmaLambda / (2 - cfg.ewmaLambda));
  let prev = 0;
  return zs.map((z) => {
    prev = cfg.ewmaLambda * z + (1 - cfg.ewmaLambda) * prev;
    return { value: prev, limit };
  });
}

// CUSUM: accumulates small, sustained shifts. Returns upper and lower sums.
export function cusumSeries(zs, cfg = DETECTOR_DEFAULTS) {
  let hi = 0;
  let lo = 0;
  return zs.map((z) => {
    hi = Math.max(0, hi + z - cfg.cusumK);
    lo = Math.max(0, lo - z - cfg.cusumK);
    return { high: hi, low: lo };
  });
}

// Length of the most recent run of same-sign deviations above the attention level.
export function currentRunLength(zs, direction = 'both', cfg = DETECTOR_DEFAULTS) {
  let run = 0;
  let sign = 0;
  for (let i = zs.length - 1; i >= 0; i--) {
    const x = orient(zs[i], direction);
    const s = Math.sign(zs[i]);
    const out = exceeds(x, cfg.attentionZ, direction);
    if (!out || (sign !== 0 && s !== sign)) break;
    sign = s;
    run++;
  }
  return run;
}

/**
 * Analyse one signal for one astronaut.
 *
 * observations:   [{ label: 'R+45', value: 12.3 }, ...] in time order (value may be null)
 * baselineValues: the astronaut's own earlier values (array of numbers)
 * meta:           { signal, unit, direction, sourceLabel, datasetId, now }
 */
export function analyzeSeries({ observations, baselineValues, meta = {}, config = {}, baselineConfig = {} }) {
  const cfg = { ...DETECTOR_DEFAULTS, ...config };
  const direction = meta.direction ?? 'both';
  const baseline = buildBaseline(baselineValues, baselineConfig);
  const timestamp = (meta.now ?? new Date()).toISOString();

  const common = {
    signal: meta.signal ?? 'unknown_signal',
    unit: meta.unit ?? null,
    sourceLabel: meta.sourceLabel ?? 'SIMULATED_DEMO',
    datasetId: meta.datasetId ?? null,
    direction,
    thresholdsNote: 'Prototype demonstration rules, configurable; not clinical thresholds.',
    timestamp,
    baseline,
  };

  // No baseline -> UNKNOWN, never "normal".
  if (baseline.status !== 'ready') {
    return { ...common, status: 'unknown', confidence: 'none', points: [], contributingFactors: [baseline.reason] };
  }

  const points = observations.map((o) => {
    const z = robustZ(o.value, baseline);
    return { label: o.label, value: o.value ?? null, z, status: classifyZ(z, direction, cfg) };
  });

  const usable = points.filter((p) => p.z !== null);
  if (usable.length === 0) {
    return { ...common, status: 'unknown', confidence: 'none', points, contributingFactors: ['No usable measurements to compare.'] };
  }

  const zs = usable.map((p) => orient(p.z, direction));
  const rawZs = usable.map((p) => p.z);
  const ewma = ewmaSeries(zs, cfg);
  const cusum = cusumSeries(rawZs, cfg);
  const last = usable[usable.length - 1];
  const lastEwma = ewma[ewma.length - 1];
  const lastCusum = cusum[cusum.length - 1];

  const ewmaAlarm = direction === 'both' ? Math.abs(lastEwma.value) > lastEwma.limit : lastEwma.value > lastEwma.limit;
  const cusumAlarm =
    direction === 'high' ? lastCusum.high > cfg.cusumH
    : direction === 'low' ? lastCusum.low > cfg.cusumH
    : Math.max(lastCusum.high, lastCusum.low) > cfg.cusumH;
  const run = currentRunLength(rawZs, direction, cfg);
  const persistent = run >= cfg.persistenceRun;

  let status = last.status;
  const factors = [];
  if (last.status !== 'normal') {
    factors.push(`Latest value (${last.label}) is ${last.z.toFixed(1)} robust deviations from this person's own baseline median of ${baseline.median}.`);
  }
  if (persistent) { status = worse(status, 'attention'); factors.push(`${run} consecutive measurements deviate in the same direction (persistence).`); }
  if (ewmaAlarm) { status = worse(status, 'attention'); factors.push('EWMA trend crossed its control limit (gradual drift).'); }
  if (cusumAlarm) { status = worse(status, 'attention'); factors.push('CUSUM detected a sustained small shift.'); }

  const missing = points.length - usable.length;
  if (missing > 0) factors.push(`${missing} of ${points.length} measurements were missing and ignored.`);
  if (baseline.confidence === 'low') factors.push(`Baseline is based on only ${baseline.n} observations (low confidence).`);

  return {
    ...common,
    status,
    confidence: baseline.confidence,
    latest: last,
    detectors: { ewmaAlarm, cusumAlarm, persistentRun: run, persistent },
    points,
    dataQuality: { total: points.length, usable: usable.length, missing },
    contributingFactors: factors,
  };
}