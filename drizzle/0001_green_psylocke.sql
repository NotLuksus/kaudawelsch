CREATE TABLE "vocabs" (
	"id" serial PRIMARY KEY NOT NULL,
	"dialect" text NOT NULL,
	"meaning" text NOT NULL,
	"user_id" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "vocabs" ADD CONSTRAINT "vocabs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;