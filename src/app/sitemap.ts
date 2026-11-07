import type { MetadataRoute } from 'next'
import { getVehicles } from '@/lib/data'
import { SITE_URL } from '@/lib/seo'

export const dynamic = 'force-dynamic'

// Plan du site pour Google : l'accueil et chaque fiche véhicule en ligne (mis à jour à chaque visite du robot).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let vehicles: Awaited<ReturnType<typeof getVehicles>> = []
  try {
    vehicles = await getVehicles()
  } catch {}
  const latest = vehicles.reduce((d, v) => (v.updatedAt && v.updatedAt > d ? v.updatedAt : d), '')
  return [
    { url: `${SITE_URL}/`, lastModified: latest ? new Date(latest) : new Date(), changeFrequency: 'daily', priority: 1 },
    ...vehicles.map((v) => ({
      url: `${SITE_URL}/vehicules/${v.slug}`,
      lastModified: v.updatedAt ? new Date(v.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: v.dispo === 'vendu' ? 0.3 : 0.8,
      images: v.cover ? [`${SITE_URL}${v.cover}`] : undefined,
    })),
  ]
}
