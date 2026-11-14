# Data contract (Member 4 owns the engine; Members 1, 2, 3 use it)
## Input record (what Member 3's API stores and sends to the engine)
{ astronautId, timestamp (ISO string), signal, value (number), unit, sourceLabel, quality?, datasetId?, meta? }
- signal: restingHr(bpm) hrv(ms) sleepHours(h) mood(score) stress(score) fatigue(score) reactionMs(ms) dose(mSv or uSv) exerciseMin(min)
- sourceLabel: NASA_RESEARCH | MEASURED | SELF_REPORTED | SIMULATED_DEMO
- quality: ok | missing | stale | conflicting (anything but ok is skipped and reported)
- dose records may carry meta.kind = "personal" | "environmental" (never mixed)
## Output of analyse({ records, now })  -> see docs/example-analysis.json
- overall { status, riskScore, confidence, unknownDomains }
- domains { cardio, sleep, radiation, fitness }  each: status, riskScore, confidence, contributing[], sources[], lastDate, notes[]
- twin.regions { head, chest, abdomen, leftArm, rightArm, leftLeg, rightLeg }  each: { status, domain, accent }
  status: optimal=green, attention=amber, high=red, unknown=gray. accent: "fatigue"=purple (head), "radiation"=blue (abdomen), or null.
- alerts[]  { id, domain, severity, title, explanation, nextStep, evidence, sourceLabels, prototypeRule, disclaimer }
- dataQualityWarnings[]  { type, detail }
## Rules the engine enforces
- Missing, stale or too-little data => status "unknown" (NEVER "optimal").
- Radiation: only mSv and uSv are added together; other units are rejected with a warning.
- Thresholds in src/contract.js CONFIG are PROTOTYPE demo values, not clinical thresholds.
## Use it (backend, Node)       import { analyse, answer } from 'astrovital-engine'   // or relative path
## Use it (frontend, offline)   same import; the engine has no dependencies and no network calls.
## Twin state (new): result.twin.state
OPTIMAL | FATIGUED | HIGH_STRESS | RADIATION_ALERT | DECONDITIONING_RISK | UNKNOWN
Rule: the non-optimal domain with the highest risk decides. sleep => FATIGUED (HIGH_STRESS if the stress signal leads), cardio => HIGH_STRESS,
radiation => RADIATION_ALERT, fitness => DECONDITIONING_RISK. Limitation: only one state is shown at a time; check result.domains for the rest.
