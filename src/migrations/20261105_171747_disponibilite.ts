import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vehicles_disponibilite" AS ENUM('stock', 'arrivage', 'vendu');
  CREATE TYPE "public"."enum_leads_type" AS ENUM('achat', 'precommande');
  ALTER TABLE "vehicles" ADD COLUMN "prix_t_t_c" boolean DEFAULT true;
  ALTER TABLE "vehicles" ADD COLUMN "disponibilite" "enum_vehicles_disponibilite" DEFAULT 'stock' NOT NULL;
  ALTER TABLE "vehicles" ADD COLUMN "arrivee" varchar;
  ALTER TABLE "leads" ADD COLUMN "type" "enum_leads_type" DEFAULT 'achat';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "vehicles" DROP COLUMN "prix_t_t_c";
  ALTER TABLE "vehicles" DROP COLUMN "disponibilite";
  ALTER TABLE "vehicles" DROP COLUMN "arrivee";
  ALTER TABLE "leads" DROP COLUMN "type";
  DROP TYPE "public"."enum_vehicles_disponibilite";
  DROP TYPE "public"."enum_leads_type";`)
}
