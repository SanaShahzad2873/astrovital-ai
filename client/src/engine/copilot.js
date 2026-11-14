// Rule-based Copilot: works with no internet and no AI key. Only explains what analyse() produced.
const DIS = ' (Prototype decision support, not a diagnosis. Contact mission medical when possible.)';
export function answer(question, a) {
  const q = (question || '').toLowerCase();
  if (a.overall.status === 'unknown') return 'I do not have enough current data to judge any domain yet. Missing data is not the same as good health. Please log a check-in.' + DIS;
  const al = a.alerts;
  if (/why|alert|warn/.test(q)) return al.length ? al.map((x) => `${x.domain} (${x.severity}): ${x.explanation}.`).join(' ') + ' These are changes from YOUR own baseline.' + DIS : 'No alerts now: your tracked signals are close to your personal baseline.' + DIS;
  if (/what changed|contribut|factor/.test(q)) return Object.values(a.domains).filter((d) => d.contributing?.length).map((d) => `${d.domain}: ` + d.contributing.slice(0, 2).map((c) => `${c.label} ${c.normal} to ${c.recent} ${c.unit}`).join(', ')).join('. ') + '.' + DIS;
  if (/data|source|limit|real|simulat/.test(q)) return `Sources used: ${[...new Set(Object.values(a.domains).flatMap((d) => d.sources))].join(', ') || 'none'}. ` + (a.dataQualityWarnings.length ? `${a.dataQualityWarnings.length} data-quality warning(s) exist. ` : '') + 'NASA research datasets give context only; they are not your personal readings.' + DIS;
  if (/blackout|offline|no contact/.test(q)) return 'In blackout mode I use only locally saved data and log your check-ins and actions so they can be sent when contact returns. Nothing live is updating.' + DIS;
  if (/do|next|should|help/.test(q)) return al.length ? al.map((x) => `${x.domain}: ${x.nextStep}`).join(' ') + DIS : 'Keep logging daily check-ins and continue your routine.' + DIS;
  return 'You can ask: why is there an alert, what changed, what should I do, what are the data sources, or what happens in blackout mode.' + DIS;
}
