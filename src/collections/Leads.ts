import type { CollectionConfig } from 'payload'

export const Leads: CollectionConfig = {
  slug: 'leads',
  labels: { singular: 'Demande d’achat', plural: 'Demandes d’achat' },
  admin: {
    useAsTitle: 'nom',
    defaultColumns: ['createdAt', 'nom', 'telephone', 'vehiculeLibelle', 'statut'],
    group: 'Clients',
  },
  access: {
    create: () => true,
    read: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: '-createdAt',
  hooks: {
    beforeValidate: [
      ({ data, req, operation }) => {
        // anti-spam : champ piège rempli uniquement par les robots
        if (operation === 'create' && !req.user && data && (data as Record<string, unknown>).site) {
          throw new Error('Demande refusée')
        }
        if (data) delete (data as Record<string, unknown>).site
        return data
      },
    ],
  },
  fields: [
    {
      name: 'statut',
      type: 'select',
      label: 'Statut',
      defaultValue: 'nouveau',
      options: [
        { label: 'Nouveau', value: 'nouveau' },
        { label: 'Contacté', value: 'contacte' },
        { label: 'Essai prévu', value: 'essai' },
        { label: 'Vendu', value: 'vendu' },
        { label: 'Sans suite', value: 'perdu' },
      ],
      admin: { position: 'sidebar' },
      access: {
        create: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
      },
    },
    {
      type: 'row',
      fields: [
        { name: 'nom', type: 'text', required: true, label: 'Nom' },
        { name: 'telephone', type: 'text', required: true, label: 'Téléphone / WhatsApp' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'email', type: 'email', label: 'E-mail' },
        { name: 'ville', type: 'text', label: 'Ville' },
      ],
    },
    { name: 'vehicule', type: 'relationship', relationTo: 'vehicles', label: 'Véhicule' },
    { name: 'vehiculeLibelle', type: 'text', label: 'Véhicule demandé' },
    {
      type: 'row',
      fields: [
        { name: 'paiement', type: 'text', label: 'Paiement' },
        { name: 'delai', type: 'text', label: 'Délai' },
      ],
    },
    { name: 'options', type: 'text', label: 'Souhaite aussi' },
    { name: 'message', type: 'textarea', label: 'Message' },
  ],
}
