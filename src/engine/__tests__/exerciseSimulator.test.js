// Run with:  node --test src/engine/__tests__/exerciseSimulator.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateExerciseDays, analyzeExerciseUpTo } from '../exerciseSimulator.js';

test('same seed gives identical data and everything is SIMULATED_DEMO', () => {
  const a = generateExerciseDays({ seed: 1 });
  assert.deepEqual(a, generateExerciseDays({ seed: 1 }));
  assert.ok(a.every((d) => d.sourceLabel === 'SIMULATED_DEMO' && d.value >= 0));
});

test('declining scenario raises an alert and counts missed targets', () => {
  const days = generateExerciseDays({ scenario: 'declining' });
  const r = analyzeExerciseUpTo(days, 40);
  assert.notEqual(r.status, 'normal');
  assert.ok(r.missedTargets > 0);
});

test('result never claims to measure bone or muscle', () => {
  const r = analyzeExerciseUpTo(generateExerciseDays(), 30);
  assert.ok(r.note.includes('do not measure bone density or muscle mass'));
});