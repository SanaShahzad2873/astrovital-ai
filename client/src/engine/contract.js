// THE DATA CONTRACT shared by all 4 members. Change it only after telling the team.
export const SOURCE_LABELS = ['NASA_RESEARCH', 'MEASURED', 'SELF_REPORTED', 'SIMULATED_DEMO'];
export const QUALITY = ['ok', 'missing', 'stale', 'conflicting'];
// worse: +1 means a HIGHER value is worse, -1 means a LOWER value is worse. w = weight inside its domain.
export const SIGNALS = {
  restingHr:  { domain: 'cardio',    unit: 'bpm',   worse: 1,  w: 0.5,  label: 'Resting heart rate' },
  hrv:        { domain: 'cardio',    unit: 'ms',    worse: -1, w: 0.5,  label: 'Heart rate variability' },
  sleepHours: { domain: 'sleep',     unit: 'h',     worse: -1, w: 0.3,  label: 'Sleep duration' },
  mood:       { domain: 'sleep',     unit: 'score', worse: -1, w: 0.15, label: 'Mood (1-10)' },
  stress:     { domain: 'sleep',     unit: 'score', worse: 1,  w: 0.15, label: 'Stress (1-10)' },
  fatigue:    { domain: 'sleep',     unit: 'score', worse: 1,  w: 0.15, label: 'Fatigue (1-10)' },
  reactionMs: { domain: 'sleep',     unit: 'ms',    worse: 1,  w: 0.25, label: 'Reaction time' },
  dose:       { domain: 'radiation', unit: 'mSv',   worse: 1,  w: 1,    label: 'Daily radiation dose' },
  exerciseMin:{ domain: 'fitness',   unit: 'min',   worse: -1, w: 1,    label: 'Exercise minutes' },
};
export const DOMAINS = ['cardio', 'sleep', 'radiation', 'fitness'];
// Radiation: only these units can be added together. Anything else (Gy, mGy, counts...) is excluded and reported.
export const DOSE_TO_MSV = { mSv: 1, uSv: 0.001, 'µSv': 0.001 };
// PROTOTYPE rules: configurable demonstration values, NOT clinical thresholds.
export const CONFIG = { baselineDays: 14, minBaselineObs: 7, staleDays: 3, cusumK: 1.25, cusumH: 12, attentionRisk: 50, highRisk: 75, recentWindow: 7 };
/** A record: { astronautId, timestamp (ISO), signal, value (number), unit, sourceLabel, quality='ok', datasetId?, meta? } */
export function validateRecord(r) {
  const e = [];
  if (!r || typeof r !== 'object') return ['record must be an object'];
  if (!r.astronautId) e.push('astronautId missing');
  if (!r.timestamp || Number.isNaN(Date.parse(r.timestamp))) e.push('timestamp must be an ISO date string');
  const s = SIGNALS[r.signal];
  if (!s) e.push(`unknown signal "${r.signal}"`);
  if (typeof r.value !== 'number' || !Number.isFinite(r.value)) e.push('value must be a finite number');
  if (!SOURCE_LABELS.includes(r.sourceLabel)) e.push(`sourceLabel must be one of ${SOURCE_LABELS.join(', ')}`);
  if (r.quality && !QUALITY.includes(r.quality)) e.push('quality invalid');
  if (s && r.signal === 'dose') { if (!(r.unit in DOSE_TO_MSV)) e.push(`dose unit "${r.unit}" not supported (use mSv or uSv)`); }
  else if (s && r.unit !== s.unit) e.push(`unit for ${r.signal} must be "${s.unit}", got "${r.unit}"`);
  return e;
}
