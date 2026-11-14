8// src/engine/sleepSimulator.js
// Seeded DEMO sleep data for the Brain & Sleep domain.
// EVERYTHING produced here is labelled SIMULATED_DEMO. It is NOT NASA data and NOT measured.
//
// Same seed = same numbers every time, so your demo is repeatable.
// Nights 1-3 are "adaptation nights" (disrupted sleep in a new environment) and are
// excluded from the baseline by default. The baseline window is a configurable demo rule.

import { analyzeSeries } from './anomalyDetector.js';

export const SLEEP_DEFAULTS = {
  seed: 2026,
  nights: 40,
  meanHours: 7.0,
  noiseSd: 0.35,
  adaptationNights: 3,       // nights 1-3 are disrupted
  baselineFirstNight: 4,     // baseline = nights 4..10 (demo rule, not a clinical standard)
  baselineLastNight: 10,
  scenario: 'declining',     // 'stable' or 'declining'
  driftStartNight: 20,       // declining scenario: sleep starts shrinking here
  driftHoursPerNight: 0.12,
  driftMaxLoss: 2.5,         // hours lost at most
};

// Small seeded random generator (mulberry32). Not cryptographic, just repeatable.
function makeRng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Normal-distributed noise from two uniform numbers (Box-Muller).
function gaussian(rng) {
  const u = Math.max(rng(), 1e-12);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function generateSleepNights(userConfig = {}) {
  const c = { ...SLEEP_DEFAULTS, ...userConfig };
  const rng = makeRng(c.seed);
  const nights = [];
  for (let n = 1; n <= c.nights; n++) {
    let hours = c.meanHours + c.noiseSd * gaussian(rng);
    if (n <= c.adaptationNights) hours -= 1.2 - 0.3 * (n - 1);   // disrupted early nights
    if (c.scenario === 'declining' && n >= c.driftStartNight) {
      hours -= Math.min(c.driftMaxLoss, (n - c.driftStartNight + 1) * c.driftHoursPerNight);
    }
    hours = Math.min(10, Math.max(3, Math.round(hours * 10) / 10));
    nights.push({ night: n, label: `N${n}`, value: hours, sourceLabel: 'SIMULATED_DEMO' });
  }
  return nights;
}

// Analyse the sleep up to a given night, comparing against the astronaut's own baseline window.
export function analyzeSleepUpTo(nights, lastNight, userConfig = {}) {
  const c = { ...SLEEP_DEFAULTS, ...userConfig };
  const baselineValues = nights
    .filter((x) => x.night >= c.baselineFirstNight && x.night <= c.baselineLastNight)
    .map((x) => x.value);
  const observations = nights
    .filter((x) => x.night > c.baselineLastNight && x.night <= lastNight)
    .map((x) => ({ label: x.label, value: x.value }));
  return analyzeSeries({
    baselineValues,
    observations,
    meta: { signal: 'sleep_hours', unit: 'hours', direction: 'low', sourceLabel: 'SIMULATED_DEMO', datasetId: null },
  });
}

// Walk through the mission night by night and report when the first alert appears.
export function runSleepDemo(userConfig = {}) {
  const c = { ...SLEEP_DEFAULTS, ...userConfig };
  const nights = generateSleepNights(c);
  const timeline = [];
  let firstAttention = null;
  let firstHigh = null;
  for (let n = c.baselineLastNight + 1; n <= c.nights; n++) {
    const r = analyzeSleepUpTo(nights, n, c);
    timeline.push({ night: n, hours: nights[n - 1].value, status: r.status, factors: r.contributingFactors });
    if (firstAttention === null && r.status !== 'normal') firstAttention = n;
    if (firstHigh === null && r.status === 'high') firstHigh = n;
  }
  return { sourceLabel: 'SIMULATED_DEMO', config: c, nights, timeline, firstAttention, firstHigh };
}

// Run directly:  node src/engine/sleepSimulator.js
if (process.argv[1]?.endsWith('sleepSimulator.js')) {
  const demo = runSleepDemo();
  console.log('SIMULATED_DEMO sleep scenario:', demo.config.scenario, '| seed', demo.config.seed);
  console.log('night  hours  status');
  for (const t of demo.timeline) console.log(`${String(t.night).padEnd(6)} ${String(t.hours).padEnd(6)} ${t.status}`);
  console.log(`\nFirst attention: night ${demo.firstAttention ?? 'none'} | first high: night ${demo.firstHigh ?? 'none'}`);
}