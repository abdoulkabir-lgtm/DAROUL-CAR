import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_vehicles_categorie" AS ENUM('suv', 'berline', 'pickup', 'sportive', 'utilitaire');
  CREATE TYPE "public"."enum_leads_statut" AS ENUM('nouveau', 'contacte', 'essai', 'vendu', 'perdu');
  CREATE TABLE "vehicles_caracteristiques" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"libelle" varchar NOT NULL,
  	"valeur" varchar NOT NULL
  );
  
  CREATE TABLE "vehicles" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"marque" varchar NOT NULL,
  	"modele" varchar NOT NULL,
  	"categorie" "enum_vehicles_categorie" DEFAULT 'suv' NOT NULL,
  	"couleur" varchar,
  	"annee" numeric,
  	"prix" numeric,
  	"en_ligne" boolean DEFAULT true,
  	"ordre" numeric DEFAULT 100,
  	"description" varchar,
  	"couverture_id" integer NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "vehicles_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"statut" "enum_leads_statut" DEFAULT 'nouveau',
  	"nom" varchar NOT NULL,
  	"telephone" varchar NOT NULL,
  	"email" varchar,
  	"ville" varchar,
  	"vehicule_id" integer,
  	"vehicule_libelle" varchar,
  	"paiement" varchar,
  	"delai" varchar,
  	"options" varchar,
  	"message" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"poster_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hd_url" varchar,
  	"sizes_hd_width" numeric,
  	"sizes_hd_height" numeric,
  	"sizes_hd_mime_type" varchar,
  	"sizes_hd_filesize" numeric,
  	"sizes_hd_filename" varchar
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"vehicles_id" integer,
  	"leads_id" integer,
  	"media_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_atouts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"accroche" varchar DEFAULT 'Véhicules neufs · Haut de gamme',
  	"titre1" varchar DEFAULT 'L’excellence',
  	"titre2" varchar DEFAULT 'en mouvement',
  	"texte" varchar DEFAULT 'Chaque véhicule DAROUL CAR est présenté comme une œuvre : sélection exclusive, véhicules neufs zéro kilomètre, accompagnement sur mesure.',
  	"video_accueil_id" integer,
  	"whatsapp" varchar DEFAULT '2250778483076',
  	"telephone_affiche" varchar DEFAULT '+225 07 78 48 30 76',
  	"facebook" varchar,
  	"tiktok" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "vehicles_caracteristiques" ADD CONSTRAINT "vehicles_caracteristiques_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_couverture_id_media_id_fk" FOREIGN KEY ("couverture_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "vehicles_rels" ADD CONSTRAINT "vehicles_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vehicles_rels" ADD CONSTRAINT "vehicles_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "leads" ADD CONSTRAINT "leads_vehicule_id_vehicles_id_fk" FOREIGN KEY ("vehicule_id") REFERENCES "public"."vehicles"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_vehicles_fk" FOREIGN KEY ("vehicles_id") REFERENCES "public"."vehicles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_atouts" ADD CONSTRAINT "site_atouts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_video_accueil_id_media_id_fk" FOREIGN KEY ("video_accueil_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "vehicles_caracteristiques_order_idx" ON "vehicles_caracteristiques" USING btree ("_order");
  CREATE INDEX "vehicles_caracteristiques_parent_id_idx" ON "vehicles_caracteristiques" USING btree ("_parent_id");
  CREATE INDEX "vehicles_couverture_idx" ON "vehicles" USING btree ("couverture_id");
  CREATE UNIQUE INDEX "vehicles_slug_idx" ON "vehicles" USING btree ("slug");
  CREATE INDEX "vehicles_updated_at_idx" ON "vehicles" USING btree ("updated_at");
  CREATE INDEX "vehicles_created_at_idx" ON "vehicles" USING btree ("created_at");
  CREATE INDEX "vehicles_rels_order_idx" ON "vehicles_rels" USING btree ("order");
  CREATE INDEX "vehicles_rels_parent_idx" ON "vehicles_rels" USING btree ("parent_id");
  CREATE INDEX "vehicles_rels_path_idx" ON "vehicles_rels" USING btree ("path");
  CREATE INDEX "vehicles_rels_media_id_idx" ON "vehicles_rels" USING btree ("media_id");
  CREATE INDEX "leads_vehicule_idx" ON "leads" USING btree ("vehicule_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "media_poster_idx" ON "media" USING btree ("poster_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hd_sizes_hd_filename_idx" ON "media" USING btree ("sizes_hd_filename");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_vehicles_id_idx" ON "payload_locked_documents_rels" USING btree ("vehicles_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_atouts_order_idx" ON "site_atouts" USING btree ("_order");
  CREATE INDEX "site_atouts_parent_id_idx" ON "site_atouts" USING btree ("_parent_id");
  CREATE INDEX "site_video_accueil_idx" ON "site" USING btree ("video_accueil_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "vehicles_caracteristiques" CASCADE;
  DROP TABLE "vehicles" CASCADE;
  DROP TABLE "vehicles_rels" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_atouts" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TYPE "public"."enum_vehicles_categorie";
  DROP TYPE "public"."enum_leads_statut";`)
}
