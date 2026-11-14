// ALL VALUES HERE ARE SIMULATED_DEMO. They are NOT NASA data.
// Shape follows the proposed shared data contract.
const now = new Date().toISOString()
const h = (arr) => arr.map((value, i) => ({ day: i + 1, value }))

export const MOCK_STATE = {
  astronautId: 'A-01',
  missionDay: 12,
  missionTotalDays: 30,
  generatedAt: now,
  overall: {
    status: 'attention', riskScore: 42, confidence: 0.6, source: 'SIMULATED_DEMO',
    summary: 'Demo scenario: elevated fatigue and radiation context. Not a diagnosis.',
    history: h([28, 30, 29, 33, 35, 34, 38, 40, 39, 41, 43, 42]),
  },
  domains: {
    cardiovascular: {
      status: 'optimal', riskScore: 18, confidence: 0.6, dataQuality: 'limited',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      history: h([20, 19, 21, 18, 19, 17, 18, 19, 18, 17, 18, 18]),
      contributingFactors: [{ label: 'Demo biomarker', detail: 'within personal baseline' }],
      metrics: [
        { key: 'crp', label: 'CRP (demo)', value: 1.8, unit: 'mg/L', status: 'optimal',
          source: 'SIMULATED_DEMO', quality: 'limited', collectedAt: now,
          history: h([1.4, 1.5, 1.3, 1.6, 1.7, 1.8]) },
        { key: 'il6', label: 'IL-6 (demo)', value: 2.1, unit: 'pg/mL', status: 'optimal',
          source: 'SIMULATED_DEMO', quality: 'limited', collectedAt: now,
          history: h([2.4, 2.2, 2.3, 2.0, 2.2, 2.1]) },
        // No continuous heart-rate source exists yet: must show "No Data", never "Normal"
        { key: 'heartRate', label: 'Heart rate', value: null, unit: 'bpm', status: 'unknown',
          source: 'SIMULATED_DEMO', quality: 'none', collectedAt: null, history: [],
          note: 'no source connected' },
        { key: 'hrv', label: 'HRV', value: null, unit: 'ms', status: 'unknown',
          source: 'SIMULATED_DEMO', quality: 'none', collectedAt: null, history: [],
          note: 'no source connected' },
      ],
    },
    sleepCognitive: {
      status: 'fatigue', riskScore: 58, confidence: 0.7, dataQuality: 'good',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      history: h([30, 32, 35, 38, 41, 45, 48, 50, 53, 55, 57, 58]),
      contributingFactors: [{ label: 'Sleep duration', detail: 'below personal baseline for 3 days' }],
    },
    radiation: {
      status: 'attention', riskScore: 47, confidence: 0.5, dataQuality: 'limited',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      history: h([22, 24, 27, 28, 31, 33, 36, 38, 41, 43, 45, 47]),
      contributingFactors: [{ label: 'Cumulative dose', detail: 'rising trend (demo value)' }],
    },
    // Deliberately missing data: must show as "No Data", not "Optimal"
    musculoskeletal: {
      status: 'unknown', riskScore: null, confidence: 0, dataQuality: 'none',
      source: 'SIMULATED_DEMO', lastUpdated: null, history: [], contributingFactors: [],
    },
  },
  bodyRegions: {
    head:     { status: 'fatigue',   domain: 'sleepCognitive',  summary: 'Demo: sleep below personal baseline for 3 days.' },
    chest:    { status: 'optimal',   domain: 'cardiovascular',  summary: 'Demo: cardiovascular indicators within personal baseline.' },
    abdomen:  { status: 'attention', domain: 'radiation',       summary: 'Demo: cumulative radiation context is rising.' },
    leftArm:  { status: 'unknown',   domain: 'musculoskeletal', summary: 'No exercise data available yet.' },
    rightArm: { status: 'unknown',   domain: 'musculoskeletal', summary: 'No exercise data available yet.' },
    leftLeg:  { status: 'unknown',   domain: 'musculoskeletal', summary: 'No exercise data available yet.' },
    rightLeg: { status: 'unknown',   domain: 'musculoskeletal', summary: 'No exercise data available yet.' },
  },
  alerts: [
    {
      id: 'al-1', domain: 'sleepCognitive', severity: 'attention',
      title: 'Sleep below personal baseline',
      message: 'Sleep duration has stayed below your personal baseline for 3 days (demo rule).',
      timestamp: new Date(Date.now() - 1 * 3600e3).toISOString(), source: 'SIMULATED_DEMO',
      contributingFactors: [{ label: 'Sleep duration', detail: '5.2 h vs baseline 7.0 h (demo)' }],
    },
    {
      id: 'al-2', domain: 'radiation', severity: 'attention',
      title: 'Radiation exposure trend rising',
      message: 'Cumulative dose context has risen for 5 consecutive days (demo rule).',
      timestamp: new Date(Date.now() - 9 * 3600e3).toISOString(), source: 'SIMULATED_DEMO',
      contributingFactors: [{ label: 'Cumulative dose', detail: 'upward trend (demo value)' }],
    },
    {
      id: 'al-3', domain: 'sleepCognitive', severity: 'info',
      title: 'Reaction-time test not completed',
      message: 'No reaction-time result recorded today, so cognitive confidence is lower.',
      timestamp: new Date(Date.now() - 26 * 3600e3).toISOString(), source: 'SIMULATED_DEMO',
      contributingFactors: [],
    },
  ],
}