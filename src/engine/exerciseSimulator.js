// src/engine/exerciseSimulator.js
// Seeded DEMO exercise logs for the Muscle & Bone domain.
// EVERYTHING here is labelled SIMULATED_DEMO. It is NOT NASA data and NOT measured.
//
// IMPORTANT: exercise minutes do NOT measure bone density or muscle mass. They only show
// exercise consistency, which is a deconditioning RISK INDICATOR, nothing more.
// The daily target below is a configurable demo value, not an official NASA requirement.

import { analyzeSeries } from './anomalyDetector.js';
import { makeRng, gaussian } from './sleepSimulator.js';

export const EXERCISE_DEFAULTS = {
  seed: 4242,
  days: 40,
  meanMinutes: 60,
  noiseSd: 8,
  demoTargetMinutes: 50,     // demo target (configurable, unverified)
  baselineFirstDay: 4,
  baselineLastDay: 10,
  scenario: 'declining',     // 'stable' or 'declining'
  driftStartDay: 22,
  driftMinutesPerDay: 2.5,
  driftMaxLoss: 40,
};

export function generateExerciseDays(userConfig = {}) {
  const c = { ...EXERCISE_DEFAULTS, ...userConfig };
  const rng = makeRng(c.seed);
  const out = [];
  for (let d = 1; d <= c.days; d++) {
    let minutes = c.meanMinutes + c.noiseSd * gaussian(rng);
    if (c.scenario === 'declining' && d >= c.driftStartDay) {
      minutes -= Math.min(c.driftMaxLoss, (d - c.driftStartDay + 1) * c.driftMinutesPerDay);
    }
    minutes = Math.max(0, Math.round(minutes));
    out.push({ day: d, label: `D${d}`, value: minutes, metTarget: minutes >= c.demoTargetMinutes, sourceLabel: 'SIMULATED_DEMO' });
  }
  return out;
}

export function analyzeExerciseUpTo(days, lastDay, userConfig = {}) {
  const c = { ...EXERCISE_DEFAULTS, ...userConfig };
  const baselineValues = days.filter((x) => x.day >= c.baselineFirstDay && x.day <= c.baselineLastDay).map((x) => x.value);
  const observations = days.filter((x) => x.day > c.baselineLastDay && x.day <= lastDay).map((x) => ({ label: x.label, value: x.value }));
  const result = analyzeSeries({
    baselineValues,
    observations,
    meta: { signal: 'exercise_minutes', unit: 'minutes', direction: 'low', sourceLabel: 'SIMULATED_DEMO', datasetId: null },
  });
  const recent = days.filter((x) => x.day > c.baselineLastDay && x.day <= lastDay);
  return {
    ...result,
    missedTargets: recent.filter((x) => !x.metTarget).length,
    daysChecked: recent.length,
    note: 'Exercise logs show consistency only. They do not measure bone density or muscle mass.',
  };
}