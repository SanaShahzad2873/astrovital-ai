// Run with:  node --test src/engine/__tests__/riskFusion.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { fuseRisk, fuseDomain } from '../riskFusion.js';

const s = (signal, status, confidence = 'moderate', sourceLabel = 'SIMULATED_DEMO') =>
  ({ signal, status, confidence, sourceLabel, contributingFactors: [`${signal} note`] });

test('missing domain is unknown, never normal', () => {
  const d = fuseDomain('radiation', undefined);
  assert.equal(d.status, 'unknown');
  assert.equal(d.score, null);
});

test('series with unknown status are not counted as healthy', () => {
  const d = fuseDomain('sleep', [s('a', 'unknown', 'none')]);
  assert.equal(d.status, 'unknown');
});

test('worst signal drives the domain status', () => {
  const d = fuseDomain('cardiovascular', [s('a', 'normal'), s('b', 'high'), s('c', 'normal')]);
  assert.equal(d.status, 'high');
  assert.ok(d.score > 50);
});

test('all normal but domains missing -> incomplete, not normal', () => {
  const r = fuseRisk({ sleep: [s('sleep_hours', 'normal')] });
  assert.equal(r.status, 'incomplete');
  assert.equal(r.dataCompleteness, 'partial');
  assert.deepEqual(r.domainsMissing.sort(), ['cardiovascular', 'musculoskeletal', 'radiation']);
});

test('all four domains normal -> normal and complete', () => {
  const ok = [s('x', 'normal')];
  const r = fuseRisk({ cardiovascular: ok, sleep: ok, radiation: ok, musculoskeletal: ok });
  assert.equal(r.status, 'normal');
  assert.equal(r.dataCompleteness, 'complete');
});

test('partial coverage caps confidence at low', () => {
  const r = fuseRisk({ sleep: [s('a', 'normal', 'high')] });
  assert.equal(r.confidence, 'low');
});

test('no data anywhere -> unknown', () => {
  const r = fuseRisk({});
  assert.equal(r.status, 'unknown');
  assert.equal(r.score, null);
});

test('output carries timestamp, sources and the not-a-diagnosis note', () => {
  const r = fuseRisk({ sleep: [s('a', 'attention')] }, { now: new Date('2026-01-01T00:00:00Z') });
  assert.equal(r.timestamp, '2026-01-01T00:00:00.000Z');
  assert.ok(r.sources.includes('SIMULATED_DEMO'));
  assert.ok(r.thresholdsNote.includes('not a diagnosis'));
});