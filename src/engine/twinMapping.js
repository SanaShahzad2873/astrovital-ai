// src/engine/twinMapping.js
// PROPOSED mapping from fused health results to the 2D astronaut body regions.
// Agree this with the frontend/digital-twin owner before relying on it.
//
//   head      <- sleep (brain & cognitive wellness)
//   chest     <- cardiovascular
//   leftArm, rightArm, leftLeg, rightLeg <- musculoskeletal
//   abdomen   <- overall status (no single domain owns it)
//   radiation <- whole-body OVERLAY (blue shield), shown when radiation is not normal
//
// This returns STATE NAMES only. The frontend maps each state to a design-system colour
// (green / amber / red / purple / blue / grey), so colours stay in one place.
//
// States: optimal | attention | high_risk | fatigue | unknown
// Unknown or missing data is shown as 'unknown' (grey). It is NEVER shown as optimal.

const domainOf = (fused, name) => fused.domains.find((d) => d.domain === name);

function plain(domain) {
  if (!domain || domain.status === 'unknown') return 'unknown';
  return { normal: 'optimal', attention: 'attention', high: 'high_risk' }[domain.status];
}

function head(domain) {
  if (!domain || domain.status === 'unknown') return 'unknown';
  return { normal: 'optimal', attention: 'fatigue', high: 'high_risk' }[domain.status]; // purple = fatigue/cognitive
}

function region(state, domainName, domain, regionLabel) {
  return {
    region: regionLabel,
    state,
    domain: domainName,
    status: domain?.status ?? 'unknown',
    score: domain?.score ?? null,
    confidence: domain?.confidence ?? 'none',
    reasons: domain?.contributingFactors ?? ['No data available for this domain.'],
    sources: domain?.sources ?? [],
  };
}

export function bodyRegionStates(fused) {
  const sleep = domainOf(fused, 'sleep');
  const cardio = domainOf(fused, 'cardiovascular');
  const muscle = domainOf(fused, 'musculoskeletal');
  const radiation = domainOf(fused, 'radiation');

  const overall = {
    status: fused.status, score: fused.score, confidence: fused.confidence,
    contributingFactors: fused.contributingFactors, sources: fused.sources,
  };
  const overallState = fused.status === 'normal' ? 'optimal'
    : fused.status === 'attention' ? 'attention'
    : fused.status === 'high' ? 'high_risk' : 'unknown'; // 'incomplete' and 'unknown' -> grey

  const limb = (label) => region(plain(muscle), 'musculoskeletal', muscle, label);

  return {
    regions: {
      head: region(head(sleep), 'sleep', sleep, 'Head'),
      chest: region(plain(cardio), 'cardiovascular', cardio, 'Chest'),
      abdomen: { ...region(overallState, 'overall', { ...overall, domain: 'overall' }, 'Abdomen'), status: fused.status },
      leftArm: limb('Left arm'),
      rightArm: limb('Right arm'),
      leftLeg: limb('Left leg'),
      rightLeg: limb('Right leg'),
    },
    radiationOverlay: {
      active: !!radiation && (radiation.status === 'attention' || radiation.status === 'high'),
      status: radiation?.status ?? 'unknown',
      reasons: radiation?.contributingFactors ?? ['No radiation data available.'],
    },
    timestamp: fused.timestamp,
  };
}