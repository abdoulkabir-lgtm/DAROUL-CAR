import { BuyForm } from '@/components/BuyForm'
import { Collection } from '@/components/Collection'
import { WaIcon } from '@/components/WaIcon'
import { getSite, getVehicles } from '@/lib/data'

export default async function Home() {
  const [site, vehicles] = await Promise.all([getSite(), getVehicles()])
  const brands = Array.from(new Set(vehicles.map((v) => v.marque.toUpperCase())))
  return (
    <main className="bars">
      <div className="intro"><img src="/logo.png" alt="" /></div>
      <header className="hero" id="accueil">
        <div className="scene" />
        <video className="herovid" src={site.video?.url || '/hero.mp4'} poster={site.video?.poster || '/hero-poster.jpg'} autoPlay muted loop playsInline />
        <div className="shade" />
        <div className="beam" />
        <div className="copy">
          <div className="kicker">{site.accroche}</div>
          <h1>
            <span>{site.titre1}</span>
            <span>{site.titre2}</span>
          </h1>
          <p>{site.texte}</p>
          <a className="btn" href="#collection">Découvrir la collection</a>
        </div>
        <div className="scroll">DÉFILER</div>
      </header>

      {brands.length > 0 && (
        <div className="marq">
          <div>
            {Array.from({ length: 6 }).flatMap((_, r) =>
              brands.map((b) => (
                <span key={`${r}-${b}`}>
                  {b}
                  <em>◆</em>
                </span>
              )),
            )}
          </div>
        </div>
      )}

      <Collection vehicles={vehicles.filter((v) => v.dispo !== 'arrivage')} whatsapp={site.whatsapp} />

      <Collection
        id="arrivages"
        title="Futurs arrivages"
        vehicles={vehicles.filter((v) => v.dispo === 'arrivage')}
        whatsapp={site.whatsapp}
        intro="Réservez dès maintenant les véhicules en cours d’acheminement : précommandez et soyez servi en priorité à leur arrivée."
        empty={
          <>
            <p>Les prochains arrivages seront annoncés ici très bientôt.</p>
            <a className="btn solid" href="/?vehicule=arrivage-autre#demande">Précommander un modèle</a>
          </>
        }
      />

      {site.atouts.length > 0 && (
        <section>
          <div className="head"><h2>Pourquoi DAROUL CAR</h2></div>
          <div className="why">
            {site.atouts.map((a, k) => (
              <div key={k}>
                <div className="n">{String(k + 1).padStart(2, '0')}</div>
                <h3>{a.titre}</h3>
                {a.texte && <p>{a.texte}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      <section id="demande">
        <div className="wrap">
          <div className="intro-txt">
            <div className="kicker" style={{ opacity: 1, animation: 'none' }}>Demande d’achat</div>
            <h2 style={{ fontSize: 'clamp(44px,6vw,84px)', lineHeight: 0.9 }}>Votre prochain véhicule commence ici</h2>
            <p>
              Indiquez le modèle qui vous intéresse et vos préférences. Votre demande est enregistrée et préparée en un
              message WhatsApp : il ne reste qu’à l’envoyer, un conseiller DAROUL CAR vous répond directement.
            </p>
            <div className="wa-line">
              <WaIcon size={34} color="#25d366" />
              <div><small>WhatsApp DAROUL CAR</small><b>{site.telephone}</b></div>
            </div>
            <p style={{ marginTop: 22 }}>
              <a className="btn wa" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">
                <WaIcon /> Écrire sur WhatsApp
              </a>
            </p>
          </div>
          <BuyForm
            vehicles={vehicles.map(({ id, slug, marque, modele, couleur, dispo, arrivee }) => ({ id, slug, marque, modele, couleur, dispo, arrivee }))}
            whatsapp={site.whatsapp}
          />
        </div>
      </section>
    </main>
  )
}
