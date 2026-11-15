import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
// Same engine + adapter the frontend uses, so the API and the UI can never disagree.
import { getEngineState } from '../../../client/src/services/engineAdapter.js';

const here = dirname(fileURLToPath(import.meta.url));
let osd575 = null;
const loadOsd575 = () =>
  (osd575 ??= JSON.parse(readFileSync(join(here, '../data/osd575_cardio_analysis.json'), 'utf8')));

// GET /api/astronaut/state  -> the exact shape the React screens read
export const astronautState = (req, res) => res.json(getEngineState());

// GET /api/nasa/osd575  -> real NASA OSD-575 analysis (optional ?subject=C001)
export function nasaOsd575(req, res) {
  const d = loadOsd575();
  const { subject } = req.query;
  res.json(subject ? { ...d, results: d.results.filter((r) => r.subject_id === subject) } : d);
}
