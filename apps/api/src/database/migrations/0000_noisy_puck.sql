CREATE TABLE "auth_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"google_id" varchar NOT NULL,
	"image" varchar,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone,
	CONSTRAINT "auth_users_email_idx" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "cars" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"brand" varchar NOT NULL,
	"model" varchar NOT NULL,
	"year" integer NOT NULL,
	"kilometers" integer NOT NULL,
	"license_plate" varchar,
	"tank_volume" integer NOT NULL,
	"chassis" varchar,
	"renavam" varchar,
	"user_id" uuid NOT NULL,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
CREATE TABLE "fuel_fill_ups" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"car_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"km" integer NOT NULL,
	"volume" real NOT NULL,
	"price" real NOT NULL,
	"total_price" real NOT NULL,
	"fuel_type" varchar(50) NOT NULL,
	"is_full_tank" boolean DEFAULT false NOT NULL,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
CREATE TABLE "maintenances" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"car_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"km" integer NOT NULL,
	"type" varchar(100) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"local" varchar(255) NOT NULL,
	"created_at" timestamp (2) with time zone DEFAULT now(),
	"updated_at" timestamp (2) with time zone,
	"deleted_at" timestamp (2) with time zone
);
--> statement-breakpoint
ALTER TABLE "cars" ADD CONSTRAINT "cars_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuel_fill_ups" ADD CONSTRAINT "fuel_fill_ups_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fuel_fill_ups" ADD CONSTRAINT "fuel_fill_ups_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_user_id_auth_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."auth_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_car_id_cars_id_fk" FOREIGN KEY ("car_id") REFERENCES "public"."cars"("id") ON DELETE cascade ON UPDATE no action;