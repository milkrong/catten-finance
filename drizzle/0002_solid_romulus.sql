CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"plaid_id" text,
	"name" text NOT NULL,
	"userId" text NOT NULL
);
