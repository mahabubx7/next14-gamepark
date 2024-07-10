CREATE TABLE IF NOT EXISTS "account" (
	"userId" text NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authenticator" (
	"credentialID" text NOT NULL,
	"userId" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"credentialPublicKey" text NOT NULL,
	"counter" integer NOT NULL,
	"credentialDeviceType" text NOT NULL,
	"credentialBackedUp" boolean NOT NULL,
	"transports" text,
	CONSTRAINT "authenticator_userId_credentialID_pk" PRIMARY KEY("userId","credentialID"),
	CONSTRAINT "authenticator_credentialID_unique" UNIQUE("credentialID")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"venue_id" text NOT NULL,
	"user_id" text NOT NULL,
	"key" text NOT NULL,
	"slot_details" json NOT NULL,
	"date" date NOT NULL,
	"status" text DEFAULT 'pending',
	"starts_at" time NOT NULL,
	"ends_at" time NOT NULL,
	CONSTRAINT "bookings_key_unique" UNIQUE("key"),
	CONSTRAINT "unique_slot_cons" UNIQUE("key","starts_at","ends_at")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	CONSTRAINT "game_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tickets" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"booking_ids" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"booked_at" date DEFAULT '7/10/2024',
	"booked_for" date NOT NULL,
	"code" text NOT NULL,
	"tokens" json NOT NULL,
	"time" text NOT NULL,
	"space" text NOT NULL,
	"game" text NOT NULL,
	"game_type" text NOT NULL,
	"cost" double precision NOT NULL,
	"price" double precision NOT NULL,
	"payment" json DEFAULT '{"status":"pending","info":null}'::json,
	"created_at" text,
	"updated_at" text,
	CONSTRAINT "tickets_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"emailVerified" timestamp,
	"image" text,
	"password" text,
	"role" text DEFAULT 'user'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vendors" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"phone" text,
	"address" json NOT NULL,
	"city" text NOT NULL,
	"country" text NOT NULL,
	"games" text[] NOT NULL,
	"approved" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venues" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"city" text NOT NULL,
	"address" text,
	"approved" boolean,
	"games" json,
	"cover" text DEFAULT 'venue.png',
	"created_at" text,
	"updated_at" text,
	CONSTRAINT "venues_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verificationToken" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "authenticator" ADD CONSTRAINT "authenticator_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venues" ADD CONSTRAINT "venues_owner_id_vendors_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_key_indx" ON "bookings" USING btree ("key");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_date_indx" ON "bookings" USING btree ("date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_by_user_indx" ON "bookings" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booking_by_venue_indx" ON "bookings" USING btree ("venue_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_indx" ON "tickets" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "code_indx" ON "tickets" USING btree ("code");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "booked_for_indx" ON "tickets" USING btree ("booked_for");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_name_indx" ON "venues" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_city_indx" ON "venues" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "venue_approved_indx" ON "venues" USING btree ("approved");