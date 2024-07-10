import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export default users;

export type tUserInsertable = typeof users.$inferInsert;
export type tUserSelectable = typeof users.$inferSelect;
