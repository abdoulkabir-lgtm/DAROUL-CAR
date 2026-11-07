import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'
import { WaIcon } from '@/components/WaIcon'
import { getSite } from '@/lib/data'
import { SITE_URL, dealerJsonLd, ldScript } from '@/lib/seo'

const DESC =
  'DAROUL CAR, concessionnaire de véhicules neufs haut de gamme à Abidjan : SUV, pick-up et berlines Toyota, Kia, Hyundai, Changan, Jetour… Prix TTC en FCFA, précommande des arrivages et achat sur WhatsApp.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'DAROUL CAR · Véhicules neufs haut de gamme à Abidjan, Côte d’Ivoire',
    template: '%s · DAROUL CAR',
  },
  description: DESC,
  keywords: [
    'voiture neuve Abidjan',
    'véhicule neuf Côte d’Ivoire',
    'concessionnaire Abidjan',
    'SUV neuf Abidjan',
    'pick-up neuf Côte d’Ivoire',
    'prix voiture neuve FCFA',
    'Toyota Land Cruiser Abidjan',
    'Toyota Hilux neuf',
    'DAROUL CAR',
  ],
  applicationName: 'DAROUL CAR',
  alternates: { canonical: '/' },
  icons: { icon: '/favicon.png', apple: '/favicon.png' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'DAROUL CAR',
    locale: 'fr_CI',
    title: 'DAROUL CAR · Véhicules neufs haut de gamme à Abidjan',
    description: DESC,
    images: [{ url: '/og.jpg', alt: 'DAROUL CAR, véhicules neufs haut de gamme à Abidjan' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
  // Code de validation Google Search Console (méthode « balise HTML »), à renseigner dans Railway si besoin.
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  other: { 'geo.region': 'CI-AB', 'geo.placename': 'Abidjan' },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={ldScript(dealerJsonLd(site))} />
        <Nav />
        {children}
        <footer>
          <div className="logo"><img src="/logo.png" alt="DAROUL CAR, véhicules neufs haut de gamme à Abidjan" style={{ height: 90 }} /></div>
          <div>
            {site.facebook ? <a href={site.facebook} target="_blank" rel="noopener">Facebook</a> : 'Facebook'} ·{' '}
            {site.tiktok ? <a href={site.tiktok} target="_blank" rel="noopener">TikTok</a> : 'TikTok'} · WhatsApp {site.telephone}
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
