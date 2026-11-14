import { Loader2, TriangleAlert, Inbox } from 'lucide-react'

export function LoadingState({ text = 'Loading mission data…' }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-ice" role="status">
      <Loader2 className="animate-spin" size={20} />
      {text}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl border border-status-risk/40 bg-status-risk/10 p-6 text-center">
      <TriangleAlert className="mx-auto mb-2 text-status-risk" />
      <p className="text-sm text-white">{message ?? 'Could not load data.'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-lg bg-nasa-blue px-4 py-2 text-sm font-semibold text-white hover:bg-nasa-blue/80"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ text = 'No records available.' }) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-ice/70">
      <Inbox />
      <p className="text-sm">{text}</p>
    </div>
  )
}