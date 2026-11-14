import { useState } from 'react'
import { BookOpen, ExternalLink, AlertTriangle } from 'lucide-react'
import Card from '../components/ui/Card'
import {
  RESEARCH_DOMAINS,
  RESEARCH_ITEMS,
  ACCESS_LABELS,
} from '../data/researchLibrary'

function Field({ label, children }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wider text-ice/55">
        {label}
      </p>
      <p className="mt-0.5 text-sm text-white">{children}</p>
    </div>
  )
}

function ResearchCard({ item }) {
  const isVerified = item.access === 'verified'
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wider text-mission-yellow">
            {item.datasetId ?? 'NO DATASET ID'}
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">
            {item.studyName}
          </h3>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-semibold text-ice">
            NASA_RESEARCH
          </span>
          <span
            className={
              'rounded-full px-2.5 py-1 text-[11px] font-semibold ' +
              (isVerified
                ? 'bg-green-500/15 text-green-400'
                : 'bg-mission-yellow/15 text-mission-yellow')
            }
          >
            {ACCESS_LABELS[item.access]}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field label="Subject type">{item.subjectType}</Field>
        <Field label="Data type">{item.dataType}</Field>
        <div className="sm:col-span-2">
          <Field label="How AstroVital uses it">{item.usedFor}</Field>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-mission-yellow">
          <AlertTriangle size={14} /> Limitations
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ice/80">
          {item.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        {item.sourceUrl ? (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="ac-link inline-flex items-center gap-1.5"
          >
            Open NASA source <ExternalLink size={14} />
          </a>
        ) : (
          <p className="text-xs text-ice/55">Source link not verified yet.</p>
        )}
      </div>
    </div>
  )
}

export default function ResearchLibrary() {
  const [domain, setDomain] = useState('all')
  const items =
    domain === 'all'
      ? RESEARCH_ITEMS
      : RESEARCH_ITEMS.filter((i) => i.domain === domain)

  return (
    <div className="space-y-5">
      <Card title="NASA Research Library" action={<BookOpen size={18} className="text-mission-yellow" />}>
        <p className="text-sm leading-relaxed text-ice/75">
          Scientific context behind AstroVital AI. These are research sources,
          not individual astronaut diagnoses. Every entry lists what the data
          can and cannot be used for.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {RESEARCH_DOMAINS.map((d) => (
            <button
              key={d.key}
              onClick={() => setDomain(d.key)}
              className={
                'rounded-full border px-3.5 py-1.5 text-sm font-medium transition ' +
                (domain === d.key
                  ? 'border-mission-yellow bg-mission-yellow/15 text-mission-yellow'
                  : 'border-white/15 text-ice hover:border-white/30')
              }
            >
              {d.label}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        {items.map((item) => (
          <ResearchCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}