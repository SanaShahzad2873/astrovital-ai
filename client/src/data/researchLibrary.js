// NASA research metadata. Source label rule: every item here is NASA_RESEARCH
// context. Nothing in this file is an individual astronaut measurement.
// Member 1 owns the content. Fields set to null are not verified yet.

export const RESEARCH_DOMAINS = [
  { key: 'all', label: 'All' },
  { key: 'cardiovascular', label: 'Cardiovascular' },
  { key: 'brain-sleep', label: 'Brain & Sleep' },
  { key: 'radiation', label: 'Radiation' },
  { key: 'musculoskeletal', label: 'Muscle & Bone' },
]

export const RESEARCH_ITEMS = [
  {
    id: 'osd-575',
    domain: 'cardiovascular',
    datasetId: 'OSD-575',
    studyName: 'Inspiration4 human blood serum research',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-575',
    subjectType: 'Human (Inspiration4 crew)',
    dataType: 'Blood serum biomarkers (multiplex panels)',
    access: 'verified',
    usedFor:
      'Cardiovascular-related biomarker context and immune research in the Cardiovascular screen.',
    limitations: [
      'Contains blood serum biomarkers only. It does not contain continuous heart-rate or HRV readings.',
      'Very small crew, so results are research context and not a baseline for any individual.',
      'Research context is not an individual diagnosis.',
    ],
  },
  {
    id: 'osd-569',
    domain: 'cardiovascular',
    datasetId: 'OSD-569',
    studyName: 'Inspiration4 whole-blood research',
    sourceUrl: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-569',
    subjectType: 'Human (Inspiration4 crew)',
    dataType: 'Whole-blood research',
    access: 'unverified',
    usedFor: 'Possible additional context. Not used until file access is confirmed.',
    limitations: [
      'File access must be verified before the app relies on it.',
      'Not used for any displayed value at this stage.',
    ],
  },
  {
    id: 'sleep-actigraphy',
    domain: 'brain-sleep',
    datasetId: null,
    studyName: 'NASA human sleep-wake actigraphy research',
    sourceUrl: null,
    subjectType: 'Human spaceflight research',
    dataType: 'Scientific reference',
    access: 'reference-only',
    usedFor: 'Scientific background for the Brain & Sleep screen.',
    limitations: [
      'Raw individual sleep records are not confirmed as downloadable.',
      'Sleep values in the app are self-reported or clearly labelled SIMULATED_DEMO.',
    ],
  },
  {
    id: 'radlab',
    domain: 'radiation',
    datasetId: null,
    studyName: 'NASA RadLab radiation research',
    sourceUrl: null,
    subjectType: 'Environmental measurements',
    dataType: 'Radiation research and environmental data',
    access: 'reference-only',
    usedFor: 'Mission radiation context in the Radiation screen.',
    limitations: [
      'Environmental measurements are not individual astronaut dosimeter readings.',
      'Units must be validated before any cumulative exposure is calculated.',
    ],
  },
  {
    id: 'bone-muscle',
    domain: 'musculoskeletal',
    datasetId: null,
    studyName: 'NASA bone and muscle spaceflight research',
    sourceUrl: null,
    subjectType: 'Human spaceflight research',
    dataType: 'Scientific context',
    access: 'reference-only',
    usedFor: 'Background on microgravity-related changes for the Muscle & Bone screen.',
    limitations: [
      'Exercise logs do not directly measure bone density or muscle mass.',
      'Used for scientific context only.',
    ],
  },
]

export const ACCESS_LABELS = {
  verified: 'Data verified',
  unverified: 'Access to verify',
  'reference-only': 'Reference only',
}