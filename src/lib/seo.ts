import type { SiteData, VehicleCard } from './data'

/** Adresse publique du site, sans « / » final (variable NEXT_PUBLIC_SITE_URL sur Railway). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://daroulcar.com').replace(/\/$/, '')

export const abs = (path: string) => (/^https?:\/\//.test(path) ? path : `${SITE_URL}${path.startsWith('/') ? '' : '/'}${path}`)

/** Fiche « concessionnaire » lue par Google (données structurées schema.org AutoDealer). */
export function dealerJsonLd(site: SiteData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutoDealer',
    '@id': `${SITE_URL}/#concession`,
    name: 'DAROUL CAR',
    description: 'Vente de véhicules neufs haut de gamme à Abidjan : SUV, pick-up et berlines, prix TTC, commande sur WhatsApp.',
    url: SITE_URL,
    logo: abs('/logo.png'),
    image: abs('/og.jpg'),
    telephone: site.telephone.replace(/\s/g, ''),
    priceRange: 'FCFA',
    currenciesAccepted: 'XOF',
    address: { '@type': 'PostalAddress', addressLocality: 'Abidjan', addressCountry: 'CI' },
    areaServed: { '@type': 'Country', name: 'Côte d’Ivoire' },
    sameAs: [site.facebook, site.tiktok].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: site.telephone.replace(/\s/g, ''),
      contactType: 'sales',
      areaServed: 'CI',
      availableLanguage: ['French'],
    },
  }
}

const AVAILABILITY: Record<VehicleCard['dispo'], string> = {
  stock: 'https://schema.org/InStock',
  arrivage: 'https://schema.org/PreOrder',
  vendu: 'https://schema.org/SoldOut',
}

/** Fiche « véhicule » (schema.org Car + offre) : prix, disponibilité, photos. */
export function carJsonLd(car: VehicleCard) {
  const url = abs(`/vehicules/${car.slug}`)
  const images = car.media.filter((m) => m.type === 'image').map((m) => abs(m.url))
  if (car.cover && !images.length) images.push(abs(car.cover))
  return {
    '@context': 'https://schema.org',
    '@type': 'Car',
    '@id': `${url}#vehicule`,
    name: `${car.marque} ${car.modele}${car.couleur ? ` ${car.couleur}` : ''}`,
    brand: { '@type': 'Brand', name: car.marque },
    model: car.modele,
    url,
    image: images.slice(0, 10),
    description: car.description || undefined,
    color: car.couleur || undefined,
    vehicleModelDate: car.annee ? String(car.annee) : undefined,
    itemCondition: 'https://schema.org/NewCondition',
    bodyType: car.categorieLabel,
    mileageFromOdometer: { '@type': 'QuantitativeValue', value: 0, unitCode: 'KMT' },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'XOF',
      price: car.prix || undefined,
      availability: AVAILABILITY[car.dispo],
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${SITE_URL}/#concession` },
      areaServed: 'CI',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, k) => ({ '@type': 'ListItem', position: k + 1, name: it.name, item: abs(it.path) })),
  }
}

/** Balise <script type="application/ld+json"> sûre (échappe « < »). */
export const ldScript = (data: unknown) => ({ __html: JSON.stringify(data).replace(/</g, '\\u003c') })
