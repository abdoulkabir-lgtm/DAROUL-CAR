# DAROUL CAR — site vitrine et tableau de bord

Site cinématographique (Next.js) avec galerie par véhicule, formulaire de demande d’achat relié à WhatsApp
(+225 07 78 48 30 76) et tableau de bord de mise en ligne (Payload CMS, en français) sur `/admin`.

## Ce que fait le tableau de bord
- **Véhicules** : marque, modèle, catégorie, couleur, prix (vide = « Sur demande »), description, caractéristiques,
  photo de couverture et galerie photos/vidéos. La case **En ligne** publie ou retire le véhicule du site.
- **Demandes d’achat** : chaque formulaire envoyé sur le site arrive ici avec un statut
  (nouveau, contacté, essai prévu, vendu, sans suite), en plus du message WhatsApp du client.
- **Textes & réglages du site** : accroche, vidéo d’accueil, numéro WhatsApp, liens Facebook et TikTok, atouts.

⚠️ Règle : aucune photo ou vidéo ne doit montrer l’enseigne « Ivoire Premium Motors ». La flouter avant import.

## Lancer en local
```bash
cp .env.example .env        # puis remplir PAYLOAD_SECRET, DATABASE_URI, ADMIN_PASSWORD
npm install
npm run seed                # compte admin + 11 véhicules + médias (dossier seed-media/)
npm run dev                 # http://localhost:3000 et http://localhost:3000/admin
```

## Déploiement sur Railway (à valider avant création)
1. Nouveau projet Railway relié au dépôt GitHub.
2. Ajouter un service **PostgreSQL** ; la variable `DATABASE_URL` est fournie automatiquement.
3. Sur le service web, ajouter un **volume** monté sur `/data/media` et définir les variables :
   - `PAYLOAD_SECRET` : longue chaîne aléatoire
   - `MEDIA_DIR=/data/media`
   - `NEXT_PUBLIC_SITE_URL=https://votre-domaine`
   - `NEXT_PUBLIC_WHATSAPP=2250778483076`
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD` (pour le premier `npm run seed`)
4. Build : `npm run build` ; démarrage : `npm run start:prod` (applique les migrations, importe les données de départ si la base est vide, puis lance le site).
5. Relier le nom de domaine dans l’onglet *Settings → Domains*.
