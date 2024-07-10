import { pgTable, text } from "drizzle-orm/pg-core";

const admins = pgTable("admins", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role")
    .$type<"admin" | "super_admin" | "staff">()
    .default("staff"),
});

export type tAdminInsertable = typeof admins.$inferInsert;
export type tAdminSelectable = typeof admins.$inferSelect;

export default admins;
