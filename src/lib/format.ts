import type { VehicleCard } from './data'

export const carLabel = (c: Pick<VehicleCard, 'marque' | 'modele' | 'couleur'>) =>
  `${c.marque} ${c.modele}${c.couleur ? ` (${c.couleur})` : ''}`

/** Message WhatsApp prérempli selon la disponibilité du véhicule. */
export const carWaText = (c: Pick<VehicleCard, 'marque' | 'modele' | 'couleur' | 'dispo'>) =>
  c.dispo === 'arrivage'
    ? `Bonjour DAROUL CAR, je souhaite précommander le ${carLabel(c)} (futur arrivage).`
    : c.dispo === 'vendu'
      ? `Bonjour DAROUL CAR, j’ai vu que le ${carLabel(c)} est vendu. Avez-vous un modèle similaire disponible ?`
      : `Bonjour DAROUL CAR, je suis intéressé(e) par le ${carLabel(c)}. Est-il disponible ?`
