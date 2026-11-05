/** Prix et caractéristiques fournis par DAROUL CAR (05/11/2026), indexés par adresse de page. */
type Fiche = {
  modele?: string
  annee?: number
  prix: number
  prixTTC: boolean
  caracteristiques: { libelle: string; valeur: string }[]
}

const hilux: Fiche = {
  modele: 'Hilux SR5',
  prix: 31_500_000,
  prixTTC: true,
  caracteristiques: [
    { libelle: 'Boîte', valeur: 'Manuelle' },
    { libelle: 'Carburant', valeur: 'Diesel' },
  ],
}

export const FICHES: Record<string, Fiche> = {
  'changan-uni-z-blanc': {
    annee: 2026,
    prix: 22_000_000,
    prixTTC: true,
    caracteristiques: [
      { libelle: 'Boîte', valeur: 'Automatique' },
      { libelle: 'Carburant', valeur: 'Essence' },
      { libelle: 'Équipement', valeur: 'Full options' },
    ],
  },
  'foton-tunland-noir': {
    modele: 'Tunland V9',
    prix: 34_500_000,
    prixTTC: true,
    caracteristiques: [
      { libelle: 'Boîte', valeur: 'Automatique' },
      { libelle: 'Carburant', valeur: 'Diesel' },
      { libelle: 'Équipement', valeur: 'Full options' },
    ],
  },
  'toyota-hilux-noir': hilux,
  'toyota-hilux-blanc': hilux,
  'toyota-land-cruiser-300-noir': {
    modele: 'Land Cruiser LC300 VXR',
    prix: 99_500_000,
    prixTTC: true,
    caracteristiques: [
      { libelle: 'Moteur', valeur: 'V6 turbo' },
      { libelle: 'Boîte', valeur: 'Automatique' },
      { libelle: 'Carburant', valeur: 'Essence' },
      { libelle: 'Places', valeur: '7' },
      { libelle: 'Version', valeur: 'Européenne' },
    ],
  },
  'mitsubishi-l200-blanc': {
    prix: 26_500_000,
    prixTTC: true,
    caracteristiques: [
      { libelle: 'Boîte', valeur: 'Manuelle' },
      { libelle: 'Carburant', valeur: 'Diesel' },
      { libelle: 'Équipement', valeur: 'Caméra de recul' },
    ],
  },
  'changan-uni-k-gris': {
    annee: 2026,
    prix: 27_000_000,
    prixTTC: true,
    caracteristiques: [
      { libelle: 'Transmission', valeur: '4x4' },
      { libelle: 'Équipement', valeur: 'Full options' },
    ],
  },
  'jetour-t2-noir': {
    annee: 2025,
    prix: 25_000_000,
    prixTTC: true,
    caracteristiques: [{ libelle: 'Transmission', valeur: '4x2' }],
  },
}
