import { useEffect, useRef, useState } from 'react';
import { DEFAULTS, nextDelay, summarise, toObservation, compareToHistory } from './reactionLogic.js';
// Uses the shared design-system CSS variables if they exist, otherwise the official AstroVital palette.
const C = { navy: 'var(--navy, #061A35)', blue: 'var(--nasa-blue, #0B3D91)', yellow: 'var(--yellow, #FFD100)', mist: 'var(--mist, #DCE6F1)', red: 'var(--red, #FC3D21)', green: '#22C55E' };
export default function ReactionTest({ astronautId = 'AST-01', history = [], onComplete, config = DEFAULTS }) {
  const [phase, setPhase] = useState('idle');          // idle | waiting | go | done
  const [left, setLeft] = useState(config.durationMs / 1000);
  const [taps, setTaps] = useState(0);
  const [shown, setShown] = useState(null);            // last reaction time shown to the user
  const [result, setResult] = useState(null);
  const d = useRef({ times: [], falseStarts: 0, lapses: 0, t0: 0, endAt: 0, startedAt: '' }), timers = useRef([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  const finish = () => {
    clear(); const s = summarise({ times: d.current.times, falseStarts: d.current.falseStarts, lapses: d.current.lapses, startedAt: d.current.startedAt }, config);
    const rec = toObservation(s, astronautId); setResult({ s, cmp: compareToHistory(s, history), rec }); setPhase('done'); if (onComplete) onComplete(s, rec);
  };
  const arm = () => {
    if (performance.now() >= d.current.endAt) return finish();
    setPhase('waiting');
    later(() => { d.current.t0 = performance.now(); setPhase('go');
      later(() => { d.current.lapses += 1; arm(); }, config.lapseMs); }, nextDelay(Math.random, config));
  };
  const start = () => { d.current = { times: [], falseStarts: 0, lapses: 0, t0: 0, endAt: performance.now() + config.durationMs, startedAt: new Date().toISOString() }; setShown(null); setTaps(0); setResult(null); setLeft(config.durationMs / 1000); arm();
    const tick = setInterval(() => setLeft(Math.max(0, Math.ceil((d.current.endAt - performance.now()) / 1000))), 250); timers.current.push(tick); };
  const press = () => {
    if (phase === 'waiting') { d.current.falseStarts += 1; clear(); setShown('Too early'); later(arm, 600); return; }
    if (phase === 'go') { const t = performance.now() - d.current.t0; d.current.times.push(t); setTaps(d.current.times.length); setShown(Math.round(t) + ' ms'); clear(); later(arm, 500); }
  };
  const box = { background: C.navy, color: '#fff', border: `1px solid ${C.blue}`, borderRadius: 14, padding: 20, maxWidth: 520, fontFamily: 'system-ui, sans-serif' };
  const pad = { height: 200, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, cursor: 'pointer', userSelect: 'none', touchAction: 'manipulation',
    background: phase === 'go' ? C.yellow : C.blue, color: phase === 'go' ? C.navy : '#fff' };
  return (
    <section style={box} aria-label="Reaction-time test">
      <h2 style={{ margin: '0 0 6px' }}>Reaction-time test</h2>
      <p style={{ color: C.mist, margin: '0 0 12px', fontSize: 14 }}>One minute. Tap as soon as the pad turns yellow. Wellness tracking only, not a clinical neurological examination.</p>
      {phase === 'idle' && <button onClick={start} style={{ background: C.yellow, color: C.navy, border: 0, borderRadius: 10, padding: '12px 20px', fontSize: 16, fontWeight: 700 }}>Start 1-minute test</button>}
      {(phase === 'waiting' || phase === 'go') && <>
        <div style={{ color: C.mist, marginBottom: 8 }}>Time left: <b>{left}s</b> &nbsp; Taps: <b>{taps}</b> &nbsp; Last: <b>{shown ?? '-'}</b></div>
        <div role="button" tabIndex={0} aria-label="Reaction pad" style={pad} onPointerDown={press}>{phase === 'go' ? 'TAP NOW' : 'Wait for yellow...'}</div></>}
      {phase === 'done' && result && <div>
        <h3 style={{ margin: '0 0 8px' }}>Session summary</h3>
        <ul style={{ color: C.mist, lineHeight: 1.7, paddingLeft: 18 }}>
          <li>Valid taps: <b>{result.s.trials}</b> &nbsp; Too early: <b>{result.s.falseStarts}</b> &nbsp; Missed: <b>{result.s.lapses}</b></li>
          <li>Average: <b>{result.s.meanMs ?? '-'} ms</b> &nbsp; Median: <b>{result.s.medianMs ?? '-'} ms</b></li>
          <li>Fastest / slowest: <b>{result.s.fastestMs ?? '-'} / {result.s.slowestMs ?? '-'} ms</b></li>
          <li>Slow responses (over {result.s.slowThresholdMs} ms, demo setting): <b>{result.s.slowCount}</b></li></ul>
        <p style={{ color: result.cmp.ready ? '#fff' : C.mist }}>{result.cmp.text}</p>
        {!result.rec && <p style={{ color: C.yellow }}>Too few valid taps, so this session was not saved to your health data.</p>}
        <button onClick={() => { setPhase('idle'); setResult(null); }} style={{ background: C.blue, color: '#fff', border: 0, borderRadius: 10, padding: '10px 16px' }}>Run again</button></div>}
    </section>);
}
