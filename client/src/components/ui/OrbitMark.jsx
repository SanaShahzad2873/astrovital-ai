export default function OrbitMark({ size = 40, className = '' }) {
  return (
    <img
      src="/logo-mark.png"
      alt="AstroVital AI"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain' }}
    />
  )
}