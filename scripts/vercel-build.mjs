// Build Vercel : vérifie la configuration, met à jour la base et importe les données de départ
// (production uniquement, pour que les aperçus de branches ne modifient pas la même base en même temps),
// puis construit le site.
// Le compte rendu des étapes base de données est publié dans /journal-build.txt (adresses masquées)
// afin de pouvoir diagnostiquer un échec sans accès au tableau de bord Vercel.
import { spawnSync } from 'node:child_process'
import { writeFileSync } from 'node:fs'

let journal = `Build ${new Date().toISOString()} · ${process.env.VERCEL_ENV || 'local'} · ${process.env.VERCEL_GIT_COMMIT_SHA || ''}\n`
const mask = (t) => t.replace(/\x1b\[[0-9;]*m/g, '').replace(/postgres(ql)?:\/\/[^\s'"]+/g, 'postgres://***').replace(/(token|secret|password)=\S+/gi, '$1=***')

const run = (cmd, env = {}) => {
  console.log(`\n▶ ${cmd}`)
  const r = spawnSync(cmd, { shell: true, encoding: 'utf8', env: { ...process.env, ...env }, maxBuffer: 64 * 1024 * 1024 })
  const out = (r.stdout || '') + (r.stderr || '')
  process.stdout.write(out)
  journal += `\n▶ ${cmd} → code ${r.status}\n` + mask(out).split('\n').slice(-120).join('\n') + '\n'
  return r.status === 0
}
const save = () => writeFileSync('public/journal-build.txt', journal)

if (!run('node scripts/verif-vercel.mjs')) {
  save()
  process.exit(1)
}

const production = !process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production'
if (production) {
  const ok = run('npm run payload migrate', { NODE_ENV: 'production' }) &&
    (run('npm run seed', { NODE_ENV: 'production' }) || run('npm run seed', { NODE_ENV: 'production' }))
  if (!ok) console.log('\n⚠ Étape base de données en échec : voir /journal-build.txt une fois en ligne.')
} else {
  journal += `\nAperçu : base et données de départ laissées telles quelles.\n`
}
save()

const built = run('npm run build')
process.exit(built ? 0 : 1)
