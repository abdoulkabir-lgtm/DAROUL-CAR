import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { fr } from '@payloadcms/translations/languages/fr'
import sharp from 'sharp'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import { dbStorageAdapter } from './lib/dbStorage'
import { createHash } from 'crypto'
import { migrations } from './migrations'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Vehicles } from './collections/Vehicles'
import { Leads } from './collections/Leads'
import { Site } from './globals/Site'

const MEDIA_STORAGE =
  process.env.MEDIA_STORAGE || (process.env.VERCEL ? 'db' : 'local')

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || '',
  admin: {
    user: Users.slug,
    meta: { titleSuffix: ' · DAROUL CAR', icons: [{ rel: 'icon', url: '/favicon.png' }] },
    theme: 'dark',
    avatar: 'default',
    components: {
      graphics: { Logo: '@/components/admin/Logo#Logo', Icon: '@/components/admin/Logo#Icon' },
    },
    importMap: { baseDir: path.resolve(dirname) },
  },
  i18n: { supportedLanguages: { fr }, fallbackLanguage: 'fr' },
  collections: [Vehicles, Leads, Media, Users],
  globals: [Site],
  editor: lexicalEditor(),
  // Sans PAYLOAD_SECRET, on dérive un secret stable de l'adresse (secrète) de la base de données.
  secret:
    process.env.PAYLOAD_SECRET ||
    createHash('sha256')
      .update(process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || '')
      .digest('hex'),
  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL || '',
      max: process.env.VERCEL ? 3 : 10,
    },
    // en production, le schéma de la base est créé/mis à jour par les migrations au démarrage
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    // Où sont rangés les photos et vidéos :
    //  - 'db'    : dans la base Neon (par défaut sur Vercel, aucun réglage nécessaire) ;
    //  - 'blob'  : dans Vercel Blob (MEDIA_STORAGE=blob + BLOB_READ_WRITE_TOKEN) ;
    //  - 'local' : sur le disque, dossier MEDIA_DIR (par défaut hors Vercel).
    cloudStoragePlugin({
      enabled: MEDIA_STORAGE === 'db',
      collections: { media: { adapter: dbStorageAdapter } },
    }),
    vercelBlobStorage({
      enabled: MEDIA_STORAGE === 'blob',
      // adresses directes du Blob (plus rapides que de passer par le serveur)
      collections: { media: { disablePayloadAccessControl: true } },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
      // envoi depuis le navigateur : contourne la limite de 4,5 Mo des requêtes Vercel
      clientUploads: true,
    }),
  ],
})
