'use client'
import { useEffect, useState } from 'react'
import type { VehicleCard } from '@/lib/data'
import { WaIcon } from './WaIcon'

type Opt = Pick<VehicleCard, 'id' | 'slug' | 'marque' | 'modele' | 'couleur'>
const lab = (v: Opt) => `${v.marque} ${v.modele}${v.couleur ? ` (${v.couleur})` : ''}`

export function BuyForm({ vehicles, whatsapp }: { vehicles: Opt[]; whatsapp: string }) {
  const [veh, setVeh] = useState('')
  const [err, setErr] = useState('')
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<{ text: string; link: string } | null>(null)

  useEffect(() => {
    const pick = () => {
      const s = new URLSearchParams(window.location.search).get('vehicule')
      if (s && vehicles.some((v) => v.slug === s)) setVeh(s)
    }
    pick()
    window.addEventListener('popstate', pick)
    return () => window.removeEventListener('popstate', pick)
  }, [vehicles])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const nom = String(f.get('nom') || '').trim()
    const tel = String(f.get('tel') || '').trim()
    if (!nom || !tel || !veh) return setErr('Merci de remplir les champs marqués d’une étoile.')
    setErr('')
    const v = vehicles.find((x) => x.slug === veh)
    const vehiculeLibelle = v ? lab(v) : 'Autre modèle (voir message)'
    if (String(f.get('site') || '')) return
    const extras = f.getAll('extra').map(String)
    const data = {
      nom,
      telephone: tel,
      email: String(f.get('email') || '') || undefined,
      ville: String(f.get('ville') || '') || undefined,
      vehicule: v?.id,
      vehiculeLibelle,
      paiement: String(f.get('paiement')),
      delai: String(f.get('delai')),
      options: extras.join(', ') || undefined,
      message: String(f.get('msg') || '') || undefined,
    }
    setSending(true)
    try {
      await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    } catch {
      /* la demande part quand même par WhatsApp */
    }
    setSending(false)
    const text = [
      'Bonjour DAROUL CAR, je souhaite faire une demande d’achat.',
      '',
      `Véhicule : ${vehiculeLibelle}`,
      `Nom : ${nom}`,
      `Téléphone : ${tel}`,
      data.email && `E-mail : ${data.email}`,
      data.ville && `Ville : ${data.ville}`,
      `Paiement : ${data.paiement}`,
      `Délai : ${data.delai}`,
      data.options && `Je souhaite aussi : ${data.options}`,
      data.message && `Message : ${data.message}`,
    ]
      .filter((x): x is string => typeof x === "string")
      .join('\n')
    setDone({ text, link: `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}` })
    setTimeout(() => document.getElementById('buyDone')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
  }

  const chip = (name: string, value: string, label: string, type: 'radio' | 'checkbox' = 'radio', checked = false) => (
    <label key={value}>
      <input type={type} name={name} value={value} defaultChecked={checked} />
      <span>{label}</span>
    </label>
  )

  return (
    <form className="buy" onSubmit={submit} noValidate>
      <input type="text" name="site" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
      <label>Nom complet *<input name="nom" required autoComplete="name" placeholder="Prénom et nom" /></label>
      <label>Téléphone / WhatsApp *<input name="tel" required type="tel" autoComplete="tel" placeholder="+225 07 00 00 00 00" /></label>
      <label>E-mail<input name="email" type="email" autoComplete="email" placeholder="facultatif" /></label>
      <label>Ville<input name="ville" placeholder="Abidjan" /></label>
      <label className="full">
        Véhicule souhaité *
        <select value={veh} onChange={(e) => setVeh(e.target.value)} required>
          <option value="">Choisir un véhicule</option>
          {vehicles.map((v) => (
            <option key={v.slug} value={v.slug}>{lab(v)}</option>
          ))}
          <option value="autre">Autre modèle (préciser dans le message)</option>
        </select>
      </label>
      <div className="full">
        <label style={{ marginBottom: 10 }}>Mode de paiement</label>
        <div className="chips">
          {chip('paiement', 'Comptant', 'Comptant', 'radio', true)}
          {chip('paiement', 'Crédit / financement', 'Crédit / financement')}
          {chip('paiement', 'À discuter', 'À discuter')}
        </div>
      </div>
      <div className="full">
        <label style={{ marginBottom: 10 }}>Délai d’achat</label>
        <div className="chips">
          {chip('delai', 'Immédiat', 'Immédiat', 'radio', true)}
          {chip('delai', 'Sous 1 mois', 'Sous 1 mois')}
          {chip('delai', 'Sous 3 mois', 'Sous 3 mois')}
        </div>
      </div>
      <div className="full">
        <label style={{ marginBottom: 10 }}>Je souhaite aussi</label>
        <div className="chips">
          {chip('extra', 'un essai', 'Un essai', 'checkbox')}
          {chip('extra', 'la livraison', 'La livraison', 'checkbox')}
          {chip('extra', 'une reprise de mon véhicule', 'Une reprise', 'checkbox')}
        </div>
      </div>
      <label className="full">Message<textarea name="msg" rows={3} placeholder="Couleur, options, questions…" /></label>
      {err && <div className="full err" style={{ display: 'block' }}>{err}</div>}
      <div className="full">
        <button className="btn solid" type="submit" disabled={sending}>{sending ? 'Envoi…' : 'Préparer ma demande'}</button>
      </div>
      {done && (
        <div className="done" id="buyDone" style={{ display: 'block' }}>
          <h3>Votre demande est prête</h3>
          <pre>{done.text}</pre>
          <a className="btn wa" href={done.link} target="_blank" rel="noopener">
            <WaIcon /> Envoyer sur WhatsApp
          </a>
        </div>
      )}
    </form>
  )
}
