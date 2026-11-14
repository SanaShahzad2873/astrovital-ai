// src/engine/riskFusion.js
// Step 3: combine the four health domains into one overall picture.
//
// INPUT  (the "data contract" for teammates): each domain is an ARRAY of analyzeSeries() results.
//   fuseRisk({
//     cardiovascular:  [analyzeSeries(...), ...],
//     sleep:           [analyzeSeries(...), ...],
//     radiation:       [analyzeSeries(...), ...],   // may be missing
//     musculoskeletal: [analyzeSeries(...), ...],   // may be missing
//   })
//
// RULES
//  - A domain with no usable data is 'unknown'. Missing data is NEVER treated as healthy.
//  - If some domains are unknown but the rest are normal, overall status is 'incomplete', not 'normal'.
//  - Scores are demonstration rules, not clinical risk scores.

export const DOMAINS = ['cardiovascular', 'sleep', 'radiation', 'musculoskeletal'];

const SEVERITY = { normal: 0, attention: 0.5, high: 1 };
const CONF_RANK = { none: 0, low: 1, moderate: 2, high: 3 };
const CONF_LABEL = ['none', 'low', 'moderate', 'high'];

// Demo rule: score leans on the worst signal (60%) and the average (40%).
const blend = (values) => {
  const max = Math.max(...values);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  return 0.6 * max + 0.4 * mean;
};

const statusFromScore = (severityMax) =>
  severityMax >= 1 ? 'high' : severityMax >= 0.5 ? 'attention' : 'normal';

export function fuseDomain(name, series) {
  const list = Array.isArray(series) ? series : [];
  const known = list.filter((s) => s && s.status in SEVERITY);
  const unknownCount = list.length - known.length;

  if (known.length === 0) {
    return {
      domain: name, status: 'unknown', score: null, confidence: 'none',
      contributingFactors: [list.length === 0 ? 'No data available for this domain.' : 'No usable measurements in this domain.'],
      dataQuality: { series: list.length, usable: 0, unknown: unknownCount },
      sources: [],
    };
  }

  const severities = known.map((s) => SEVERITY[s.status]);
  const score = Math.round(100 * blend(severities));
  const status = statusFromScore(Math.max(...severities));

  // Domain confidence = average of the series' confidences, rounded down.
  const meanRank = known.reduce((a, s) => a + (CONF_RANK[s.confidence] ?? 0), 0) / known.length;
  const confidence = CONF_LABEL[Math.floor(meanRank)];

  const factors = known
    .filter((s) => s.status !== 'normal')
    .sort((a, b) => SEVERITY[b.status] - SEVERITY[a.status])
    .slice(0, 5)
    .map((s) => `${s.signal} (${s.status}): ${s.contributingFactors?.[0] ?? 'deviates from personal baseline'}`);
  if (unknownCount > 0) factors.push(`${unknownCount} of ${list.length} signals had no usable baseline or data and are not included.`);
  if (factors.length === 0) factors.push('All usable signals are within this person\'s own baseline range.');

  return {
    domain: name, status, score, confidence,
    contributingFactors: factors,
    dataQuality: { series: list.length, usable: known.length, unknown: unknownCount },
    sources: [...new Set(known.map((s) => s.sourceLabel).filter(Boolean))],
  };
}

export function fuseRisk(input = {}, options = {}) {
  const domains = DOMAINS.map((d) => fuseDomain(d, input[d]));
  const known = domains.filter((d) => d.status !== 'unknown');
  const missing = domains.filter((d) => d.status === 'unknown').map((d) => d.domain);
  const timestamp = (options.now ?? new Date()).toISOString();

  const base = {
    timestamp,
    domains,
    domainsMissing: missing,
    dataCompleteness: known.length === 0 ? 'none' : missing.length === 0 ? 'complete' : 'partial',
    thresholdsNote: 'Prototype demonstration rules, configurable; not clinical thresholds. Decision support only, not a diagnosis.',
  };

  if (known.length === 0) {
    return { ...base, status: 'unknown', score: null, confidence: 'none',
      contributingFactors: ['No domain has usable data, so no overall status can be given.'], sources: [] };
  }

  const score = Math.round(blend(known.map((d) => d.score / 100)) * 100);
  const worst = known.reduce((w, d) => (SEVERITY[d.status] > SEVERITY[w] ? d.status : w), 'normal');
  const status = worst === 'normal' && missing.length > 0 ? 'incomplete' : worst;

  let confRank = Math.min(...known.map((d) => CONF_RANK[d.confidence]));
  if (missing.length > 0) confRank = Math.min(confRank, CONF_RANK.low); // partial coverage caps confidence
  const confidence = CONF_LABEL[confRank];

  const factors = known
    .filter((d) => d.status !== 'normal')
    .sort((a, b) => b.score - a.score)
    .map((d) => `${d.domain} is ${d.status} (score ${d.score}): ${d.contributingFactors[0]}`);
  if (missing.length > 0) factors.push(`No usable data for: ${missing.join(', ')}. Overall status covers only the domains with data.`);
  if (factors.length === 0) factors.push('All domains with data are within this person\'s own baseline range.');

  return {
    ...base, status, score, confidence, contributingFactors: factors,
    sources: [...new Set(known.flatMap((d) => d.sources))],
  };
}