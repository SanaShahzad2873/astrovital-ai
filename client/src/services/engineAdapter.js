// Converts Member 4's analyse() output into the shape the screens already use (same as mockData.js).
// Nothing here invents health values: scores, statuses, factors and sources all come from the engine.
import { analyse, simulateDemo, SIGNALS } from '../engine/index.js'

// DEMO settings (not real mission data). Change scenario to: normal | sleep | cardio | radiation | fitness | multi
export const DEMO = { scenario: 'multi', days: 45, seed: 7, driftStart: 30, strength: 2 }
export const MISSION_TOTAL_DAYS = 60 // demo value

const ENGINE_TO_UI = {
  cardio: 'cardiovascular',
  sleep: 'sleepCognitive',
  radiation: 'radiation',
  fitness: 'musculoskeletal',
}
const UI_KEYS = Object.values(ENGINE_TO_UI)
const LABEL = {
  cardiovascular: 'Cardiovascular',
  sleepCognitive: 'Brain & Sleep',
  radiation: 'Radiation',
  musculoskeletal: 'Muscle & Bone',
}
// The UI uses the key "risk" for high risk (see config/status.js)
const STATUS = { optimal: 'optimal', attention: 'attention', high: 'risk', unknown: 'unknown' }

const uiStatus = (key, s) =>
  key === 'sleepCognitive' && s === 'attention' ? 'fatigue' : (STATUS[s] ?? 'unknown') // purple = fatigue

const sourceOf = (sources = []) =>
  sources.length === 0 || sources.includes('SIMULATED_DEMO') ? 'SIMULATED_DEMO' : sources[0]

const r1 = (n) => Math.round(n * 10) / 10

// Display bucket only. The engine gives a 0-1 confidence number.
const quality = (d) => (d.status === 'unknown' ? 'none' : d.confidence >= 0.7 ? 'good' : 'limited')

// 0.5 SD is the same cut-off the engine itself uses to pick alert evidence.
const factorDetail = (c) =>
  `your normal ${c.normal} ${c.unit}, last 7 days ${c.recent} ${c.unit} (` +
  (c.zWorse > 0.5 ? `${c.zWorse} SD worse)` : 'close to your normal)')

function buildMetrics(engineKey, dom, records) {
  return Object.entries(SIGNALS)
    .filter(([, s]) => s.domain === engineKey)
    .map(([sig, s]) => {
      const rows = records
        .filter((r) => r.signal === sig && (!r.quality || r.quality === 'ok'))
        .sort((a, b) => (a.timestamp < b.timestamp ? -1 : 1))
      if (rows.length === 0) {
        return {
          key: sig, label: s.label, value: null, unit: s.unit, status: 'unknown',
          source: 'SIMULATED_DEMO', quality: 'none', collectedAt: null, history: [],
          note: 'no source connected',
        }
      }
      const last = rows[rows.length - 1]
      const c = dom.contributing.find((x) => x.signal === sig)
      return {
        key: sig,
        label: s.label,
        value: r1(last.value),
        unit: last.unit,
        status: !c ? 'unknown' : c.zWorse > 0.5 ? 'attention' : 'optimal',
        source: last.sourceLabel,
        quality: quality(dom),
        collectedAt: last.timestamp,
        history: rows.map((r, i) => ({ day: i + 1, value: r1(r.value) })),
      }
    })
}

function toDomain(uiKey, engineKey, d, history, records) {
  const known = d.status !== 'unknown'
  return {
    status: uiStatus(uiKey, d.status),
    riskScore: d.riskScore,
    confidence: d.confidence,
    dataQuality: quality(d),
    source: sourceOf(d.sources),
    lastUpdated: d.lastDate ? `${d.lastDate}T12:00:00.000Z` : null,
    history,
    // unknown domains show the engine's own note (e.g. "Learning your normal: 4 of 10 days needed")
    contributingFactors: known
      ? d.contributing.slice(0, 3).map((c) => ({ label: c.label, detail: factorDetail(c) }))
      : (d.notes ?? []).map((n) => ({ label: LABEL[uiKey], detail: n })),
    metrics: buildMetrics(engineKey, d, records),
    cumulativeDoseMsv: d.cumulativeDoseMsv ?? null,
  }
}

let cache = null

export function getEngineState() {
  if (cache) return cache

  const records = simulateDemo(DEMO)
  const stamps = [...new Set(records.map((r) => r.timestamp))].sort()
  const now = stamps[stamps.length - 1]
  const a = analyse({ records, now })

  // Score history: run the same engine for each mission day up to today.
  const overallHist = []
  const domHist = Object.fromEntries(UI_KEYS.map((k) => [k, []]))
  stamps.forEach((t, i) => {
    const x = analyse({ records: records.filter((r) => r.timestamp <= t), now: t })
    if (x.overall.riskScore != null) overallHist.push({ day: i + 1, value: x.overall.riskScore })
    for (const [ek, uk] of Object.entries(ENGINE_TO_UI)) {
      if (x.domains[ek].riskScore != null) domHist[uk].push({ day: i + 1, value: x.domains[ek].riskScore })
    }
  })

  const domains = {}
  for (const [ek, uk] of Object.entries(ENGINE_TO_UI)) {
    domains[uk] = toDomain(uk, ek, a.domains[ek], domHist[uk], records)
  }

  const bodyRegions = {}
  for (const [name, r] of Object.entries(a.twin.regions)) {
    const uk = ENGINE_TO_UI[r.domain]
    let state = STATUS[r.status] ?? 'unknown'
    if (r.accent === 'fatigue' && r.status === 'attention') state = 'fatigue'
    bodyRegions[name] = {
      status: state,
      domain: uk,
      summary:
        domains[uk].contributingFactors.map((f) => `${f.label}: ${f.detail}`).join(' ') ||
        'No data available for this domain.',
    }
  }

  const alerts = a.alerts
    .map((al) => {
      const uk = ENGINE_TO_UI[al.domain]
      return {
        id: al.id,
        domain: uk,
        severity: STATUS[al.severity] ?? 'attention',
        title: `${LABEL[uk]}: indicators moved away from your personal normal`,
        message: al.explanation,
        nextStep: al.nextStep,
        disclaimer: al.disclaimer,
        timestamp: al.timestamp,
        source: sourceOf(al.sourceLabels),
        contributingFactors: al.evidence.map((c) => ({ label: c.label, detail: factorDetail(c) })),
      }
    })
    .sort((x, y) => (y.severity === 'risk') - (x.severity === 'risk'))

  const allSources = Object.values(a.domains).flatMap((d) => d.sources ?? [])

  cache = {
    astronautId: 'A-01',
    missionDay: stamps.length,
    missionTotalDays: MISSION_TOTAL_DAYS,
    generatedAt: now,
    overall: {
      status: STATUS[a.overall.status] ?? 'unknown',
      riskScore: a.overall.riskScore,
      confidence: a.overall.confidence,
      source: sourceOf(allSources),
      summary: 'Prototype demonstration rules against your own baseline. Not a diagnosis.',
      history: overallHist,
    },
    domains,
    bodyRegions,
    radiationOverlay: {
      active: ['attention', 'high'].includes(a.domains.radiation.status),
      status: STATUS[a.domains.radiation.status] ?? 'unknown',
    },
    twinState: a.twin.state,
    alerts,
    dataQualityWarnings: a.dataQualityWarnings,
  }
  return cache
}