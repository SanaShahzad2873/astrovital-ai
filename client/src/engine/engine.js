import { SIGNALS, DOMAINS, DOSE_TO_MSV, CONFIG, validateRecord } from './contract.js';
import { median, mad, zWorse, mean, clamp } from './stats.js';
const day = (t) => new Date(t).toISOString().slice(0, 10);
const daysBetween = (a, b) => (Date.parse(b) - Date.parse(a)) / 864e5;
const R1 = (x) => Math.round(x * 10) / 10;

/** Step 1: clean + normalise records, collect warnings. */
function prepare(records) {
  const warnings = [], good = [];
  for (const r of records) {
    const errs = validateRecord(r);
    if (errs.length) { warnings.push({ type: 'invalid_record', detail: errs.join('; '), signal: r?.signal }); continue; }
    if (r.quality && r.quality !== 'ok') { warnings.push({ type: `data_${r.quality}`, detail: `${r.signal} on ${day(r.timestamp)}`, signal: r.signal }); continue; }
    good.push(r.signal === 'dose' ? { ...r, value: r.value * DOSE_TO_MSV[r.unit], unit: 'mSv' } : r);
  }
  // Environmental and personal-dosimeter radiation must not be mixed: keep the larger group.
  const kinds = {};
  good.filter((r) => r.signal === 'dose').forEach((r) => { const k = r.meta?.kind || 'unspecified'; kinds[k] = (kinds[k] || 0) + 1; });
  const ks = Object.keys(kinds);
  let keep = null;
  if (ks.length > 1) { keep = ks.sort((a, b) => kinds[b] - kinds[a])[0]; warnings.push({ type: 'radiation_kind_mixed', detail: `Mixed radiation record kinds ${ks.join(', ')}; only "${keep}" is used.` }); }
  return { records: good.filter((r) => r.signal !== 'dose' || !keep || (r.meta?.kind || 'unspecified') === keep), warnings };
}
/** Step 2: one value per signal per day (median of that day). */
function dailySeries(records) {
  const by = {};
  for (const r of records) { (((by[r.signal] ??= {})[day(r.timestamp)]) ??= []).push(r); }
  const out = {};
  for (const s in by) out[s] = Object.keys(by[s]).sort().map((d) => ({ date: d, value: median(by[s][d].map((x) => x.value)), sources: [...new Set(by[s][d].map((x) => x.sourceLabel))] }));
  return out;
}
/** Step 3: score one domain. Returns status 'unknown' (never 'optimal') when there is not enough fresh data. */
function scoreDomain(domain, series, nowDate, cfg) {
  const sigs = Object.keys(SIGNALS).filter((s) => SIGNALS[s].domain === domain && series[s]?.length);
  const base = { domain, status: 'unknown', riskScore: null, confidence: 0, contributing: [], sources: [], baselineObs: 0, lastDate: null, notes: [] };
  if (!sigs.length) return { ...base, notes: ['No data for this domain.'] };
  const lastDate = sigs.map((s) => series[s].at(-1).date).sort().at(-1);
  const n = Math.min(...sigs.map((s) => series[s].length));
  const sources = [...new Set(sigs.flatMap((s) => series[s].flatMap((p) => p.sources)))];
  Object.assign(base, { lastDate, sources, baselineObs: n });
  if (daysBetween(lastDate, nowDate) > cfg.staleDays) return { ...base, notes: [`Latest data is from ${lastDate}: stale, not treated as current.`] };
  if (n < cfg.minBaselineObs + 3) return { ...base, notes: [`Learning your normal: ${n} of ${cfg.minBaselineObs + 3} days needed.`] };
  const stat = {}; let wsum2 = 0;
  for (const s of sigs) {
    const v = series[s].map((p) => p.value), b = v.slice(0, cfg.baselineDays), med = median(b), m = mad(b);
    stat[s] = { med, m, z: v.map((x) => zWorse(x, med, m, SIGNALS[s].worse)), v, dates: series[s].map((p) => p.date) };
    wsum2 += SIGNALS[s].w ** 2;
  }
  const norm = Math.sqrt(wsum2), len = Math.min(...sigs.map((s) => stat[s].z.length));
  let c = 0; const fused = [];
  for (let i = 0; i < len; i++) {
    const f = sigs.reduce((a, s) => a + SIGNALS[s].w * stat[s].z[stat[s].z.length - len + i], 0) / norm;
    fused.push(f); if (i >= cfg.baselineDays) c = Math.max(0, c + f - cfg.cusumK);
  }
  const f7 = mean(fused.slice(-cfg.recentWindow));
  const risk = Math.round(100 * Math.max(clamp(f7 / 3, 0, 1), clamp(c / (2 * cfg.cusumH), 0, 1)));
  const status = risk >= cfg.highRisk ? 'high' : risk >= cfg.attentionRisk ? 'attention' : 'optimal';
  const contributing = sigs.map((s) => {
    const k = Math.min(cfg.recentWindow, stat[s].v.length), recent = mean(stat[s].v.slice(-k)), zr = mean(stat[s].z.slice(-k));
    return { signal: s, label: SIGNALS[s].label, unit: SIGNALS[s].unit, normal: R1(stat[s].med), recent: R1(recent), zWorse: R1(zr) };
  }).sort((a, b) => b.zWorse - a.zWorse);
  const confidence = R1(clamp(n / (cfg.baselineDays * 2), 0.2, 1) * 100) / 100;
  const notes = sources.every((x) => x === 'SIMULATED_DEMO') ? ['All values in this domain are SIMULATED_DEMO.'] : [];
  return { ...base, status, riskScore: risk, confidence, contributing, notes, cusum: R1(c) };
}
const WORST = { unknown: -1, optimal: 0, attention: 1, high: 2 };
const NEXT = {
  attention: 'Log a check-in tomorrow, review rest and workload, and watch whether the change continues.',
  high: 'Repeat the assessment, follow the mission medical protocol, and contact mission medical as soon as communication allows.',
};
/** The main function. Everyone calls this: analyse({ records, now }) */
export function analyse({ records, now = new Date().toISOString(), config = {} }) {
  const cfg = { ...CONFIG, ...config }, nowDate = day(now), { records: ok, warnings } = prepare(records), series = dailySeries(ok);
  const domains = Object.fromEntries(DOMAINS.map((d) => [d, scoreDomain(d, series, nowDate, cfg)]));
  for (const d of DOMAINS) if (domains[d].status === 'unknown') warnings.push({ type: 'domain_unknown', detail: `${d}: ${domains[d].notes[0]}`, domain: d });
  if (series.dose) {
    const cum = series.dose.reduce((s, p) => s + p.value, 0);
    domains.radiation.cumulativeDoseMsv = Math.round(cum * 1000) / 1000;
    domains.radiation.notes.push('Cumulative dose sums only compatible units (mSv, uSv).');
  }
  const known = DOMAINS.filter((d) => domains[d].status !== 'unknown');
  const overall = known.length
    ? { status: known.map((d) => domains[d].status).sort((a, b) => WORST[b] - WORST[a])[0], riskScore: Math.max(...known.map((d) => domains[d].riskScore)), confidence: Math.round(100 * mean(known.map((d) => domains[d].confidence))) / 100, unknownDomains: DOMAINS.filter((d) => !known.includes(d)) }
    : { status: 'unknown', riskScore: null, confidence: 0, unknownDomains: [...DOMAINS] };
  const st = (d) => domains[d].status;
  const region = (domain, accent) => ({ status: st(domain), domain, accent: st(domain) === 'optimal' || st(domain) === 'unknown' ? null : accent });
  const twin = { regions: { head: region('sleep', 'fatigue'), chest: region('cardio', null), abdomen: region('radiation', 'radiation'),
    leftArm: region('fitness', null), rightArm: region('fitness', null), leftLeg: region('fitness', null), rightLeg: region('fitness', null) } };
  // Twin state for the 2D astronaut: the non-optimal domain with the highest risk wins. Transparent rule, documented limitation: one state at a time.
  const live = DOMAINS.filter((d) => ['attention', 'high'].includes(st(d))).sort((a, b) => domains[b].riskScore - domains[a].riskScore);
  const lead = live[0], topSleep = domains.sleep.contributing?.[0]?.signal;
  twin.state = overall.status === 'unknown' ? 'UNKNOWN' : !lead ? 'OPTIMAL'
    : lead === 'radiation' ? 'RADIATION_ALERT' : lead === 'fitness' ? 'DECONDITIONING_RISK'
    : lead === 'cardio' ? 'HIGH_STRESS' : topSleep === 'stress' ? 'HIGH_STRESS' : 'FATIGUED';
  twin.stateDomain = lead || null;
  const alerts = DOMAINS.filter((d) => ['attention', 'high'].includes(st(d))).map((d) => {
    const top = domains[d].contributing.filter((c) => c.zWorse > 0.5).slice(0, 3);
    return { id: `${d}-${domains[d].lastDate}`, domain: d, severity: st(d), timestamp: now, title: `${d} indicators moved away from your personal normal`,
      explanation: top.map((c) => `${c.label}: your normal ${c.normal} ${c.unit}, last 7 days ${c.recent} ${c.unit} (${c.zWorse} SD worse)`).join('; '),
      nextStep: NEXT[st(d)], evidence: top, sourceLabels: domains[d].sources, prototypeRule: true, disclaimer: 'Prototype statistic against your own baseline, not a clinically validated threshold. Not a diagnosis.' };
  });
  return { timestamp: now, overall, domains, twin, alerts, dataQualityWarnings: warnings };
}
