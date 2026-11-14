const now = () => new Date().toISOString();

export function getOverview() {
  return {
    astronautId: 'AST-001',
    missionDay: 42,
    overallStatus: 'attention',
    riskScore: 38,
    confidence: 0.6,
    domains: { cardiovascular: 20, sleep: 55, radiation: 30, fitness: 45 },
    contributingFactors: ['Sleep duration below personal baseline'],
    source: 'SIMULATED_DEMO',
    timestamp: now(),
  };
}

export function getCardiovascular() {
  return {
    note: 'OSD-575 contains blood serum biomarkers, not continuous heart rate.',
    readings: [
      { name: 'Demo biomarker', value: 1.2, unit: 'mg/L', source: 'SIMULATED_DEMO', collectedAt: now() },
    ],
    timestamp: now(),
  };
}

export function getSleep() {
  return {
    records: [
      { date: '2026-11-13', hours: 5.8, source: 'SIMULATED_DEMO' },
      { date: '2026-11-12', hours: 6.5, source: 'SIMULATED_DEMO' },
    ],
    timestamp: now(),
  };
}

export function getRadiation() {
  return {
    note: 'Environmental measurements are not personal dosimeter readings.',
    records: [{ date: '2026-11-13', dose: 0.5, unit: 'mSv/day', source: 'SIMULATED_DEMO' }],
    timestamp: now(),
  };
}

export function getFitness() {
  return {
    records: [{ date: '2026-11-13', minutes: 40, type: 'treadmill', source: 'SIMULATED_DEMO' }],
    timestamp: now(),
  };
}

export function getAlerts() {
  return [
    {
      id: 'alert-1',
      domain: 'sleep',
      severity: 'attention',
      message: 'Sleep below personal baseline for 2 days (demo rule)',
      source: 'SIMULATED_DEMO',
      timestamp: now(),
    },
  ];
}

export function getTwinState() {
  return {
    head: 'purple', chest: 'green', abdomen: 'green',
    leftArm: 'green', rightArm: 'green',
    leftLeg: 'amber', rightLeg: 'amber',
    source: 'SIMULATED_DEMO',
    timestamp: now(),
  };
}

export function getDatasets() {
  return [
    {
      datasetId: 'OSD-575',
      studyName: 'Inspiration4 blood serum research',
      subjectType: 'Human',
      dataType: 'Blood serum biomarkers',
      sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-575',
      limitation: 'Not continuous heart rate or HRV.',
      source: 'NASA_RESEARCH',
    },
  ];
}