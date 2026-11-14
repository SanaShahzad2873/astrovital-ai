// Run with:  node --test src/engine/__tests__/sleepSimulator.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateSleepNights, runSleepDemo } from '../sleepSimulator.js';

test('same seed gives identical data', () => {
  assert.deepEqual(generateSleepNights({ seed: 7 }), generateSleepNights({ seed: 7 }));
});

test('different seeds give different data', () => {
  assert.notDeepEqual(generateSleepNights({ seed: 7 }), generateSleepNights({ seed: 8 }));
});

test('every night is labelled SIMULATED_DEMO and in a plausible range', () => {
  for (const n of generateSleepNights()) {
    assert.equal(n.sourceLabel, 'SIMULATED_DEMO');
    assert.ok(n.value >= 3 && n.value <= 10);
  }
});

test('declining scenario raises an alert after the drift starts', () => {
  const d = runSleepDemo({ scenario: 'declining' });
  assert.ok(d.firstAttention !== null, 'expected an alert');
  assert.ok(d.firstAttention >= 20, 'alert should not fire before the drift begins');
});

test('stable scenario never reaches high', () => {
  const d = runSleepDemo({ scenario: 'stable' });
  assert.equal(d.firstHigh, null);
});