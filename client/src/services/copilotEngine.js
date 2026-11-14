// Rule-based Copilot. No LLM. Answers are built ONLY from the state object
// (alerts, domains, contributingFactors). It never invents explanations.

const DOMAIN_LABEL = {
  cardiovascular: 'Cardiovascular',
  sleepCognitive: 'Brain & Sleep',
  radiation: 'Radiation',
  musculoskeletal: 'Muscle & Bone',
}

const STATUS_WORD = {
  optimal: 'Optimal',
  attention: 'Attention',
  fatigue: 'Fatigue',
  risk: 'High Risk',
  unknown: 'No data',
}

const has = (q, words) => words.some((w) => q.includes(w))

const confText = (c) =>
  typeof c === 'number' ? `${Math.round(c * 100)}%` : String(c ?? 'unknown')

function describeDomain(key, d) {
  const label = DOMAIN_LABEL[key]
  if (!d || d.status === 'unknown' || d.riskScore == null) {
    const notes = (d?.contributingFactors ?? []).map((f) => f.detail)
    return {
      text: `${label}: there is not enough data yet, so no status can be given. Missing data does not mean healthy.`,
      bullets: notes,
      source: d?.source,
    }
  }
  const bullets = (d.contributingFactors ?? []).map((f) => `${f.label}: ${f.detail}`)
  const text = `${label} is "${STATUS_WORD[d.status] ?? d.status}" with a score of ${d.riskScore}/100 (confidence ${confText(d.confidence)}, data quality ${d.dataQuality}).`

  if (key === 'cardiovascular') {
    if (d.source === 'SIMULATED_DEMO') {
      bullets.push('Resting heart rate and HRV here are SIMULATED_DEMO values. No real measurement source is connected yet.')
    }
    bullets.push('NASA OSD-575 gives blood research biomarkers as context only. It does not contain continuous heart-rate readings.')
  }
  if (key === 'radiation' && d.cumulativeDoseMsv != null) {
    bullets.push(`Cumulative dose in the demo data: ${d.cumulativeDoseMsv} mSv (only compatible units are summed).`)
  }
  return { text, bullets, source: d.source }
}

function explainAlerts(state) {
  const alerts = state.alerts ?? []
  if (alerts.length === 0) {
    return { text: 'There are no active alerts right now.', bullets: [] }
  }
  const bullets = alerts.map((a) => {
    const why = (a.contributingFactors ?? []).map((f) => `${f.label} (${f.detail})`).join('; ')
    return `${a.title}: ${a.message}${why ? ` Contributing: ${why}.` : ''}`
  })
  return {
    text: `There are ${alerts.length} active alerts. Each one comes from a configurable demonstration rule against your own baseline, not a clinical limit:`,
    bullets,
    source: alerts[0].source,
  }
}

export const SUGGESTIONS = [
  'Why is there an alert?',
  'What should I do?',
  'How is my sleep?',
  'What about radiation?',
  'How is my heart data?',
  'What is the data quality?',
  'What should I do offline?',
]

export function answerQuestion(question, state, online = true) {
  const q = question.toLowerCase()

  if (has(q, ['diagnos', 'treat', 'prescri', 'medicine', 'medication', 'cure', 'disease'])) {
    return {
      text: 'I cannot diagnose conditions or give treatment instructions. I only explain the monitoring data on this screen. If you feel unwell, follow your mission\'s approved procedures and contact the flight surgeon or a crew member.',
      bullets: [],
    }
  }

  if (has(q, ['blackout', 'offline', 'no connection', 'communication'])) {
    return {
      text: online
        ? 'The link is active now. In a blackout the app keeps working from locally stored data:'
        : 'No connection detected. Working from locally stored data:',
      bullets: [
        'Open Blackout Mode to see the last saved record and its timestamp. It does not update while offline.',
        'Log check-ins and events there. They stay on this device.',
        'Queue a summary report. It will be ready to send when the Earth link returns.',
        'Follow your mission\'s approved emergency procedures. This app is not a medical protocol.',
      ],
    }
  }

  if (has(q, ['quality', 'limit', 'trust', 'reliable', 'accurate', 'source', 'real'])) {
    const lines = Object.entries(state.domains ?? {}).map(
      ([k, d]) => `${DOMAIN_LABEL[k]}: data quality ${d.dataQuality}, confidence ${confText(d.confidence)}, source ${d.source}`,
    )
    return {
      text: 'Every value is labelled with its source. This build is a decision-support prototype, not a medical diagnostic system:',
      bullets: lines,
      source: state.overall?.source,
    }
  }

  if (has(q, ['sleep', 'fatigue', 'tired', 'cognitive', 'brain', 'stress', 'mood'])) {
    return describeDomain('sleepCognitive', state.domains?.sleepCognitive)
  }
  if (has(q, ['radiation', 'dose', 'exposure'])) {
    return describeDomain('radiation', state.domains?.radiation)
  }
  if (has(q, ['heart', 'cardio', 'biomarker', 'hrv', 'blood', 'crp'])) {
    return describeDomain('cardiovascular', state.domains?.cardiovascular)
  }
  if (has(q, ['muscle', 'bone', 'exercise', 'workout', 'physical'])) {
    return describeDomain('musculoskeletal', state.domains?.musculoskeletal)
  }

  if (has(q, ['what should', 'advice', 'recommend', 'next step', 'wellness', 'help'])) {
    const steps = (state.alerts ?? []).filter((a) => a.nextStep)
    if (steps.length > 0) {
      return {
        text: 'Suggested next steps from the active alerts (prototype demonstration rules, not medical advice):',
        bullets: steps.map((a) => `${a.title}: ${a.nextStep}`),
        source: steps[0].source,
      }
    }
    return {
      text: 'No active alerts. General prototype steps:',
      bullets: [
        'Keep saving daily check-ins so your personal baseline gets stronger.',
        'Complete the reaction-time test when it is available.',
        'Log exercise so Muscle & Bone is not left at "no data".',
        'If you feel unwell, follow the mission\'s approved procedures and contact the flight surgeon.',
      ],
    }
  }

  if (has(q, ['alert', 'warning', 'why', 'contribut', 'factor', 'cause'])) {
    return explainAlerts(state)
  }

  if (has(q, ['overall', 'status', 'risk', 'summary', 'how am i'])) {
    const o = state.overall
    if (!o) return { text: 'No overall status is available yet.', bullets: [] }
    return {
      text: `Overall status is "${STATUS_WORD[o.status] ?? o.status}" with a risk score of ${o.riskScore ?? 'n/a'}/100 (confidence ${confText(o.confidence)}). ${o.summary ?? ''}`,
      bullets: Object.entries(state.domains ?? {}).map(
        ([k, d]) =>
          `${DOMAIN_LABEL[k]}: ${d.riskScore == null ? 'no data' : `${STATUS_WORD[d.status] ?? d.status}, ${d.riskScore}/100`}`,
      ),
      source: o.source,
    }
  }

  return {
    text: 'I can explain alerts, each health domain (sleep, radiation, cardiovascular, muscle & bone), data quality, and what to do in a blackout. Try one of the suggested questions.',
    bullets: [],
  }
}