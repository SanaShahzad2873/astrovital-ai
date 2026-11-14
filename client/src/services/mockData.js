// ALL VALUES HERE ARE SIMULATED_DEMO. They are NOT NASA data.
// Shape follows the proposed shared data contract.
const now = new Date().toISOString()

export const MOCK_STATE = {
  astronautId: 'A-01',
  missionDay: 12,
  generatedAt: now,
  overall: {
    status: 'attention',
    riskScore: 42,
    confidence: 0.6,
    summary: 'Demo scenario: elevated fatigue and radiation context. Not a diagnosis.',
  },
  domains: {
    cardiovascular: {
      status: 'optimal', riskScore: 18, confidence: 0.6, dataQuality: 'limited',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      contributingFactors: [{ label: 'Demo biomarker', detail: 'within personal baseline' }],
    },
    sleepCognitive: {
      status: 'fatigue', riskScore: 58, confidence: 0.7, dataQuality: 'good',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      contributingFactors: [{ label: 'Sleep duration', detail: 'below personal baseline for 3 days' }],
    },
    radiation: {
      status: 'attention', riskScore: 47, confidence: 0.5, dataQuality: 'limited',
      source: 'SIMULATED_DEMO', lastUpdated: now,
      contributingFactors: [{ label: 'Cumulative dose', detail: 'rising trend (demo value)' }],
    },
    // Deliberately missing data: must show as "No Data", not "Optimal"
    musculoskeletal: {
      status: 'unknown', riskScore: null, confidence: 0, dataQuality: 'none',
      source: 'SIMULATED_DEMO', lastUpdated: null, contributingFactors: [],
    },
  },
  bodyRegions: {},
  alerts: [
    {
      id: 'al-1', domain: 'sleepCognitive', severity: 'attention',
      title: 'Sleep below personal baseline',
      message: 'Sleep duration has stayed below your personal baseline for 3 days (demo rule).',
      timestamp: now, source: 'SIMULATED_DEMO',
      contributingFactors: [{ label: 'Sleep duration', detail: '5.2 h vs baseline 7.0 h (demo)' }],
    },
  ],
}