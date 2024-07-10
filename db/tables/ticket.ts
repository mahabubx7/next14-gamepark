import { sql } from "drizzle-orm";
import {
  date,
  doublePrecision,
  index,
  json,
  pgTable,
  text,
} from "drizzle-orm/pg-core";
import users from "./users";

export type TicketPayment = {
  status: "pending" | "paid" | "cancelled";
  info: Record<string, any> | null;
};

export type GatePass = {
  userId?: string; // foreign key or guest
  token: string; // unique token (custom UID for QR-Code) for gate-pass
  used: boolean; // true if used, default: false
};

const tickets = pgTable(
  "tickets",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bookingIds: text("booking_ids")
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`), // booking ids
    bookedAt: date("booked_at").default(
      new Date(Date.now()).toLocaleDateString()
    ), // the date of this booking
    bookedFor: date("booked_for").notNull(), // the date for which this ticket is booked

    code: text("code").notNull().unique(), // unique code for this ticket
    tokens: json("tokens").$type<GatePass[]>().notNull(), // gate-pass tokens
    time: text("time").notNull(), // time-range of the bookings (slots)
    space: text("space").notNull(), // space name
    game: text("game").notNull(), // game name
    gameType: text("game_type").notNull(), // game type

    cost: doublePrecision("cost").notNull(), // total cost of your bookings
    price: doublePrecision("price").notNull(), // price of this ticket
    payment: json("payment").$type<TicketPayment>().default({
      status: "pending", // pending | paid | cancelled
      info: null, // payment gateway response | null
    }),

    // timestamps
    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").$onUpdateFn(() => new Date().toISOString()),
  },
  (t) => ({
    userIdIndx: index("user_id_indx").on(t.userId),
    codeIndx: index("code_indx").on(t.code),
    bookedForIndx: index("booked_for_indx").on(t.bookedFor),
  })
);

export default tickets;

export type tTicketInsertable = typeof tickets.$inferInsert;
export type tTicketSelectable = typeof tickets.$inferSelect;
