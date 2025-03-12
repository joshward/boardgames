CREATE TABLE "expansions" (
	"id" bigint PRIMARY KEY NOT NULL,
	"game_id" bigint NOT NULL,
	"name" text NOT NULL,
	"year" smallint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" bigint PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"edition_title" text,
	"subtitle" text,
	"description" text NOT NULL,
	"publisher" text NOT NULL,
	"designers" text[] NOT NULL,
	"year" smallint NOT NULL,
	"min_players" smallint NOT NULL,
	"max_players" smallint NOT NULL,
	"playing_time" smallint NOT NULL,
	"rating" real NOT NULL,
	"weight" real NOT NULL,
	"categories" text[] NOT NULL,
	"mechanics" text[] NOT NULL,
	CONSTRAINT "games_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "expansions" ADD CONSTRAINT "expansions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE cascade;