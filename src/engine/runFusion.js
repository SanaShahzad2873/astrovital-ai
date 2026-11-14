// src/engine/runFusion.js
// End-to-end DEMO: real OSD-575 cardiovascular biomarkers (one astronaut) + SIMULATED sleep
// and exercise. Radiation is not connected yet, so it correctly shows as 'unknown'.
//
// Run from the project root (run runOsd575.js first):
//   node src/engine/runFusion.js C001 30
//   (astronaut id, then which simulated sleep night to analyse)
//
// NOTE: the simulated sleep and exercise do NOT belong to this astronaut. They are demo signals.

import fs from 'node:fs';
import { fuseRisk } from './riskFusion.js';
import { generateSleepNights, analyzeSleepUpTo } from './sleepSimulator.js';
import { generateExerciseDays, analyzeExerciseUpTo } from './exerciseSimulator.js';
import { bodyRegionStates } from './twinMapping.js';

const subject = process.argv[2] ?? 'C001';
const night = Number(process.argv[3] ?? 30);

const cardio = JSON.parse(fs.readFileSync('src/data/nasa/osd575_cardio_analysis.json', 'utf8'));
const cardioSeries = cardio.results.filter((r) => r.subject_id === subject);
if (cardioSeries.length === 0) throw new Error(`No OSD-575 results for ${subject}`);

const sleepSeries = [analyzeSleepUpTo(generateSleepNights(), night)];

const exerciseSeries = [analyzeExerciseUpTo(generateExerciseDays(), night)];

const fused = fuseRisk({ cardiovascular: cardioSeries, sleep: sleepSeries, musculoskeletal: exerciseSeries });
const twin = bodyRegionStates(fused);

console.log(`Overall: ${fused.status.toUpperCase()} | score ${fused.score} | confidence ${fused.confidence} | data ${fused.dataCompleteness}`);
console.log('Sources:', fused.sources.join(', '));
for (const d of fused.domains) console.log(`  ${d.domain.padEnd(16)} ${d.status.padEnd(10)} score ${String(d.score).padEnd(5)} confidence ${d.confidence}`);
console.log('\nBody regions (digital twin):');
for (const [k, r] of Object.entries(twin.regions)) console.log(`  ${k.padEnd(9)} ${r.state}`);
console.log('  radiation overlay active:', twin.radiationOverlay.active, `(${twin.radiationOverlay.status})`);
console.log('\nContributing factors:');
for (const f of fused.contributingFactors) console.log(' -', f);
fs.writeFileSync('src/data/nasa/fusion_demo.json', JSON.stringify({ fused, twin }, null, 2));
console.log('\nSaved src/data/nasa/fusion_demo.json');