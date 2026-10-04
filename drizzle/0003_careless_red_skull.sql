CREATE TABLE IF NOT EXISTS "admin_email_verifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action,
	"new_email" text NOT NULL,
	"otp_hash" text NOT NULL,
	"attempts" integer DEFAULT 0 NOT NULL,
	"max_attempts" integer DEFAULT 5 NOT NULL,
	"resend_available_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"is_consumed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_email_verifications_admin_idx" ON "admin_email_verifications" ("admin_id");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "admin_email_verifications_email_idx" ON "admin_email_verifications" ("new_email");
