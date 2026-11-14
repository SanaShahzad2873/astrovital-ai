import { useEffect, useRef, useState } from 'react'
import { Bot, Send, User } from 'lucide-react'
import Card from '../components/ui/Card'
import SourceTag from '../components/ui/SourceTag'
import useAsync from '../hooks/useAsync'
import useOnline from '../hooks/useOnline'
import { getAstronautState } from '../services/api'
import { getSnapshot } from '../services/offlineStore'
import { answerQuestion, SUGGESTIONS } from '../services/copilotEngine'

// Offline: use the last saved snapshot. Online: use the normal API/mock.
async function loadState() {
  if (!navigator.onLine) {
    const snap = await getSnapshot()
    if (snap) return snap.data
  }
  return getAstronautState()
}

function Bubble({ m }) {
  const isUser = m.role === 'user'
  return (
    <div className={'flex gap-3 ' + (isUser ? 'justify-end' : '')}>
      {!isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-mission-yellow/15 text-mission-yellow">
          <Bot size={16} />
        </span>
      )}
      <div
        className={
          'max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ' +
          (isUser ? 'bg-nasa-blue text-white' : 'border border-white/10 bg-white/5 text-ice/90')
        }
      >
        <p>{m.text}</p>
        {m.bullets?.length > 0 && (
          <ul className="mt-2 list-disc space-y-1.5 pl-5">
            {m.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
        {m.source && <div className="mt-3"><SourceTag source={m.source} /></div>}
      </div>
      {isUser && (
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/10 text-ice">
          <User size={16} />
        </span>
      )}
    </div>
  )
}

export default function Copilot() {
  const online = useOnline()
  const { data, loading, error } = useAsync(loadState)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hello. I explain the monitoring data in this app: alerts, trends and data limits. I do not diagnose or give treatment advice.',
      bullets: [],
    },
  ])
  const [input, setInput] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = (text) => {
    const t = text.trim()
    if (!t || !data) return
    setMessages((m) => [
      ...m,
      { role: 'user', text: t },
      { role: 'assistant', ...answerQuestion(t, data, online) },
    ])
    setInput('')
  }

  return (
    <Card title="AI Health Copilot" action={<Bot size={18} className="text-mission-yellow" />}>
      <p className="mb-4 text-xs text-ice/60">
        Rule-based assistant. Answers come only from the data on screen. Decision-support prototype, not a diagnosis.
        {!online && ' Offline: using the last saved record.'}
      </p>

      <div className="max-h-[420px] min-h-[260px] space-y-4 overflow-y-auto pr-1">
        {messages.map((m, i) => <Bubble key={i} m={m} />)}
        {loading && <p className="text-sm text-ice/60">Loading data…</p>}
        {error && <p className="text-sm" style={{ color: '#FC3D21' }}>Could not load data: {error}</p>}
        <div ref={endRef} />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            disabled={!data}
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-ice transition hover:border-mission-yellow hover:text-mission-yellow disabled:opacity-40"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send(input)}
          placeholder="Ask about an alert, sleep, radiation…"
          className="w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white"
        />
        <button
          onClick={() => send(input)}
          disabled={!data}
          aria-label="Send"
          className="rounded-lg bg-nasa-blue px-4 py-2 text-white disabled:opacity-40"
        >
          <Send size={16} />
        </button>
      </div>
    </Card>
  )
}