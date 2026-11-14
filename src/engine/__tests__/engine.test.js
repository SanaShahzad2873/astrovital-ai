// Run with:  node --test src/engine/__tests__/engine.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { median, mad, buildBaseline, robustZ } from '../baselineEngine.js';
import { analyzeSeries, classifyZ } from '../anomalyDetector.js';

const near = (a, b, eps = 1e-3) => assert.ok(Math.abs(a - b) < eps, `${a} !~ ${b}`);

test('median and MAD on a known set', () => {
  assert.equal(median([1, 2, 3, 4, 100]), 3);
  assert.equal(median([1, 2, 3, 4]), 2.5);
  assert.equal(mad([1, 2, 3, 4, 100]), 1);
});

test('missing values are ignored, never zero', () => {
  assert.equal(median([null, 5, NaN, 7, undefined]), 6);
});

test('too few observations -> insufficient, not normal', () => {
  const b = buildBaseline([7, 8]);
  assert.equal(b.status, 'insufficient');
  assert.equal(robustZ(7, b), null);
});

test('confidence grows with observations', () => {
  assert.equal(buildBaseline([1, 2, 3]).confidence, 'low');
  assert.equal(buildBaseline([1, 2, 3, 4, 5, 6]).confidence, 'moderate');
  assert.equal(buildBaseline(Array.from({ length: 12 }, (_, i) => 10 + (i % 3))).confidence, 'high');
});

test('robust z-score matches hand calculation', () => {
  const b = buildBaseline([1, 2, 3, 4, 100], { minScaleFraction: 0 });
  near(robustZ(10, b), 7 / 1.4826);
});

test('identical baseline values do not divide by zero', () => {
  const b = buildBaseline([7, 7, 7, 7]);
  assert.equal(b.status, 'ready');
  assert.ok(b.scale > 0);
});

test('direction: only low sleep is concerning when direction=low', () => {
  assert.equal(classifyZ(-3, 'low'), 'attention');
  assert.equal(classifyZ(3, 'low'), 'normal');
});

test('sleep drift scenario raises an alert with explanations', () => {
  const baselineValues = [7.2, 7.0, 7.4, 7.1, 7.3, 7.2, 7.0];
  const observations = [6.9, 6.2, 5.6, 5.1, 4.8].map((v, i) => ({ label: `N${i + 1}`, value: v }));
  const r = analyzeSeries({
    observations, baselineValues,
    meta: { signal: 'sleep_hours', unit: 'h', direction: 'low', sourceLabel: 'SIMULATED_DEMO', now: new Date('2026-01-01T00:00:00Z') },
  });
  assert.notEqual(r.status, 'normal');
  assert.ok(r.contributingFactors.length > 0);
  assert.equal(r.sourceLabel, 'SIMULATED_DEMO');
});

test('stable sleep stays normal', () => {
  const r = analyzeSeries({
    observations: [7.1, 7.3, 7.0].map((v, i) => ({ label: `N${i}`, value: v })),
    baselineValues: [7.2, 7.0, 7.4, 7.1, 7.3, 7.2, 7.0],
    meta: { signal: 'sleep_hours', direction: 'low' },
  });
  assert.equal(r.status, 'normal');
});

test('no baseline -> unknown status', () => {
  const r = analyzeSeries({ observations: [{ label: 'a', value: 5 }], baselineValues: [5], meta: { signal: 'x' } });
  assert.equal(r.status, 'unknown');
});