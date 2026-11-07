import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media, Vehicle, Site } from '@/payload-types'

export type MediaItem = { url: string; type: 'image' | 'video'; poster?: string; thumb?: string; alt?: string }
export type VehicleCard = {
  id: number | string
  slug: string
  marque: string
  modele: string
  couleur: string
  categorie: string
  categorieLabel: string
  prixLabel: string
  prix?: number | null
  updatedAt?: string
  dispo: 'stock' | 'arrivage' | 'vendu'
  arrivee?: string | null
  description: string
  annee?: number | null
  caracteristiques: { libelle: string; valeur: string }[]
  cover: string
  media: MediaItem[]
}

const CAT: Record<string, string> = {
  suv: 'SUV',
  berline: 'Berline',
  pickup: 'Pick-up',
  sportive: 'Sportive',
  utilitaire: 'Utilitaire',
}

export const payloadClient = () => getPayload({ config })

const asMedia = (m: unknown): Media | null => (m && typeof m === 'object' ? (m as Media) : null)

// Adresses relatives : les médias s'affichent quel que soit le domaine (Railway ou daroulcar.com).
const rel = <T extends string | null | undefined>(u: T): T => (u ? (u.replace(/^https?:\/\/[^/]+/, '') as T) : u)

export function toItem(m: unknown): MediaItem | null {
  const r = toItemAbs(m)
  if (!r) return r
  return { ...r, url: rel(r.url), poster: rel(r.poster), thumb: rel(r.thumb) }
}

function toItemAbs(m: unknown): MediaItem | null {
  const d = asMedia(m)
  if (!d?.url) return null
  if (d.mimeType?.startsWith('video')) {
    const p = asMedia(d.poster)
    return { url: d.url, type: 'video', poster: p?.sizes?.hd?.url || p?.url || undefined, thumb: p?.sizes?.card?.url || p?.url || undefined }
  }
  return { url: d.sizes?.hd?.url || d.url, type: 'image', thumb: d.sizes?.card?.url || d.url, alt: d.alt || undefined }
}

export const prixLabel = (p?: number | null, ttc?: boolean | null) =>
  p ? `${new Intl.NumberFormat('fr-FR').format(p).replace(/\u202f|\u00a0/g, '.')} FCFA${ttc ? ' TTC' : ''}` : 'Sur demande'

export function toCard(v: Vehicle): VehicleCard {
  const cover = toItem(v.couverture)
  const gal = (v.galerie || []).map(toItem).filter(Boolean) as MediaItem[]
  const media = cover && !gal.some((g) => g.url === cover.url) ? [cover, ...gal] : gal
  return {
    id: v.id,
    slug: v.slug || String(v.id),
    marque: v.marque,
    modele: v.modele,
    couleur: v.couleur || '',
    categorie: v.categorie,
    categorieLabel: CAT[v.categorie] || v.categorie,
    prixLabel: prixLabel(v.prix, v.prixTTC),
    prix: v.prix,
    updatedAt: v.updatedAt,
    dispo: (v.disponibilite || 'stock') as VehicleCard['dispo'],
    arrivee: v.arrivee,
    description: v.description || '',
    annee: v.annee,
    caracteristiques: (v.caracteristiques || []).map((c) => ({ libelle: c.libelle, valeur: c.valeur })),
    cover: cover?.thumb || cover?.url || '',
    media,
  }
}

export async function getVehicles(): Promise<VehicleCard[]> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'vehicles',
    where: { enLigne: { equals: true } },
    sort: 'ordre',
    depth: 2,
    limit: 200,
  })
  return res.docs.map(toCard)
}

export async function getVehicle(slug: string): Promise<VehicleCard | null> {
  const payload = await payloadClient()
  const res = await payload.find({
    collection: 'vehicles',
    where: { and: [{ slug: { equals: slug } }, { enLigne: { equals: true } }] },
    depth: 2,
    limit: 1,
  })
  return res.docs[0] ? toCard(res.docs[0]) : null
}

export type SiteData = {
  accroche: string
  titre1: string
  titre2: string
  texte: string
  video?: MediaItem | null
  whatsapp: string
  telephone: string
  facebook?: string | null
  tiktok?: string | null
  atouts: { titre: string; texte?: string | null }[]
}

export async function getSite(): Promise<SiteData> {
  const payload = await payloadClient()
  let s: Partial<Site> = {}
  try {
    s = await payload.findGlobal({ slug: 'site', depth: 2 })
  } catch {}
  return {
    accroche: s.accroche || 'Véhicules neufs · Haut de gamme',
    titre1: s.titre1 || 'L’excellence',
    titre2: s.titre2 || 'en mouvement',
    texte: s.texte || '',
    video: toItem(s.videoAccueil),
    whatsapp: s.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP || '2250778483076',
    telephone: s.telephoneAffiche || '+225 07 78 48 30 76',
    facebook: s.facebook || 'https://www.facebook.com/Daroulcar',
    tiktok: s.tiktok || 'https://www.tiktok.com/@daroulcar',
    atouts: (s.atouts || []).map((a) => ({ titre: a.titre, texte: a.texte })),
  }
}

export const waLink = (num: string, text: string) => `https://wa.me/${num}?text=${encodeURIComponent(text)}`

export { carLabel, carWaText } from './format'
