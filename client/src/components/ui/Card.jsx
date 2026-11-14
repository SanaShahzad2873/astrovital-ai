export default function Card({ title, action, children, className = '' }) {
  return (
    <section className={`glass-card p-6 ${className}`}>
      {(title || action) && (
        <header className="mb-5 flex items-center justify-between gap-3">
          {title && (
            <h3 className="text-[16px] font-semibold tracking-tight text-white">{title}</h3>
          )}
          {action}
        </header>
      )}
      {children}
    </section>
  )
}