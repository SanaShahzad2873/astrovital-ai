import { test } from 'node:test';
import assert from 'node:assert/strict';
import { summarise, toObservation, compareToHistory, nextDelay, DEFAULTS } from '../reactionLogic.js';
test('summary: mean, median, fastest, slowest, slow count', () => {
  const s = summarise({ times: [250, 300, 350, 600, 700], falseStarts: 1, lapses: 2 });
  assert.equal(s.trials, 5); assert.equal(s.meanMs, 440); assert.equal(s.medianMs, 350); assert.equal(s.fastestMs, 250); assert.equal(s.slowestMs, 700);
  assert.equal(s.slowCount, 2); assert.equal(s.falseStarts, 1); assert.equal(s.lapses, 2); assert.equal(s.enoughData, true);
});
test('empty session does not crash and has no numbers', () => {
  const s = summarise({}); assert.equal(s.trials, 0); assert.equal(s.meanMs, null); assert.equal(s.enoughData, false);
});
test('observation uses the median and is labelled MEASURED', () => {
  const o = toObservation(summarise({ times: [250, 300, 350, 600, 700], startedAt: '2026-11-15T10:00:00.000Z' }), 'AST-01');
  assert.equal(o.value, 350); assert.equal(o.unit, 'ms'); assert.equal(o.sourceLabel, 'MEASURED'); assert.equal(o.timestamp, '2026-11-15T10:00:00.000Z');
});
test('fewer than 5 valid taps are not saved', () => { assert.equal(toObservation(summarise({ times: [300, 310, 320] })), null); });
test('history comparison needs 2 earlier sessions, then reports the difference', () => {
  const today = summarise({ times: [300, 300, 300, 300, 300] }), old = summarise({ times: [250, 250, 250, 250, 250] });
  assert.equal(compareToHistory(today, [old]).ready, false);
  const c = compareToHistory(today, [old, old]); assert.equal(c.ready, true); assert.equal(c.diffMs, 50); assert.equal(c.pct, 20);
});
test('history ignores sessions without a median', () => {
  const today = summarise({ times: [300, 300, 300, 300, 300] });
  assert.equal(compareToHistory(today, [summarise({}), summarise({})]).ready, false);
});
test('random delay stays inside its range', () => { for (let i = 0; i < 300; i++) { const d = nextDelay(); assert.ok(d >= DEFAULTS.minDelayMs && d <= DEFAULTS.maxDelayMs); } });
test('the slow-response limit is labelled as a demo setting, not a medical threshold', () => {
  assert.match(summarise({ times: [1, 2, 3, 4, 5] }).note, /Not a clinical neurological examination/);
});
