// Run with:  node --test src/engine/__tests__/demoScenario.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import * as engine from '../index.js';

const cardio = [{ signal: 'CRP', status: 'attention', confidence: 'low', sourceLabel: 'NASA_RESEARCH', contributingFactors: ['CRP note'] }];

test('index.js exports the public API', () => {
  for (const name of ['analyzeSeries', 'fuseRisk', 'bodyRegionStates', 'buildDemoState', 'buildBaseline']) {
    assert.equal(typeof engine[name], 'function', name);
  }
});

test('demo state at night 30 has all parts and mixed sources', () => {
  const s = engine.buildDemoState({ cardiovascular: cardio, night: 30 });
  assert.equal(s.fused.domains.length, 4);
  assert.ok(s.twin.regions.head);
  assert.ok(s.fused.sources.includes('NASA_RESEARCH'));
  assert.ok(s.fused.sources.includes('SIMULATED_DEMO'));
});

test('before the baseline window is complete, simulated domains are unknown', () => {
  const s = engine.buildDemoState({ cardiovascular: cardio, night: 5 });
  const sleep = s.fused.domains.find((d) => d.domain === 'sleep');
  assert.equal(sleep.status, 'unknown');
});

test('stable scenario does not reach high in sleep', () => {
  const s = engine.buildDemoState({ night: 40, scenario: 'stable' });
  const sleep = s.fused.domains.find((d) => d.domain === 'sleep');
  assert.notEqual(sleep.status, 'high');
});

test('radiation results passed in are used', () => {
  const rad = [{ signal: 'dose', status: 'high', confidence: 'low', sourceLabel: 'NASA_RESEARCH', contributingFactors: ['dose note'] }];
  const s = engine.buildDemoState({ radiation: rad, night: 30 });
  assert.equal(s.twin.radiationOverlay.active, true);
});