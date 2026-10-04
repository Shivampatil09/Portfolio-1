CREATE TABLE "about_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"story_paragraphs" jsonb NOT NULL,
	"bio_highlight" text NOT NULL,
	"years_of_experience" text DEFAULT 'Fresher',
	"projects_completed" text DEFAULT '10+ Projects',
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"issuer" text NOT NULL,
	"issue_date" text NOT NULL,
	"credential_url" text,
	"credential_id" text,
	"certificate_file_url" text,
	"file_type" text DEFAULT 'image',
	"description" text,
	"badge_icon" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"ip_address" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_archived" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "education" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"degree" text NOT NULL,
	"institution" text NOT NULL,
	"location" text,
	"start_year" text NOT NULL,
	"end_year" text NOT NULL,
	"grade" text,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "experience" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text NOT NULL,
	"company" text NOT NULL,
	"location" text NOT NULL,
	"start_date" text NOT NULL,
	"end_date" text NOT NULL,
	"is_current" boolean DEFAULT false NOT NULL,
	"responsibilities" jsonb NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hero_profile" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"full_name" text DEFAULT 'Shivam Patil' NOT NULL,
	"headline" text DEFAULT '.NET Full Stack Developer' NOT NULL,
	"sub_headline" text DEFAULT 'Building high-performance enterprise applications with ASP.NET Core & Modern React' NOT NULL,
	"summary" text DEFAULT 'Passionate .NET Full Stack Engineer specializing in clean architecture, high-throughput REST APIs, C#, .NET 8, React, and SQL Server.' NOT NULL,
	"profile_image_url" text,
	"email" text DEFAULT 'patilshivam1280@gmail.com',
	"phone" text,
	"location" text DEFAULT 'Pune, Maharashtra, India',
	"availability_status" text DEFAULT 'Typically within 24 hours',
	"primary_cta_text" text DEFAULT 'Work With Me' NOT NULL,
	"cta_link" text DEFAULT '/contact' NOT NULL,
	"github_url" text DEFAULT 'https://github.com/Shivampatil09' NOT NULL,
	"linkedin_url" text DEFAULT 'https://www.linkedin.com/in/shivampatil9' NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"short_description" text NOT NULL,
	"full_description" text,
	"image_url" text,
	"tech_stack" jsonb NOT NULL,
	"github_url" text,
	"live_demo_url" text,
	"is_featured" boolean DEFAULT true NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resume" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"pdf_url" text,
	"title" text DEFAULT 'Shivam Patil - .NET Full Stack Developer Resume' NOT NULL,
	"summary" text,
	"original_file_name" text,
	"display_file_name" text DEFAULT 'Shivam_Patil_Resume.pdf',
	"file_size" integer,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"category" text NOT NULL,
	"name" text NOT NULL,
	"icon" text,
	"proficiency_label" text DEFAULT 'Advanced',
	"is_featured" boolean DEFAULT false NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
