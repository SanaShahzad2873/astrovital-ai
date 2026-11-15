// Pure logic for the 1-minute reaction test (no React here, so it is easy to test).
// NOT a clinical neurological examination. Independent of the health engine: it only produces a summary and an observation. "Slow" is a configurable DEMO setting, not a medical threshold.
export const DEFAULTS = { durationMs: 60000, minDelayMs: 800, maxDelayMs: 3000, lapseMs: 2000, slowMs: 500 };
const med = (a) => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
export const nextDelay = (rand = Math.random, c = DEFAULTS) => Math.round(c.minDelayMs + rand() * (c.maxDelayMs - c.minDelayMs));
/** times: array of reaction times in ms. Returns the session summary. */
export function summarise({ times = [], falseStarts = 0, lapses = 0, startedAt = new Date().toISOString() } = {}, c = DEFAULTS) {
  const n = times.length, ok = n > 0;
  return { startedAt, trials: n, falseStarts, lapses, slowCount: times.filter((t) => t > c.slowMs).length, slowThresholdMs: c.slowMs,
    meanMs: ok ? Math.round(times.reduce((a, b) => a + b, 0) / n) : null, medianMs: ok ? Math.round(med(times)) : null,
    fastestMs: ok ? Math.round(Math.min(...times)) : null, slowestMs: ok ? Math.round(Math.max(...times)) : null,
    enoughData: n >= 5, note: 'Reaction-time test for wellness tracking. Not a clinical neurological examination.' };
}
/** Turn a session summary into one plain "observation" that the app can save and later feed to the engine.
 *  The session MEDIAN is used because it resists one slow tap. Returns null when fewer than 5 valid taps (unreliable, do not save). */
export function toObservation(summary, astronautId = 'AST-01') {
  if (!summary.enoughData) return null;
  return { astronautId, timestamp: summary.startedAt, signal: 'reaction_time', value: summary.medianMs, unit: 'ms', sourceLabel: 'MEASURED',
    meta: { trials: summary.trials, slowCount: summary.slowCount, falseStarts: summary.falseStarts, lapses: summary.lapses } };
}
/** Compare this session with earlier sessions (array of summaries, oldest first). */
export function compareToHistory(summary, history = []) {
  const past = history.filter((h) => h.medianMs != null).map((h) => h.medianMs);
  if (!summary.enoughData) return { ready: false, text: 'Not enough valid responses in this session to compare.' };
  if (past.length < 2) return { ready: false, text: `Sessions saved so far: ${past.length}. Comparison starts after 2 earlier sessions.` };
  const base = med(past), diff = summary.medianMs - base, pct = Math.round((100 * diff) / base);
  return { ready: true, baselineMedianMs: Math.round(base), diffMs: Math.round(diff), pct,
    text: `Your median today is ${summary.medianMs} ms; your earlier sessions' median is ${Math.round(base)} ms (${diff >= 0 ? '+' : ''}${Math.round(diff)} ms, ${pct >= 0 ? '+' : ''}${pct}%).` };
}
