import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { VehicleGallery } from '@/components/VehicleGallery'
import { WaIcon } from '@/components/WaIcon'
import { carLabel, carWaText, getSite, getVehicle } from '@/lib/data'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const car = await getVehicle((await params).slug)
  if (!car) return {}
  const title = `${car.marque} ${car.modele}${car.couleur ? ` ${car.couleur}` : ''} neuf`
  return {
    title,
    description: car.description || `${title} disponible chez DAROUL CAR. Prix : ${car.prixLabel}.`,
    openGraph: { title, images: car.cover ? [car.cover] : undefined },
  }
}

export default async function VehiclePage({ params }: Props) {
  const [car, site] = await Promise.all([getVehicle((await params).slug), getSite()])
  if (!car) notFound()
  const label = carLabel(car)
  const wa = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(carWaText(car))}`
  return (
    <main className="vpage">
      <Link href={car.dispo === 'arrivage' ? '/#arrivages' : '/#collection'} className="back">
        ← {car.dispo === 'arrivage' ? 'Tous les arrivages' : 'Toute la collection'}
      </Link>
      <div className="vhead">
        <VehicleGallery car={car} whatsapp={site.whatsapp} />
        <div className="vinfo">
          <div className="kicker" style={{ opacity: 1, animation: 'none' }}>{car.marque}</div>
          <h1>{car.modele}</h1>
          {car.dispo === 'vendu' && <div className="sold-banner">Vendue</div>}
          {car.dispo === 'arrivage' && <div className="arr-banner">Futur arrivage{car.arrivee ? ` · ${car.arrivee}` : ''} · précommande ouverte</div>}
          {car.dispo !== 'vendu' && <div className="price">{car.prixLabel}</div>}
          <dl>
            <div><dt>État</dt><dd>Neuf · 0 km</dd></div>
            <div><dt>Catégorie</dt><dd>{car.categorieLabel}</dd></div>
            {car.couleur && <div><dt>Couleur</dt><dd>{car.couleur}</dd></div>}
            {car.annee && <div><dt>Année</dt><dd>{car.annee}</dd></div>}
            {car.caracteristiques.filter((c) => !['état', 'etat', 'catégorie', 'couleur', 'année'].includes(c.libelle.trim().toLowerCase())).map((c, k) => (
              <div key={k}><dt>{c.libelle}</dt><dd>{c.valeur}</dd></div>
            ))}
          </dl>
          {car.description && <p className="desc">{car.description}</p>}
          <div className="actions">
            {car.dispo === 'vendu' ? (
              <Link className="btn solid" href="/#collection">Voir les véhicules disponibles</Link>
            ) : (
              <Link className="btn solid" href={`/?vehicule=${car.slug}#demande`}>
                {car.dispo === 'arrivage' ? 'Précommander' : 'Demande d’achat'}
              </Link>
            )}
            <a className="btn wa" href={wa} target="_blank" rel="noopener"><WaIcon /> WhatsApp</a>
          </div>
        </div>
      </div>
    </main>
  )
}
