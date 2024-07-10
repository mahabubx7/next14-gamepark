import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import users from "./users";

const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export default sessions;

export type tSessionInsertable = typeof sessions.$inferInsert;
export type tSessionSelectable = typeof sessions.$inferSelect;
