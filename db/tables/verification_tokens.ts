import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
);

export default verificationTokens;

export type tVerificationTokenInsertable =
  typeof verificationTokens.$inferInsert;
export type tVerificationTokenSelectable =
  typeof verificationTokens.$inferSelect;
