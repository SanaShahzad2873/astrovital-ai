// src/engine/index.js
// The ONE file other members should import from. Everything here is browser-safe and works offline.
// (runOsd575.js and runFusion.js are Node-only command-line scripts. Do not import them in the app.)

export { buildBaseline, robustZ, median, mad, DEFAULT_CONFIG } from './baselineEngine.js';
export { analyzeSeries, classifyZ, DETECTOR_DEFAULTS } from './anomalyDetector.js';
export { fuseRisk, fuseDomain, DOMAINS } from './riskFusion.js';
export { bodyRegionStates } from './twinMapping.js';
export { generateSleepNights, analyzeSleepUpTo, runSleepDemo } from './sleepSimulator.js';
export { generateExerciseDays, analyzeExerciseUpTo } from './exerciseSimulator.js';
export { buildDemoState } from './demoScenario.js';