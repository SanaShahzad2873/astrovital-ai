// src/engine/runOsd575.js
// Runs the baseline engine on REAL NASA OSD-575 data (Inspiration4 serum, Eve cardiovascular panel).
// Each astronaut is compared ONLY to their own 3 preflight samples (L-92, L-44, L-3).
//
// Run from the project root:
//   node src/engine/runOsd575.js
//
// Input : src/data/nasa/raw/LSDS-8_Multiplex_serum.cardiovascular.EvePanel_SUBMITTED.csv
// Output: src/data/nasa/osd575_cardio_analysis.json
//
// HONESTY NOTES (shown in the output file too):
//  - These are research blood biomarkers, NOT heart rate or HRV.
//  - Only 3 preflight samples per person -> baseline confidence is LOW.
//  - Results are deviations from a personal baseline, NOT diagnoses.

import fs from 'node:fs';
import path from 'node:path';
import { analyzeSeries } from './anomalyDetector.js';

const INPUT = 'src/data/nasa/raw/LSDS-8_Multiplex_serum.cardiovascular.EvePanel_SUBMITTED.csv';
const OUTPUT = 'src/data/nasa/osd575_cardio_analysis.json';

// Configurable demonstration rules
const USE_LOG10 = true;          // biomarkers span orders of magnitude, so compare on a log10 scale
const REPEAT_MIN = 3;            // one exact value repeated this many times in an analyte = suspicious
const LOG_MIN_SPREAD = 0.05;     // minimum baseline spread on the log10 scale (about 12%)

const BASELINE_POINTS = ['L-92', 'L-44', 'L-3'];
const OBSERVATION_POINTS = ['R+1', 'R+45', 'R+82', 'R+194'];

// Small CSV parser (handles quotes, BOM and Windows line endings). No libraries needed.
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', inQuotes = false;
  text = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { row.push(field); field = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field); field = '';
      if (row.some((x) => x !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  const [header, ...body] = rows;
  return body.map((r) => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}

const toNumber = (s) => {
  const n = Number(s);
  return s !== '' && Number.isFinite(n) ? n : null; // missing stays null, never 0
};

const text = fs.readFileSync(INPUT, 'utf8');
const rows = parseCsv(text);

// Validate: every analyte must have exactly ONE unit (never mix units).
const unitsByAnalyte = {};
for (const r of rows) {
  (unitsByAnalyte[r.Analyte] ??= new Set()).add(r.Unit);
}
for (const [analyte, units] of Object.entries(unitsByAnalyte)) {
  if (units.size !== 1) throw new Error(`Mixed units for ${analyte}: ${[...units].join(', ')}`);
}

// Detect suspicious repeated values: real continuous measurements almost never repeat to
// the last digit. If one exact value repeats many times in an analyte, it may be a limit of
// the assay or a processing artifact. We do NOT know the cause, so such values are treated as
// possibly censored: excluded from the analysis and flagged. The original data is untouched.
const repeatedByAnalyte = {};
for (const analyte of Object.keys(unitsByAnalyte)) {
  const counts = new Map();
  for (const r of rows.filter((x) => x.Analyte === analyte)) {
    const v = toNumber(r.Concentration);
    if (v !== null) counts.set(v, (counts.get(v) || 0) + 1);
  }
  const [value, n] = [...counts.entries()].sort((x, y) => y[1] - x[1])[0] ?? [null, 0];
  if (n >= REPEAT_MIN) repeatedByAnalyte[analyte] = { value, times: n };
}

const analytes = Object.keys(unitsByAnalyte);
const subjects = [...new Set(rows.map((r) => r.ID))].sort();
const results = [];

for (const analyte of analytes) {
  const unit = [...unitsByAnalyte[analyte]][0];
  for (const subject of subjects) {
    const originalValues = {};
    const censoredAt = [];
    const valueAt = (tp) => {
      const hit = rows.find((r) => r.Analyte === analyte && r.ID === subject && r.Timepoint === tp);
      const raw = hit ? toNumber(hit.Concentration) : null;
      originalValues[tp] = raw;                       // original data is always preserved
      if (raw === null) return null;
      if (raw === repeatedByAnalyte[analyte]?.value) { censoredAt.push(tp); return null; } // censored: excluded
      if (!USE_LOG10) return raw;
      return raw > 0 ? Math.log10(raw) : null;        // log10 needs a positive value
    };
    const analysis = analyzeSeries({
      baselineConfig: USE_LOG10 ? { minScaleFraction: 0, minScaleAbsolute: LOG_MIN_SPREAD } : {},
      baselineValues: BASELINE_POINTS.map(valueAt),
      observations: OBSERVATION_POINTS.map((tp) => ({ label: tp, value: valueAt(tp) })),
      meta: {
        signal: analyte, unit: USE_LOG10 ? `log10(${unit})` : unit, direction: 'both',
        sourceLabel: 'NASA_RESEARCH', datasetId: 'OSD-575',
      },
    });
    if (censoredAt.length > 0) {
      analysis.contributingFactors.push(
        `Values at ${censoredAt.join(', ')} equal a value repeated ${repeatedByAnalyte[analyte].times} times in this analyte (${repeatedByAnalyte[analyte].value} ${unit}); cause unverified, treated as possibly censored and excluded.`
      );
    }
    results.push({
      subject_id: subject,
      transform: USE_LOG10 ? 'log10' : 'none',
      original_unit: unit,
      original_values: originalValues,
      censored_timepoints: censoredAt,
      ...analysis,
    });
  }
}

const output = {
  dataset_id: 'OSD-575',
  panel: 'Eve Technologies cardiovascular panel (HDCVD9), serum',
  notes: [
    'Research blood biomarkers, not heart rate or HRV.',
    'Baseline = 3 preflight samples per astronaut (L-92, L-44, L-3): confidence is LOW.',
    'Deviations from a personal baseline are not diagnoses.',
    USE_LOG10 ? 'Values were compared on a log10 scale; original values are preserved in original_values.' : 'No transform applied.',
    `Suspicious repeated values excluded (cause unverified): ${JSON.stringify(repeatedByAnalyte)}`,
    'Thresholds are configurable demonstration rules, not clinical limits.',
  ],
  baseline_timepoints: BASELINE_POINTS,
  observation_timepoints: OBSERVATION_POINTS,
  results,
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2));

// Console summary
console.log(`OSD-575 cardiovascular panel: ${analytes.length} analytes x ${subjects.length} astronauts = ${results.length} series\n`);
console.log('subject  analyte             status      latest     z (latest)');
for (const r of results) {
  const z = r.latest?.z != null ? r.latest.z.toFixed(2) : '-';
  console.log(`${r.subject_id.padEnd(8)} ${r.signal.padEnd(19)} ${r.status.padEnd(11)} ${(r.latest?.label ?? '-').padEnd(10)} ${z}`);
}
const counts = results.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
console.log('\nStatus counts:', counts);
console.log(`Saved ${OUTPUT}`);