import type { CollectionConfig } from 'payload'

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

export const Vehicles: CollectionConfig = {
  slug: 'vehicles',
  labels: { singular: 'Véhicule', plural: 'Véhicules' },
  admin: {
    useAsTitle: 'titre',
    defaultColumns: ['titre', 'categorie', 'couleur', 'prix', 'enLigne'],
    group: 'Catalogue',
    description: 'Ajoutez, modifiez et mettez en ligne les véhicules de la collection.',
  },
  access: {
    read: ({ req }) => (req.user ? true : { enLigne: { equals: true } }),
  },
  defaultSort: 'ordre',
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data) return data
        data.titre = [data.marque, data.modele, data.couleur ? `(${data.couleur})` : '']
          .filter(Boolean)
          .join(' ')
        if (!data.slug && data.marque && data.modele)
          data.slug = slugify(`${data.marque} ${data.modele} ${data.couleur || ''}`)
        return data
      },
    ],
  },
  fields: [
    { name: 'titre', type: 'text', admin: { hidden: true } },
    {
      type: 'row',
      fields: [
        { name: 'marque', type: 'text', required: true, label: 'Marque' },
        { name: 'modele', type: 'text', required: true, label: 'Modèle' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'categorie',
          type: 'select',
          label: 'Catégorie',
          required: true,
          defaultValue: 'suv',
          options: [
            { label: 'SUV', value: 'suv' },
            { label: 'Berline', value: 'berline' },
            { label: 'Pick-up', value: 'pickup' },
            { label: 'Sportive', value: 'sportive' },
            { label: 'Utilitaire', value: 'utilitaire' },
          ],
        },
        { name: 'couleur', type: 'text', label: 'Couleur' },
        { name: 'annee', type: 'number', label: 'Année' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'prix', type: 'number', label: 'Prix (FCFA)', admin: { description: 'Laisser vide pour afficher « Sur demande ».' } },
        { name: 'enLigne', type: 'checkbox', label: 'En ligne', defaultValue: true },
        { name: 'ordre', type: 'number', label: 'Ordre d’affichage', defaultValue: 100 },
      ],
    },
    { name: 'description', type: 'textarea', label: 'Description' },
    {
      name: 'caracteristiques',
      type: 'array',
      label: 'Caractéristiques',
      labels: { singular: 'Caractéristique', plural: 'Caractéristiques' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'libelle', type: 'text', label: 'Libellé', required: true },
            { name: 'valeur', type: 'text', label: 'Valeur', required: true },
          ],
        },
      ],
    },
    { name: 'couverture', type: 'upload', relationTo: 'media', label: 'Photo de couverture', required: true },
    {
      name: 'galerie',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Galerie (photos et vidéos)',
      admin: { description: 'Glissez-déposez plusieurs fichiers ; l’ordre est celui de la galerie.' },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Adresse de la page',
      admin: { position: 'sidebar', description: 'Générée automatiquement.' },
    },
  ],
}
