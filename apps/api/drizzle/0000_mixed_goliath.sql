CREATE TYPE "public"."content_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."cost_label" AS ENUM('built_in', 'free', 'freemium', 'paid', 'open_source');--> statement-breakpoint
CREATE TYPE "public"."feedback_review_status" AS ENUM('new', 'reviewed', 'resolved', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."feedback_type" AS ENUM('broken_link', 'outdated', 'unclear', 'accessibility', 'other');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('product', 'support', 'pricing', 'privacy', 'license');--> statement-breakpoint
CREATE TABLE "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(80) NOT NULL,
	"name" varchar(120) NOT NULL,
	"description" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_id" uuid,
	"guide_id" uuid,
	"issue_type" "feedback_type" NOT NULL,
	"message" varchar(1000) NOT NULL,
	"review_status" "feedback_review_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"resolved_at" timestamp with time zone,
	CONSTRAINT "feedback_has_target_check" CHECK ("feedback"."resource_id" is not null or "feedback"."guide_id" is not null)
);
--> statement-breakpoint
CREATE TABLE "guide_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guide_id" uuid NOT NULL,
	"url" text NOT NULL,
	"label" varchar(220) NOT NULL,
	"source_type" "source_type" NOT NULL,
	"checked_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "guide_steps" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guide_id" uuid NOT NULL,
	"position" integer NOT NULL,
	"title" varchar(160) NOT NULL,
	"instruction" text NOT NULL,
	"note" text
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"title" varchar(180) NOT NULL,
	"summary" text NOT NULL,
	"platform" varchar(120) NOT NULL,
	"version_context" text NOT NULL,
	"intro" text NOT NULL,
	"prerequisites" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"undo_steps" text NOT NULL,
	"troubleshooting" text NOT NULL,
	"image_path" text NOT NULL,
	"image_alt" text NOT NULL,
	"resource_id" uuid,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"last_verified_at" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guides_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "resource_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"resource_id" uuid NOT NULL,
	"url" text NOT NULL,
	"label" varchar(220) NOT NULL,
	"source_type" "source_type" NOT NULL,
	"checked_at" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(100) NOT NULL,
	"name" varchar(180) NOT NULL,
	"category_id" uuid NOT NULL,
	"purpose" text NOT NULL,
	"best_for" text NOT NULL,
	"goal_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"platforms" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"cost_label" "cost_label" NOT NULL,
	"cost_details" text NOT NULL,
	"account_requirements" text NOT NULL,
	"privacy_notes" text NOT NULL,
	"accessibility_notes" text NOT NULL,
	"limitations" text NOT NULL,
	"quick_start" text NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"last_verified_at" date NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "resources_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_sources" ADD CONSTRAINT "guide_sources_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guide_steps" ADD CONSTRAINT "guide_steps_guide_id_guides_id_fk" FOREIGN KEY ("guide_id") REFERENCES "public"."guides"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "guides" ADD CONSTRAINT "guides_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resource_sources" ADD CONSTRAINT "resource_sources_resource_id_resources_id_fk" FOREIGN KEY ("resource_id") REFERENCES "public"."resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "resources" ADD CONSTRAINT "resources_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "feedback_review_status_idx" ON "feedback" USING btree ("review_status","created_at");--> statement-breakpoint
CREATE INDEX "guide_sources_guide_idx" ON "guide_sources" USING btree ("guide_id");--> statement-breakpoint
CREATE UNIQUE INDEX "guide_steps_position_unique" ON "guide_steps" USING btree ("guide_id","position");--> statement-breakpoint
CREATE INDEX "guide_steps_guide_idx" ON "guide_steps" USING btree ("guide_id");--> statement-breakpoint
CREATE INDEX "guides_status_idx" ON "guides" USING btree ("status");--> statement-breakpoint
CREATE INDEX "resource_sources_resource_idx" ON "resource_sources" USING btree ("resource_id");--> statement-breakpoint
CREATE INDEX "resources_category_status_idx" ON "resources" USING btree ("category_id","status");--> statement-breakpoint
CREATE INDEX "resources_cost_status_idx" ON "resources" USING btree ("cost_label","status");