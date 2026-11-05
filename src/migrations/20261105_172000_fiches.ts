import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { FICHES } from '../data/fiches'

// Données : prix et caractéristiques transmis par DAROUL CAR le 05/11/2026.
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const [slug, f] of Object.entries(FICHES)) {
    const { docs } = await payload.find({ collection: 'vehicles', where: { slug: { equals: slug } }, limit: 1, depth: 0, req })
    const v = docs[0]
    if (!v) continue
    await payload.update({
      collection: 'vehicles',
      id: v.id,
      req,
      data: {
        ...(f.modele ? { modele: f.modele } : {}),
        ...(f.annee ? { annee: f.annee } : {}),
        prix: f.prix,
        prixTTC: f.prixTTC,
        caracteristiques: f.caracteristiques,
        marque: v.marque,
        couleur: v.couleur,
        slug: v.slug,
      },
    })
  }
}

export async function down(_: MigrateDownArgs): Promise<void> {}
