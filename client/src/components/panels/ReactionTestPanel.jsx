import { useState } from 'react'
import { Timer } from 'lucide-react'
import ReactionTest from '../../reaction-test/ReactionTest'
import SourceTag from '../ui/SourceTag'

// Member 4: 1-minute reaction-time test on the Brain & Sleep screen.
// Sessions are kept on this device (localStorage, works offline). The median is also sent to the API when it is reachable.
const KEY = 'astrovital.reactionSessions'
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export default function ReactionTestPanel() {
  const [sessions, setSessions] = useState(load)
  const [sent, setSent] = useState(null) // null | 'sent' | 'local'

  const onComplete = (summary, observation) => {
    if (!observation) return // fewer than 5 valid taps: not saved
    const next = [...sessions, summary].slice(-30)
    setSessions(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* storage full or blocked */ }
    fetch(`${BASE_URL}/api/reaction-test`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reactionTimeMs: summary.medianMs }),
    })
      .then((r) => setSent(r.ok ? 'sent' : 'local'))
      .catch(() => setSent('local')) // offline or API down: the result stays on this device
  }

  const last = sessions[sessions.length - 1]
  return (
    <section className="glass-card p-6" aria-label="Reaction-time test">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Timer size={20} className="text-mission-yellow" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-white">Reaction-time test</h2>
        <SourceTag source="MEASURED" />
      </div>
      <ReactionTest astronautId="AST-DEMO-01" history={sessions} onComplete={onComplete} />
      <div className="mt-4 space-y-1 text-sm text-ice/65">
        {last && <p>Latest saved session: median <b className="text-white">{last.medianMs} ms</b> from {last.trials} taps ({sessions.length} saved on this device).</p>}
        {sent === 'sent' && <p>Sent to the API.</p>}
        {sent === 'local' && <p>API not reachable: this result is stored on this device only.</p>}
        <p>
          Wellness tracking, not a clinical neurological examination. The Brain &amp; Sleep risk score above still comes from
          simulated demo data; measured reaction times are not included in it yet.
        </p>
      </div>
    </section>
  )
}
