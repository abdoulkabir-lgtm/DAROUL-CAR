'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { VehicleCard } from '@/lib/data'
import { Lightbox } from './Lightbox'

export function Collection({
  vehicles,
  whatsapp,
  id = 'collection',
  title = 'La collection',
  intro,
  empty = 'Les véhicules arrivent bientôt.',
}: {
  vehicles: VehicleCard[]
  whatsapp: string
  id?: string
  title?: string
  intro?: React.ReactNode
  empty?: React.ReactNode
}) {
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
    <section id={id}>
      <div className="head">
        <h2>{title}</h2>
        {cats.length > 2 && <div className="filters">
          {cats.map((c) => (
            <button key={c} className={c === filter ? 'on' : ''} onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>}
      </div>
      {intro && <p className="sec-intro">{intro}</p>}
      {shown.length === 0 && <div className="empty">{empty}</div>}
      <div className="grid" ref={grid}>
        {shown.map((v) => (
          <article className={`card ${v.dispo}`} key={v.id} onClick={() => setOpen(v)}>
            <div className="pic">
              <div className="bg" role="img" aria-label={`${v.marque} ${v.modele} ${v.couleur} neuf`.trim()} style={{ background: `url(${v.cover}) center/cover` }} />
              <span className="tag">
                {v.dispo === 'arrivage' ? `Arrivage${v.arrivee ? ` · ${v.arrivee}` : ''}` : `${v.categorieLabel} · Neuf`}
              </span>
              {v.dispo === 'vendu' && <span className="sold">Vendue</span>}
            </div>
            <div className="info">
              <div>
                <small>{v.marque.toUpperCase()}</small>
                <h3>
                  {/* Vrai lien vers la fiche (lu par Google) ; un clic simple ouvre la galerie comme avant. */}
                  <a
                    href={`/vehicules/${v.slug}`}
                    style={{ color: 'inherit', textDecoration: 'none' }}
                    onClick={(e) => {
                      if (!(e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) e.preventDefault()
                      else e.stopPropagation()
                    }}
                  >
                    {v.modele}
                  </a>
                </h3>
              </div>
              <div className="price">
                {v.dispo === 'vendu' ? 'Vendue' : v.prixLabel}
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
