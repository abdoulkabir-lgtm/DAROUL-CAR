'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { VehicleCard } from '@/lib/data'
import { Lightbox } from './Lightbox'

export function Collection({ vehicles, whatsapp }: { vehicles: VehicleCard[]; whatsapp: string }) {
  const cats = useMemo(() => ['Tous', ...Array.from(new Set(vehicles.map((v) => v.categorieLabel)))], [vehicles])
  const [filter, setFilter] = useState('Tous')
  const [open, setOpen] = useState<VehicleCard | null>(null)
  const grid = useRef<HTMLDivElement>(null)
  const shown = vehicles.filter((v) => filter === 'Tous' || v.categorieLabel === filter)

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
      { threshold: 0.15 },
    )
    grid.current?.querySelectorAll('.card').forEach((el, k) => {
      ;(el as HTMLElement).style.transitionDelay = `${(k % 3) * 0.12}s`
      io.observe(el)
    })
    return () => io.disconnect()
  }, [filter, vehicles])

  return (
    <section id="collection">
      <div className="head">
        <h2>La collection</h2>
        <div className="filters">
          {cats.map((c) => (
            <button key={c} className={c === filter ? 'on' : ''} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 && <p className="empty">Les véhicules arrivent bientôt.</p>}
      <div className="grid" ref={grid}>
        {shown.map((v) => (
          <article className="card" key={v.id} onClick={() => setOpen(v)}>
            <div className="pic">
              <div className="bg" style={{ background: `url(${v.cover}) center/cover` }} />
              <span className="tag">{v.categorieLabel} · Neuf</span>
            </div>
            <div className="info">
              <div>
                <small>{v.marque.toUpperCase()}</small>
                <h3>{v.modele}</h3>
              </div>
              <div className="price">
                {v.prixLabel}
                <br />
                <small>{v.couleur}</small>
              </div>
            </div>
            <div className="bar" />
          </article>
        ))}
      </div>
      {open && <Lightbox car={open} whatsapp={whatsapp} onClose={() => setOpen(null)} />}
    </section>
  )
}
