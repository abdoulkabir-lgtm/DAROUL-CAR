'use client'
import { useState } from 'react'
import type { VehicleCard } from '@/lib/data'
import { Lightbox } from './Lightbox'

export function VehicleGallery({ car, whatsapp }: { car: VehicleCard; whatsapp: string }) {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const m = car.media[i]
  return (
    <div>
      <div className="main" onClick={() => setOpen(true)}>
        {m?.type === 'video' ? (
          <video key={m.url} src={m.url} poster={m.poster} autoPlay muted loop playsInline />
        ) : m ? (
          <img src={m.url} alt={m.alt || `${car.marque} ${car.modele}`} />
        ) : null}
      </div>
      <div className="vthumbs">
        {car.media.map((x, k) => (
          <button
            key={k}
            className={k === i ? 'on' : ''}
            onClick={() => setI(k)}
            aria-label={`Média ${k + 1}`}
            style={{ backgroundImage: `url(${x.thumb || x.poster || x.url})` }}
          >
            {x.type === 'video' && <span className="play">▶</span>}
          </button>
        ))}
      </div>
      {open && <Lightbox car={car} start={i} whatsapp={whatsapp} onClose={() => setOpen(false)} />}
    </div>
  )
}
