import path from 'path'
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Média', plural: 'Médias' },
  admin: { group: 'Catalogue' },
  access: { read: () => true },
  upload: {
    staticDir: path.resolve(process.env.MEDIA_DIR || './media'),
    mimeTypes: ['image/*', 'video/mp4', 'video/quicktime', 'video/webm'],
    imageSizes: [
      { name: 'card', width: 900, height: 600, position: 'centre' },
      { name: 'hd', width: 1800, height: undefined },
    ],
    adminThumbnail: 'card',
    focalPoint: true,
  },
  fields: [
    { name: 'alt', type: 'text', label: 'Texte alternatif (description courte)' },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      label: 'Image d’aperçu (vidéos uniquement)',
      admin: { condition: (data) => Boolean(data?.mimeType?.startsWith('video')) },
    },
  ],
}
