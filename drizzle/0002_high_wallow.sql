ALTER TABLE "vocabs" ADD COLUMN "last_reviewed" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabs" ADD COLUMN "next_review" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "vocabs" ADD COLUMN "ease_factor" real DEFAULT 2.5 NOT NULL;--> statement-breakpoint
ALTER TABLE "vocabs" ADD COLUMN "interval" integer DEFAULT 1;