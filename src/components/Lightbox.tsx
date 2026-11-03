'use client'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { VehicleCard } from '@/lib/data'
import { WaIcon } from './WaIcon'

export function Lightbox({
  car,
  start = 0,
  whatsapp,
  onClose,
}: {
  car: VehicleCard
  start?: number
  whatsapp: string
  onClose: () => void
}) {
  const n = car.media.length
  const [i, setI] = useState(start)
  const go = useCallback((k: number) => setI(((k % n) + n) % n), [n])
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(i + 1)
      if (e.key === 'ArrowLeft') go(i - 1)
    }
    window.addEventListener('keydown', key)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', key)
    }
  }, [i, go, onClose])
  useEffect(() => {
    if (car.media[i]?.type === 'video') return
    const t = setTimeout(() => go(i + 1), 5500)
    return () => clearTimeout(t)
  }, [i, go, car.media])

  const label = `${car.marque} ${car.modele}${car.couleur ? ` (${car.couleur})` : ''}`
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Bonjour DAROUL CAR, je suis intéressé(e) par le ${label}. Est-il disponible ?`,
  )}`

  return (
    <div className="lb open" role="dialog" aria-modal="true" aria-label={label}>
      <div className="stage">
        {car.media.map((m, k) => (
          <div key={k} className={`slide${k === i ? ' on' : ''}`} style={m.type === 'image' ? { background: `url(${m.url}) center/cover` } : undefined}>
            {m.type === 'video' && k === i && (
              <video src={m.url} poster={m.poster} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
          </div>
        ))}
        <div className="count">
          {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
        </div>
        <button className="close" onClick={onClose}>FERMER ✕</button>
        {n > 1 && (
          <>
            <button className="nav prev" aria-label="Précédent" onClick={() => go(i - 1)}>‹</button>
            <button className="nav next" aria-label="Suivant" onClick={() => go(i + 1)}>›</button>
          </>
        )}
        <div className="meta">
          <div className="kicker" style={{ opacity: 1, animation: 'none' }}>{car.marque}</div>
          <h3>{car.modele}</h3>
          <div className="specs">
            <span>État<b>Neuf · 0 km</b></span>
            {car.couleur && <span>Couleur<b>{car.couleur}</b></span>}
            <span>Catégorie<b>{car.categorieLabel}</b></span>
            <span>Prix<b>{car.prixLabel}</b></span>
          </div>
        </div>
        <div className="cta">
          <Link className="btn" href={`/vehicules/${car.slug}`}>Voir la fiche</Link>
          <Link className="btn solid" href={`/?vehicule=${car.slug}#demande`} onClick={onClose}>Demande d’achat</Link>
          <a className="btn wa" href={wa} target="_blank" rel="noopener"><WaIcon /> WhatsApp</a>
        </div>
      </div>
      <div className="thumbs">
        {car.media.map((m, k) => (
          <div
            key={k}
            className={k === i ? 'on' : ''}
            onClick={() => go(k)}
            style={{ background: `url(${m.type === 'video' ? m.thumb || m.poster || '' : m.thumb || m.url}) center/cover #222` }}
          />
        ))}
      </div>
    </div>
  )
}
