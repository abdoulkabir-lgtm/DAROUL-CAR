/**
 * Stockage des photos et vidéos dans la base Postgres (Neon).
 * Utilisé sur Vercel, où le disque est éphémère, tant qu'aucun stockage Blob n'est choisi.
 * Les fichiers sont servis par /api/media/file/<nom>, avec prise en charge des requêtes
 * partielles (Range) pour la lecture des vidéos sur téléphone.
 */
import pg from 'pg'
import type { Adapter } from '@payloadcms/plugin-cloud-storage/types'

let pool: pg.Pool | null = null
let ready: Promise<void> | null = null

const getPool = () => {
  if (!pool) {
    pool = new pg.Pool({
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL || process.env.POSTGRES_URL,
      max: 2,
    })
  }
  return pool
}

const ensureTable = () => {
  if (!ready) {
    ready = getPool()
      .query(
        `CREATE TABLE IF NOT EXISTS media_files (
          collection text NOT NULL,
          filename text NOT NULL,
          mime_type text,
          size integer NOT NULL,
          data bytea NOT NULL,
          updated_at timestamptz NOT NULL DEFAULT now(),
          PRIMARY KEY (collection, filename)
        )`,
      )
      .then(() => undefined)
      .catch((e) => {
        ready = null
        throw e
      })
  }
  return ready
}

const CACHE = 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400'
const MAX_CHUNK = 3 * 1024 * 1024 // reste sous la limite de réponse des fonctions Vercel

export const dbStorageAdapter: Adapter = ({ collection }) => ({
  name: 'postgres',
  onInit: () => {
    void ensureTable().catch(() => {})
  },
  handleUpload: async ({ file }) => {
    await ensureTable()
    await getPool().query(
      `INSERT INTO media_files (collection, filename, mime_type, size, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, now())
       ON CONFLICT (collection, filename)
       DO UPDATE SET mime_type = EXCLUDED.mime_type, size = EXCLUDED.size, data = EXCLUDED.data, updated_at = now()`,
      [collection.slug, file.filename, file.mimeType, file.buffer.length, file.buffer],
    )
  },
  handleDelete: async ({ filename }) => {
    await ensureTable()
    await getPool().query('DELETE FROM media_files WHERE collection = $1 AND filename = $2', [collection.slug, filename])
  },
  staticHandler: async (req, { params }) => {
    await ensureTable()
    const meta = await getPool().query<{ mime_type: string | null; size: number; updated_at: Date }>(
      'SELECT mime_type, size, updated_at FROM media_files WHERE collection = $1 AND filename = $2',
      [collection.slug, params.filename],
    )
    const row = meta.rows[0]
    if (!row) return new Response('Fichier introuvable', { status: 404 })

    const etag = `"${row.size}-${new Date(row.updated_at).getTime()}"`
    const headers = new Headers({
      'Content-Type': row.mime_type || 'application/octet-stream',
      'Cache-Control': CACHE,
      'Accept-Ranges': 'bytes',
      ETag: etag,
    })
    if (req.headers?.get('if-none-match') === etag) return new Response(null, { status: 304, headers })

    const range = req.headers?.get('range')
    const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim())
    let start = 0
    let end = row.size - 1
    let partial = false
    if (m && (m[1] || m[2])) {
      partial = true
      if (m[1]) {
        start = Number(m[1])
        end = m[2] ? Math.min(Number(m[2]), row.size - 1) : row.size - 1
      } else {
        start = Math.max(0, row.size - Number(m[2]))
      }
      if (start >= row.size || start > end) {
        headers.set('Content-Range', `bytes */${row.size}`)
        return new Response(null, { status: 416, headers })
      }
      end = Math.min(end, start + MAX_CHUNK - 1)
    }
    const len = end - start + 1
    const data = await getPool().query<{ chunk: Buffer }>(
      'SELECT substring(data FROM $3 FOR $4) AS chunk FROM media_files WHERE collection = $1 AND filename = $2',
      [collection.slug, params.filename, start + 1, len],
    )
    const chunk = data.rows[0]?.chunk
    if (!chunk) return new Response('Fichier introuvable', { status: 404 })
    headers.set('Content-Length', String(chunk.length))
    if (partial) headers.set('Content-Range', `bytes ${start}-${start + chunk.length - 1}/${row.size}`)
    return new Response(new Uint8Array(chunk), { status: partial ? 206 : 200, headers })
  },
})
