ALTER TABLE "admin_users" ADD COLUMN "recovery_email" text DEFAULT 'patilshivam1280@gmail.com' NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "status" text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "last_login_at" timestamp;--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;