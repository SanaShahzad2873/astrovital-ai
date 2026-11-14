// src/engine/baselineEngine.js
// Step 1 of the AstroVital intelligence engine: a personal baseline.
// Pure JavaScript, no libraries, works offline (Blackout Mode safe).
//
// All numbers in DEFAULT_CONFIG are configurable DEMONSTRATION RULES,
// not clinical standards. Never present them as medical thresholds.

export const DEFAULT_CONFIG = {
  minObservations: 3,        // fewer values than this -> no baseline at all
  // Baseline confidence by number of observations (checked top to bottom)
  confidenceLevels: [
    { min: 10, label: 'high' },
    { min: 5, label: 'moderate' },
    { min: 3, label: 'low' },
  ],
  madScaleFactor: 1.4826,    // makes MAD comparable to a standard deviation
  minScaleFraction: 0.05,    // floor on spread = 5% of |median| (avoids huge z from tiny MAD)
};

// Keep only real numbers. Missing data (null, undefined, NaN, text) is dropped,
// and is NEVER treated as zero or as "healthy".
export function cleanNumbers(values) {
  return (values ?? []).filter((v) => typeof v === 'number' && Number.isFinite(v));
}

export function median(values) {
  const v = cleanNumbers(values).slice().sort((a, b) => a - b);
  if (v.length === 0) return null;
  const mid = Math.floor(v.length / 2);
  return v.length % 2 === 0 ? (v[mid - 1] + v[mid]) / 2 : v[mid];
}

// Median Absolute Deviation: the median of |value - median|.
export function mad(values) {
  const v = cleanNumbers(values);
  const m = median(v);
  if (m === null) return null;
  return median(v.map((x) => Math.abs(x - m)));
}

function confidenceFor(n, config) {
  for (const level of config.confidenceLevels) {
    if (n >= level.min) return level.label;
  }
  return 'none';
}

// Build a personal baseline from an astronaut's own historical values.
// Returns status 'ready', 'insufficient' or 'unusable' so callers never
// mistake "no baseline" for "normal".
export function buildBaseline(values, userConfig = {}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig };
  const v = cleanNumbers(values);
  const n = v.length;

  if (n < config.minObservations) {
    return {
      status: 'insufficient', n, confidence: 'none',
      median: null, mad: null, scale: null, scaleMethod: null,
      reason: `Need at least ${config.minObservations} observations, found ${n}.`,
    };
  }

  const med = median(v);
  const rawMad = mad(v);
  let scale = config.madScaleFactor * rawMad;
  let scaleMethod = 'mad';

  // If more than half the values are identical, MAD is 0. Fall back to mean absolute deviation.
  if (scale <= 0) {
    const meanAD = v.reduce((s, x) => s + Math.abs(x - med), 0) / n;
    scale = 1.2533 * meanAD;
    scaleMethod = 'meanAD';
  }

  // Floor so a lucky-tight baseline can't produce huge z-scores.
  const floor = config.minScaleFraction * Math.abs(med);
  if (scale < floor) {
    scale = floor;
    scaleMethod += '+floor';
  }

  if (!(scale > 0)) {
    return {
      status: 'unusable', n, confidence: 'none',
      median: med, mad: rawMad, scale: null, scaleMethod: null,
      reason: 'Baseline has no variation and a median of 0, so deviations cannot be scaled.',
    };
  }

  return {
    status: 'ready', n, confidence: confidenceFor(n, config),
    median: med, mad: rawMad, scale, scaleMethod, reason: null,
  };
}

// Robust z-score: how many "robust standard deviations" a value is from the baseline.
// Returns null when it cannot be computed (never 0).
export function robustZ(value, baseline) {
  if (!baseline || baseline.status !== 'ready') return null;
  if (typeof value !== 'number' || !Number.isFinite(value)) return null;
  return (value - baseline.median) / baseline.scale;
}