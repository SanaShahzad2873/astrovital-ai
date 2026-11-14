# INTEGRATION.md: how to use the intelligence engine (Member 4)

## What this is
A small JavaScript folder with NO dependencies and NO network calls. Give it health records, it returns the status of 4 domains
(cardio, sleep, radiation, fitness), alerts, a twin state and colours for the 2D astronaut, and Copilot answers. It works offline.

## Step 1. Copy the folder (Member 2 / frontend)
Copy the folder `member4/src/engine` into `client/src/engine`. Do not rename the files.
  Windows PowerShell:  Copy-Item -Recurse member4/src/engine client/src/engine
  Mac / Linux:         cp -r member4/src/engine client/src/engine
Then:  git add client/src/engine   and   git commit -m "Add intelligence engine to client"

## Step 2. Use it in React (Vite)
  import { analyse, answer } from './engine/index.js';        // fix the path to match your file
  const result = analyse({ records, now: new Date().toISOString() });
  result.overall.status            // 'optimal' | 'attention' | 'high' | 'unknown'
  result.twin.state                // 'OPTIMAL' | 'FATIGUED' | 'HIGH_STRESS' | 'RADIATION_ALERT' | 'DECONDITIONING_RISK' | 'UNKNOWN'
  result.twin.regions.head         // { status, domain, accent } -> colour the SVG
  result.domains.sleep.riskScore   // 0-100, or null if unknown
  result.alerts                    // alert list with explanation, nextStep, disclaimer
  answer('why is there an alert?', result)   // Copilot text, works offline

## Step 3. Colours for the SVG astronaut (use the shared design system variables)
  status: optimal = green, attention = yellow, high = red, unknown = light blue-gray
  accent: 'fatigue' (head) and 'radiation' (abdomen) can add a second marker. Regions: head, chest, abdomen, leftArm, rightArm, leftLeg, rightLeg.

## Step 4. Records (Member 3 stores them, Member 2 creates them)
  { astronautId, timestamp: '2026-10-01T12:00:00.000Z', signal, value: 7, unit, sourceLabel, quality: 'ok' }
  signal/unit: restingHr bpm | hrv ms | sleepHours h | mood score | stress score | fatigue score | reactionMs ms | dose mSv or uSv | exerciseMin min
  sourceLabel: NASA_RESEARCH | MEASURED | SELF_REPORTED | SIMULATED_DEMO.  Reaction test => reactionMs, ms, MEASURED.

## Step 5. Demo data until real check-ins exist
  import { simulateDemo } from './engine/index.js';
  simulateDemo({ scenario: 'sleep' })   // normal | sleep | cardio | radiation | fitness | multi   (all labelled SIMULATED_DEMO)

## Rules (please keep them visible in the UI)
- Too little or old data (older than 3 days) => 'unknown', never shown as healthy. A domain needs about 10 days of data.
- Radiation adds only mSv and uSv. Other units are rejected and listed in result.dataQualityWarnings. Show those warnings.
- Thresholds are PROTOTYPE demo rules, not clinical. Show alert.disclaimer under every alert. Never say "diagnosis".

## Common errors
- "Cannot use import statement": use ES modules (Vite does by default).
- Everything 'unknown': you need ~10 days of records, and the newest within 3 days of `now`.
- "unit for X must be ...": the unit text must match exactly (Step 4).
Questions: ask Member 4. Details: CONTRACT.md. Example output: example-analysis.json.
