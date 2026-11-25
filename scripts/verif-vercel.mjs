// Vérifie, avant le build Vercel, que la base de données et le stockage photos sont branchés.
const manque = []
if (!(process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL))
  manque.push('Base de données Neon non connectée : projet Vercel > onglet Storage > Neon > Connect')
if (!process.env.BLOB_READ_WRITE_TOKEN)
  manque.push('Stockage photos Blob non connecté : projet Vercel > onglet Storage > Blob > Connect')
if (!process.env.PAYLOAD_SECRET)
  manque.push('Variable PAYLOAD_SECRET absente : Settings > Environment Variables')
if (manque.length) {
  console.error('\n❌ DAROUL CAR — configuration incomplète :\n' + manque.map((m) => '   • ' + m).join('\n') + '\n')
  process.exit(1)
}
console.log('✓ Base de données, stockage photos et secret présents.')
