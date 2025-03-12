import { pgTable, bigint, text, smallint, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const games = pgTable("games", {
  id: bigint({ mode: "number" }).primaryKey(),

  slug: text().notNull().unique(),
  name: text().notNull(),
  editionTitle: text(),
  subtitle: text(),
  description: text().notNull(),

  publisher: text().notNull(),
  designers: text().array().notNull(),
  year: smallint().notNull(),

  minPlayers: smallint().notNull(),
  maxPlayers: smallint().notNull(),
  playingTime: smallint().notNull(),

  rating: real().notNull(),
  weight: real().notNull(),

  categories: text().array().notNull(),
  mechanics: text().array().notNull(),
});

export const gameRelations = relations(games, ({ many }) => ({
  expansions: many(expansions),
}));

export const expansions = pgTable("expansions", {
  id: bigint({ mode: "number" }).primaryKey(),

  gameId: bigint({ mode: "number" })
    .notNull()
    .references(() => games.id, { onDelete: "cascade", onUpdate: "cascade" }),

  name: text().notNull(),
  year: smallint().notNull(),
});

export const expansionRelations = relations(expansions, ({ one }) => ({
  game: one(games, {
    fields: [expansions.gameId],
    references: [games.id],
  }),
}));
