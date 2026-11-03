import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" ALTER COLUMN "facebook" SET DEFAULT 'https://www.facebook.com/Daroulcar';
  ALTER TABLE "site" ALTER COLUMN "tiktok" SET DEFAULT 'https://www.tiktok.com/@daroulcar';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site" ALTER COLUMN "facebook" DROP DEFAULT;
  ALTER TABLE "site" ALTER COLUMN "tiktok" DROP DEFAULT;`)
}
