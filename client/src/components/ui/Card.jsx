export default function Card({ title, action, children, className = '' }) {
  return (
    <section
      className={`rounded-xl border border-white/10 bg-panel p-5 shadow-lg shadow-black/20 ${className}`}
    >
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-lg font-bold text-white">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}