export default function Card({ title, action, children, className = '' }) {
  return (
    <section className={`glass-card p-5 ${className}`}>
      {(title || action) && (
        <header className="mb-4 flex items-center justify-between gap-3">
          {title && <h3 className="text-base font-bold text-white">{title}</h3>}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}