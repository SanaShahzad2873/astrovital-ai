// src/engine/demoScenario.js
// One call that builds the whole demo state for the app. Browser-safe (no Node modules).
//
//   import { buildDemoState } from './engine/index.js';
//   import cardio from '../data/nasa/osd575_cardio_analysis.json';
//   const state = buildDemoState({ cardiovascular: cardio.results.filter(r => r.subject_id === 'C001'), night: 30 });
//   state.fused  -> overall + domain results   state.twin -> body region states
//
// `night` is the mission day for the SIMULATED sleep and exercise. Before night 11 the baseline
// window is not complete, so those domains correctly show 'unknown'. Raise it to "advance the mission".
// Sleep and exercise are SIMULATED_DEMO. The cardiovascular input is real NASA OSD-575 research data.

import { fuseRisk } from './riskFusion.js';
import { bodyRegionStates } from './twinMapping.js';
import { generateSleepNights, analyzeSleepUpTo } from './sleepSimulator.js';
import { generateExerciseDays, analyzeExerciseUpTo } from './exerciseSimulator.js';

export function buildDemoState({ cardiovascular = [], radiation = [], night = 30, scenario = 'declining', now } = {}) {
  const sleep = [analyzeSleepUpTo(generateSleepNights({ scenario }), night, { scenario })];
  const musculoskeletal = [analyzeExerciseUpTo(generateExerciseDays({ scenario }), night, { scenario })];
  const fused = fuseRisk({ cardiovascular, sleep, radiation, musculoskeletal }, { now });
  return { night, scenario, fused, twin: bodyRegionStates(fused) };
}