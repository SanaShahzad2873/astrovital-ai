// Demo data. Every record is labelled SIMULATED_DEMO. The numbers are arbitrary demo values, not real flight data.
const BASE = { restingHr: [62, 2.5, 'bpm'], hrv: [60, 6, 'ms'], sleepHours: [7, 0.6, 'h'], mood: [7, 0.9, 'score'], stress: [3, 0.8, 'score'], fatigue: [3, 0.8, 'score'], reactionMs: [260, 15, 'ms'], dose: [400, 30, 'uSv'], exerciseMin: [60, 8, 'min'] };
const WORSE = { restingHr: 1, hrv: -1, sleepHours: -1, mood: -1, stress: 1, fatigue: 1, reactionMs: 1, dose: 1, exerciseMin: -1 };
const SCN = { normal: [], sleep: ['sleepHours', 'mood', 'fatigue', 'reactionMs'], cardio: ['restingHr', 'hrv'], radiation: ['dose'], fitness: ['exerciseMin'], multi: Object.keys(BASE) };
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
export function simulateDemo({ astronautId = 'AST-DEMO-01', days = 60, scenario = 'multi', seed = 7, start = '2026-09-01', driftStart = 30, strength = 2 } = {}) {
  const r = rng(seed), g = () => Math.sqrt(-2 * Math.log(1 - r())) * Math.cos(2 * Math.PI * r()), out = [], drift = new Set(SCN[scenario] || []);
  for (let i = 0; i < days; i++) {
    const ts = new Date(Date.parse(start) + i * 864e5 + 12 * 36e5).toISOString(), t = Math.max(0, i - driftStart);
    for (const [signal, [mu, sd, unit]] of Object.entries(BASE)) {
      const v = mu + sd * g() + (drift.has(signal) ? WORSE[signal] * sd * 0.04 * strength * t : 0);
      out.push({ astronautId, timestamp: ts, signal, value: Math.round(v * 100) / 100, unit, sourceLabel: 'SIMULATED_DEMO', quality: 'ok', meta: signal === 'dose' ? { kind: 'personal' } : undefined });
    }
  }
  return out;
}
