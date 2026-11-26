// Build Vercel : vérifie la configuration, met à jour la base et importe les données de départ
// (production uniquement, pour que les aperçus de branches ne modifient pas la même base en même temps),
// puis construit le site.
import { execSync } from 'node:child_process'

const run = (cmd, env = {}) => {
  console.log(`\n▶ ${cmd}`)
  execSync(cmd, { stdio: 'inherit', env: { ...process.env, ...env } })
}

run('node scripts/verif-vercel.mjs')

const production = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
if (production) {
  run('npm run payload migrate', { NODE_ENV: 'production' })
  try {
    run('npm run seed', { NODE_ENV: 'production' })
  } catch {
    console.log('⚠ Import interrompu, nouvelle tentative (il reprend là où il s’est arrêté)…')
    run('npm run seed', { NODE_ENV: 'production' })
  }
} else {
  console.log(`\nAperçu (${process.env.VERCEL_ENV}) : base et données de départ laissées telles quelles.`)
}

run('npm run build')
