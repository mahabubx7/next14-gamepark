import { pgTable, text } from "drizzle-orm/pg-core";

const games = pgTable("game", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export default games;

export type tGameInsertable = typeof games.$inferInsert;
export type tGameSelectable = typeof games.$inferSelect;
