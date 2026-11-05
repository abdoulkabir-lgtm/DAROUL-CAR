import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Demande DAROUL CAR (05/11/2026) : mention TTC sur tous les prix.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`UPDATE "vehicles" SET "prix_t_t_c" = true;`)
}

export async function down(_: MigrateDownArgs): Promise<void> {}
