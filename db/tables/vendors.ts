import { boolean, json, pgTable, text } from "drizzle-orm/pg-core";

const vendors = pgTable("vendors", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull(),
  phone: text("phone"),
  address: json("address")
    .$type<{
      line_1: string;
      line_2?: string;
    }>()
    .notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  games: text("games").array().notNull(),
  approved: boolean("approved").notNull().default(false),
});

export type tVendorInsertable = typeof vendors.$inferInsert;
export type tVendorSelectable = typeof vendors.$inferSelect;

export default vendors;
