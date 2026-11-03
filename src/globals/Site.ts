import type { GlobalConfig } from 'payload'

export const Site: GlobalConfig = {
  slug: 'site',
  label: 'Textes & réglages du site',
  admin: { group: 'Réglages' },
  access: { read: () => true },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Accueil',
          fields: [
            { name: 'accroche', type: 'text', label: 'Petit titre', defaultValue: 'Véhicules neufs · Haut de gamme' },
            { name: 'titre1', type: 'text', label: 'Titre ligne 1', defaultValue: 'L’excellence' },
            { name: 'titre2', type: 'text', label: 'Titre ligne 2 (contour doré)', defaultValue: 'en mouvement' },
            {
              name: 'texte',
              type: 'textarea',
              label: 'Texte d’introduction',
              defaultValue:
                'Chaque véhicule DAROUL CAR est présenté comme une œuvre : sélection exclusive, véhicules neufs zéro kilomètre, accompagnement sur mesure.',
            },
            { name: 'videoAccueil', type: 'upload', relationTo: 'media', label: 'Vidéo d’accueil (MP4, 10 s environ)' },
          ],
        },
        {
          label: 'Contact',
          fields: [
            { name: 'whatsapp', type: 'text', label: 'Numéro WhatsApp (format international sans +)', defaultValue: '2250778483076' },
            { name: 'telephoneAffiche', type: 'text', label: 'Numéro affiché', defaultValue: '+225 07 78 48 30 76' },
            { name: 'facebook', type: 'text', label: 'Lien Facebook', defaultValue: 'https://www.facebook.com/Daroulcar' },
            { name: 'tiktok', type: 'text', label: 'Lien TikTok', defaultValue: 'https://www.tiktok.com/@daroulcar' },
          ],
        },
        {
          label: 'Atouts',
          fields: [
            {
              name: 'atouts',
              type: 'array',
              label: 'Pourquoi DAROUL CAR',
              maxRows: 4,
              fields: [
                { name: 'titre', type: 'text', required: true },
                { name: 'texte', type: 'textarea' },
              ],
              defaultValue: [
                { titre: 'Neuf, 0 km', texte: 'Uniquement des véhicules neufs, jamais immatriculés.' },
                { titre: 'Sélection premium', texte: 'SUV, berlines et pick-up choisis un par un.' },
                { titre: 'Contact direct', texte: 'Une question ou un essai : un message WhatsApp suffit.' },
                { titre: 'Accompagnement', texte: 'Un conseiller vous suit de la demande jusqu’à la remise des clés.' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
