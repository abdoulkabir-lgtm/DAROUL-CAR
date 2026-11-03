/**
 * Données de départ : crée le compte admin, importe les photos/vidéos (déjà floutées)
 * du dossier seed-media/ et crée les 11 véhicules de la collection.
 * Usage : npm run seed   (ADMIN_EMAIL / ADMIN_PASSWORD dans .env)
 * Le script ne fait rien si des véhicules existent déjà.
 */
import path from 'path'
import { getPayload } from 'payload'
import config from '@payload-config'

const DIR = path.resolve(process.cwd(), 'seed-media')

type V = { marque: string; modele: string; categorie: string; couleur: string; files: string[]; description: string }

const VEHICULES: V[] = [
  { marque: 'Toyota', modele: 'Land Cruiser 300', categorie: 'suv', couleur: 'Noir', files: ['toyota-lc300-1.jpg','toyota-lc300-2.jpg','toyota-lc300-3.jpg','toyota-lc300-4.jpg','toyota-lc300-5.jpg','toyota-lc300-6.jpg'], description: 'Le grand SUV de référence : présence, robustesse et confort haut de gamme pour la ville comme pour les longues routes.' },
  { marque: 'Jetour', modele: 'T2', categorie: 'suv', couleur: 'Noir', files: ['jetour-t2-1.jpg','jetour-t2-5.jpg','jetour-t2-6.jpg','jetour-t2-7.jpg','jetour-t2-8.jpg','jetour-t2-2.jpg','jetour-t2-3.jpg','jetour-t2-4.jpg'], description: 'Un baroudeur au style affirmé, pensé pour l’aventure, avec un intérieur moderne et généreux.' },
  { marque: 'Changan', modele: 'UNI-K', categorie: 'suv', couleur: 'Gris', files: ['changan-unik-1.jpg','changan-unik-2.jpg','changan-unik-3.jpg','changan-unik-4.jpg','changan-unik-5.jpg','changan-unik-6.jpg'], description: 'Un SUV au design spectaculaire, spacieux et richement équipé.' },
  { marque: 'Changan', modele: 'UNI-Z', categorie: 'suv', couleur: 'Blanc', files: ['changan-uniz-1.jpg','changan-uniz-v2.mp4','changan-uniz-v.mp4','changan-uniz-2.jpg','changan-uniz-3.jpg','changan-uniz-4.jpg'], description: 'Lignes élégantes, calandre sans cadre et habitacle technologique.' },
  { marque: 'Kia', modele: 'Sportage', categorie: 'suv', couleur: 'Gris', files: ['kia-sportage-1.jpg','kia-sportage-v2.mp4','kia-sportage-v.mp4','kia-sportage-2.jpg','kia-sportage-3.jpg','kia-sportage-4.jpg'], description: 'Le SUV familial polyvalent, au design moderne et à l’équipement complet.' },
  { marque: 'Kia', modele: 'Seltos', categorie: 'suv', couleur: 'Blanc', files: ['kia-seltos-1.jpg','kia-seltos-2.jpg','kia-seltos-3.jpg'], description: 'Compact, agile et bien équipé : le SUV idéal en ville.' },
  { marque: 'Hyundai', modele: 'Tucson L', categorie: 'suv', couleur: 'Noir', files: ['hyundai-tucson-1.jpg','hyundai-tucson-2.jpg','hyundai-tucson-3.jpg','hyundai-tucson-4.jpg'], description: 'Version longue du Tucson : plus d’espace, même signature lumineuse.' },
  { marque: 'Toyota', modele: 'Hilux', categorie: 'pickup', couleur: 'Noir', files: ['toyota-hilux-1.jpg','toyota-hilux-2.jpg','toyota-hilux-3.jpg','toyota-hilux-4.jpg','toyota-hilux-v.mp4'], description: 'Le pick-up indestructible, prêt pour le travail comme pour la route.' },
  { marque: 'Toyota', modele: 'Hilux', categorie: 'pickup', couleur: 'Blanc', files: ['toyota-hilux-blanc-1.jpg','toyota-hilux-blanc-2.jpg'], description: 'Le pick-up indestructible, prêt pour le travail comme pour la route.' },
  { marque: 'Foton', modele: 'Tunland', categorie: 'pickup', couleur: 'Noir', files: ['foton-tunland-3.jpg','foton-tunland-4.jpg','foton-tunland-1.jpg','foton-tunland-2.jpg','foton-tunland-v.mp4'], description: 'Un pick-up robuste et moderne au rapport équipement-prix remarquable.' },
  { marque: 'Mitsubishi', modele: 'L200', categorie: 'pickup', couleur: 'Blanc', files: ['mitsubishi-l200-1.jpg','mitsubishi-l200-2.jpg','mitsubishi-l200-3.jpg','mitsubishi-l200-v.mp4'], description: 'Fiable et endurant, le L200 encaisse tous les terrains.' },
]

const payload = await getPayload({ config })

const { totalDocs } = await payload.count({ collection: 'vehicles' })
if (totalDocs > 0) {
  payload.logger.info(`Déjà ${totalDocs} véhicule(s) : rien à faire.`)
  process.exit(0)
}

const email = process.env.ADMIN_EMAIL || 'admin@daroulcar.ci'
const password = process.env.ADMIN_PASSWORD || 'changez-moi-daroul'
const users = await payload.find({ collection: 'users', where: { email: { equals: email } }, limit: 1 })
if (!users.docs.length) {
  await payload.create({ collection: 'users', data: { email, password, nom: 'Administrateur' } })
  payload.logger.info(`Compte admin créé : ${email}`)
}

async function upload(file: string, alt: string): Promise<number> {
  let poster: number | undefined
  if (file.endsWith('.mp4')) {
    const p = await payload.create({ collection: 'media', data: { alt: `${alt} (aperçu vidéo)` }, filePath: path.join(DIR, file.replace('.mp4', '-poster.jpg')) })
    poster = p.id as number
  }
  const doc = await payload.create({ collection: 'media', data: { alt, ...(poster ? { poster } : {}) }, filePath: path.join(DIR, file) })
  return doc.id as number
}

let ordre = 10
for (const v of VEHICULES) {
  const alt = `${v.marque} ${v.modele} ${v.couleur}`
  const ids: number[] = []
  for (const f of v.files) ids.push(await upload(f, alt))
  await payload.create({
    collection: 'vehicles',
    data: {
      marque: v.marque,
      modele: v.modele,
      categorie: v.categorie as 'suv',
      couleur: v.couleur,
      description: v.description,
      enLigne: true,
      ordre,
      couverture: ids[0],
      galerie: ids,
    },
  })
  payload.logger.info(`✓ ${alt}`)
  ordre += 10
}

const heroPoster = await payload.create({ collection: 'media', data: { alt: 'DAROUL CAR' }, filePath: path.join(DIR, 'hero-poster.jpg') })
const hero = await payload.create({ collection: 'media', data: { alt: 'DAROUL CAR', poster: heroPoster.id }, filePath: path.join(DIR, 'hero.mp4') })
await payload.updateGlobal({ slug: 'site', data: { videoAccueil: hero.id } })

payload.logger.info('Données de départ importées.')
process.exit(0)
