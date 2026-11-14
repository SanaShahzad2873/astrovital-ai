// Run with:  node --test src/engine/__tests__/twinMapping.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { fuseRisk } from '../riskFusion.js';
import { bodyRegionStates } from '../twinMapping.js';

const s = (signal, status, confidence = 'moderate') =>
  ({ signal, status, confidence, sourceLabel: 'SIMULATED_DEMO', contributingFactors: [`${signal} note`] });

test('missing data is unknown (grey), never optimal', () => {
  const t = bodyRegionStates(fuseRisk({}));
  for (const r of Object.values(t.regions)) assert.equal(r.state, 'unknown');
  assert.equal(t.radiationOverlay.active, false);
});

test('sleep attention colours the head as fatigue, high as high_risk', () => {
  assert.equal(bodyRegionStates(fuseRisk({ sleep: [s('a', 'attention')] })).regions.head.state, 'fatigue');
  assert.equal(bodyRegionStates(fuseRisk({ sleep: [s('a', 'high')] })).regions.head.state, 'high_risk');
});

test('cardiovascular drives the chest, musculoskeletal drives all four limbs', () => {
  const t = bodyRegionStates(fuseRisk({ cardiovascular: [s('c', 'high')], musculoskeletal: [s('m', 'attention')] }));
  assert.equal(t.regions.chest.state, 'high_risk');
  for (const k of ['leftArm', 'rightArm', 'leftLeg', 'rightLeg']) assert.equal(t.regions[k].state, 'attention');
});

test('radiation problems switch on the whole-body overlay', () => {
  const t = bodyRegionStates(fuseRisk({ radiation: [s('dose', 'attention')] }));
  assert.equal(t.radiationOverlay.active, true);
});

test('incomplete overall status shows the abdomen as unknown, not optimal', () => {
  const t = bodyRegionStates(fuseRisk({ sleep: [s('a', 'normal')] }));
  assert.equal(t.regions.abdomen.state, 'unknown');
  assert.equal(t.regions.head.state, 'optimal');
});