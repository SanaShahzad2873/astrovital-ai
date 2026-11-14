import { useCallback, useEffect, useState } from 'react'
import { WifiOff, Database, ClipboardList, ScrollText, ShieldAlert, Send } from 'lucide-react'
import Card from '../components/ui/Card'
import useOnline from '../hooks/useOnline'
import {
  getSnapshot, addCheckin, listCheckins, addEvent, listEvents,
  queueReport, listOutbox, markOutboxSynced,
} from '../services/offlineStore'

const fmt = (iso) => new Date(iso).toLocaleString()

// Placeholder guidance. Replace with the mission's approved protocol text.
const GUIDANCE = [
  'Follow your mission\'s approved emergency procedures first. This screen is not a medical protocol.',
  'If you feel seriously unwell, alert the nearest crew member immediately.',
  'Log what happened and when in the Event log below so Earth can review it later.',
  'When the Earth link returns, send the queued report so ground teams can see this period.',
]

const inputCls =
  'w-full rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm text-white'

function Scale({ label, value, onChange }) {
  return (
    <label className="block text-xs font-semibold uppercase tracking-wider text-ice/60">
      {label} (1 low – 5 high)
      <select className={inputCls + ' mt-1 normal-case'} value={value} onChange={(e) => onChange(Number(e.target.value))}>
        {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
      </select>
    </label>
  )
}

export default function BlackoutMode() {
  const online = useOnline()
  const [manual, setManual] = useState(() => localStorage.getItem('av_blackout') === '1')
  const active = manual || !online

  const [snapshot, setSnapshot] = useState(null)
  const [checkins, setCheckins] = useState([])
  const [events, setEvents] = useState([])
  const [outbox, setOutbox] = useState([])

  const [mood, setMood] = useState(3)
  const [fatigue, setFatigue] = useState(3)
  const [stress, setStress] = useState(3)
  const [note, setNote] = useState('')
  const [eventText, setEventText] = useState('')

  const refresh = useCallback(async () => {
    setSnapshot((await getSnapshot()) ?? null)
    setCheckins(await listCheckins())
    setEvents(await listEvents())
    setOutbox(await listOutbox())
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const toggle = () => {
    const next = !manual
    setManual(next)
    localStorage.setItem('av_blackout', next ? '1' : '0')
    addEvent({ type: 'mode', text: next ? 'Blackout Mode enabled manually' : 'Blackout Mode disabled' }).then(refresh)
  }

  const submitCheckin = async () => {
    await addCheckin({ mood, fatigue, stress, note })
    setNote('')
    refresh()
  }

  const submitEvent = async () => {
    if (!eventText.trim()) return
    await addEvent({ type: 'note', text: eventText.trim() })
    setEventText('')
    refresh()
  }

  const queueSummary = async () => {
    await queueReport({
      kind: 'blackout-summary',
      snapshotSavedAt: snapshot?.savedAt ?? null,
      checkinCount: checkins.length,
      eventCount: events.length,
    })
    refresh()
  }

  const queued = outbox.filter((r) => r.status === 'queued')

  return (
    <div className="space-y-5">
      {/* status banner */}
      <div
        className={
          'flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4 ' +
          (active
            ? 'border-mission-yellow/45 bg-mission-yellow/10'
            : 'border-white/10 bg-white/5')
        }
      >
        <div className="flex items-center gap-3">
          <WifiOff size={22} className={active ? 'text-mission-yellow' : 'text-ice/60'} />
          <div>
            <p className="font-semibold text-white">
              {active ? 'Blackout Mode active' : 'Blackout Mode off'}
            </p>
            <p className="text-sm text-ice/70">
              {!online
                ? 'No connection detected. Showing locally stored data only.'
                : manual
                ? 'Enabled manually. Live cloud data is not being used.'
                : 'Link is active. Turn on to rehearse offline operation.'}
            </p>
          </div>
        </div>
        <button
          onClick={toggle}
          disabled={!online && !manual}
          className="rounded-lg border border-mission-yellow px-4 py-2 text-sm font-semibold text-mission-yellow disabled:opacity-40"
        >
          {manual ? 'Disable' : 'Enable Blackout Mode'}
        </button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* last snapshot */}
        <Card title="Last saved health record" action={<Database size={18} className="text-mission-yellow" />}>
          {snapshot ? (
            <div className="space-y-1 text-sm text-ice/80">
              <p>Saved: <span className="text-white">{fmt(snapshot.savedAt)}</span></p>
              <p>Source label: <span className="text-white">{snapshot.source}</span></p>
              <p className="pt-2 text-xs text-ice/55">
                This is a stored copy. It does not update while offline.
              </p>
            </div>
          ) : (
            <p className="text-sm text-ice/70">
              No record saved yet. Open the app once while online to store one.
            </p>
          )}
        </Card>

        {/* guidance */}
        <Card title="Emergency guidance" action={<ShieldAlert size={18} className="text-mission-yellow" />}>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-ice/85">
            {GUIDANCE.map((g) => <li key={g}>{g}</li>)}
          </ul>
          <p className="mt-3 text-xs text-ice/55">
            Placeholder guidance for the prototype. Not a medical protocol or diagnosis.
          </p>
        </Card>

        {/* check-in */}
        <Card title="Offline check-in" action={<ClipboardList size={18} className="text-mission-yellow" />}>
          <div className="grid gap-3 sm:grid-cols-3">
            <Scale label="Mood" value={mood} onChange={setMood} />
            <Scale label="Fatigue" value={fatigue} onChange={setFatigue} />
            <Scale label="Stress" value={stress} onChange={setStress} />
          </div>
          <textarea className={inputCls + ' mt-3'} rows={2} placeholder="Optional note" value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={submitCheckin} className="mt-3 rounded-lg bg-nasa-blue px-4 py-2 text-sm font-semibold text-white">
            Save check-in (SELF_REPORTED)
          </button>
          <ul className="mt-4 space-y-1.5 text-sm text-ice/80">
            {checkins.slice(0, 5).map((c) => (
              <li key={c.id}>
                {fmt(c.createdAt)} · mood {c.mood}, fatigue {c.fatigue}, stress {c.stress}
                {c.note ? ` · ${c.note}` : ''}
              </li>
            ))}
            {checkins.length === 0 && <li className="text-ice/55">No check-ins yet.</li>}
          </ul>
        </Card>

        {/* event log */}
        <Card title="Event log" action={<ScrollText size={18} className="text-mission-yellow" />}>
          <div className="flex gap-2">
            <input className={inputCls} placeholder="What happened?" value={eventText} onChange={(e) => setEventText(e.target.value)} />
            <button onClick={submitEvent} className="rounded-lg bg-nasa-blue px-4 py-2 text-sm font-semibold text-white">
              Log
            </button>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-ice/80">
            {events.slice(0, 6).map((e) => (
              <li key={e.id}>{fmt(e.createdAt)} · {e.text}</li>
            ))}
            {events.length === 0 && <li className="text-ice/55">No events logged yet.</li>}
          </ul>
        </Card>
      </div>

      {/* outbox */}
      <Card title="Report queue" action={<Send size={18} className="text-mission-yellow" />}>
        <p className="text-sm text-ice/75">
          Queued reports wait here until the connection returns. Queued now:{' '}
          <span className="font-semibold text-white">{queued.length}</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={queueSummary} className="rounded-lg bg-nasa-blue px-4 py-2 text-sm font-semibold text-white">
            Queue summary report
          </button>
          {online && queued.length > 0 && (
            <button
              onClick={async () => { await markOutboxSynced(); refresh() }}
              className="rounded-lg border border-mission-yellow px-4 py-2 text-sm font-semibold text-mission-yellow"
            >
              Sync now (demo)
            </button>
          )}
        </div>
        {online && queued.length > 0 && (
          <p className="mt-2 text-xs text-ice/55">
            Demo sync only. There is no backend endpoint yet, so this just marks reports as synced locally.
          </p>
        )}
      </Card>
    </div>
  )
}