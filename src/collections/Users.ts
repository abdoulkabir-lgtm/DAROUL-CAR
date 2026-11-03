import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Administrateur', plural: 'Administrateurs' },
  admin: { useAsTitle: 'email', group: 'Réglages' },
  auth: true,
  fields: [{ name: 'nom', type: 'text', label: 'Nom' }],
}
