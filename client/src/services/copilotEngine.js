// Rule-based Copilot. No LLM. Answers are built ONLY from the state object
// (alerts, domains, contributingFactors). It never invents explanations.

const DOMAIN_LABEL = {
  cardiovascular: 'Cardiovascular',
  sleepCognitive: 'Brain & Sleep',
  radiation: 'Radiation',
  musculoskeletal: 'Muscle & Bone',
}

const has = (q, words) => words.some((w) => q.includes(w))

const confText = (c) =>
  typeof c === 'number' ? `${Math.round(c * 100)}%` : String(c ?? 'unknown')

function describeDomain(key, d) {
  const label = DOMAIN_LABEL[key]
  if (!d || d.status === 'unknown' || d.riskScore == null) {
    return {
      text: `${label}: there is not enough data yet, so no status can be given. Missing data does not mean healthy.`,
      bullets: [],
      source: d?.source,
    }
  }
  const bullets = (d.contributingFactors ?? []).map((f) => `${f.label}: ${f.detail}`)
  let text = `${label} is "${d.status}" with a score of ${d.riskScore}/100 (confidence ${confText(d.confidence)}, data quality ${d.dataQuality}).`
  if (key === 'cardiovascular') {
    const noHr = (d.metrics ?? []).some((m) => m.key === 'heartRate' && m.value === null)
    if (noHr) {
      bullets.push('Heart rate and HRV: no data source is connected, so they are not shown. The biomarkers here are blood research values, not heart-rate readings.')
    }
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
    text: `There are ${alerts.length} active alerts. Each one comes from a configurable demonstration rule, not a clinical limit:`,
    bullets,
    source: alerts[0].source,
  }
}

export const SUGGESTIONS = [
  'Why is there an alert?',
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

  if (has(q, ['alert', 'warning', 'why', 'contribut', 'factor', 'cause'])) {
    return explainAlerts(state)
  }

  if (has(q, ['overall', 'status', 'risk', 'summary', 'how am i'])) {
    const o = state.overall
    if (!o) return { text: 'No overall status is available yet.', bullets: [] }
    return {
      text: `Overall status is "${o.status}" with a risk score of ${o.riskScore}/100 (confidence ${confText(o.confidence)}). ${o.summary ?? ''}`,
      bullets: Object.entries(state.domains ?? {}).map(
        ([k, d]) => `${DOMAIN_LABEL[k]}: ${d.riskScore == null ? 'no data' : `${d.status}, ${d.riskScore}/100`}`,
      ),
      source: o.source,
    }
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

  return {
    text: 'I can explain alerts, each health domain (sleep, radiation, cardiovascular, muscle & bone), data quality, and what to do in a blackout. Try one of the suggested questions.',
    bullets: [],
  }
}