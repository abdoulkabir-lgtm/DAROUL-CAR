import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { WaIcon } from '@/components/WaIcon'
import { getSite } from '@/lib/data'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'DAROUL CAR · Véhicules neufs haut de gamme', template: '%s · DAROUL CAR' },
  description:
    'DAROUL CAR : SUV, berlines et pick-up neufs, haut de gamme. Découvrez la collection et faites votre demande d’achat sur WhatsApp.',
  icons: { icon: '/favicon.png' },
  openGraph: { images: ['/og.jpg'], locale: 'fr_CI', siteName: 'DAROUL CAR' },
}

export const dynamic = 'force-dynamic'

export default async function FrontLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;600&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Nav />
        {children}
        <footer>
          <div className="logo"><img src="/logo.png" alt="DAROUL CAR" style={{ height: 90 }} /></div>
          <div>
            {site.facebook ? <a href={site.facebook}>Facebook</a> : 'Facebook'} ·{' '}
            {site.tiktok ? <a href={site.tiktok}>TikTok</a> : 'TikTok'} · WhatsApp {site.telephone}
          </div>
          <div>© {new Date().getFullYear()} DAROUL CAR</div>
        </footer>
        <a className="fab" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" aria-label="Contacter DAROUL CAR sur WhatsApp">
          <WaIcon size={32} color="#fff" />
        </a>
      </body>
    </html>
  )
}
