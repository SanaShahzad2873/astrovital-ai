# Reaction-time test (Member 4, Task 3)
A 1-minute reaction-time test for wellness tracking. NOT a clinical neurological examination. Independent of the health engine.

## Files
- ReactionTest.jsx   React component (tap pad, timer, session summary, history comparison)
- reactionLogic.js   plain JavaScript: summarise(), toObservation(), compareToHistory(), nextDelay()
- __tests__/reaction.test.js

## Use (Member 2: copy this folder into client/src/reaction-test)
  import ReactionTest from './reaction-test/ReactionTest.jsx';
  <ReactionTest astronautId="AST-01" history={savedSummaries}
     onComplete={(summary, observation) => { saveSummary(summary); if (observation) saveObservation(observation); }} />
- summary: the full session result (save it so the next session can be compared with it).
- observation: { astronautId, timestamp, signal: 'reaction_time', value (median ms), unit: 'ms', sourceLabel: 'MEASURED', meta }.
  It is null when there were fewer than 5 valid taps. Do not save null.
- Later this observation will be connected to the engine's analyzeSeries() as the sleep and cognition signal.
- Colours: uses CSS variables --navy, --nasa-blue, --yellow, --mist, --red when the shared design system defines them, otherwise the official palette.

## Rules
- "Slow response" (over 500 ms) is a configurable DEMO setting, not a medical threshold.
- Show the note "Not a clinical neurological examination" wherever results appear.

## Test (from the repo root)
  node --test src/reaction-test/__tests__/reaction.test.js
