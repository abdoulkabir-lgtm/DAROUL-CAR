import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  compress: true,
  // Une seule adresse pour Google : www.daroulcar.com renvoie vers daroulcar.com.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.daroulcar.com' }],
        destination: 'https://daroulcar.com/:path*',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      // L'adresse technique Railway ne doit pas apparaître dans Google (doublon de daroulcar.com).
      { source: '/:path*', has: [{ type: 'host', value: '.*\\.up\\.railway\\.app' }], headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] },
      // Mise en cache longue des images et vidéos fixes du site (chargement plus rapide).
      { source: '/:file(logo.png|favicon.png|og.jpg|hero.mp4|hero-poster.jpg)', headers: [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }] },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
