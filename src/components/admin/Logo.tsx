/* eslint-disable @next/next/no-img-element */
export function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <img src="/logo.png" alt="DAROUL CAR" style={{ width: 120, height: 'auto' }} />
      <span style={{ letterSpacing: '.3em', fontSize: 11, color: '#d4a74a' }}>ESPACE DE GESTION</span>
    </div>
  )
}
export function Icon() {
  return <img src="/favicon.png" alt="DAROUL CAR" style={{ width: 28, height: 28 }} />
}
