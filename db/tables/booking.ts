import {
  date,
  index,
  json,
  pgTable,
  text,
  time,
  unique,
} from "drizzle-orm/pg-core";
import users from "./users";
import venues from "./venues";

export type SlotBookingDetails = {
  game: string; // i.e. Football
  space: string; // i.e. Open Turf
  gameType: string; // i.e. 1v1 | 2v2 | 6v6 | 11v11 | custom
  spaceType: string; // i.e. Indoor | Outdoor
  rate: number; // per hour i.e. Tk. 1000/hr
};

const bookings = pgTable(
  "bookings",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    venueId: text("venue_id")
      .references(() => venues.id, {
        onDelete: "no action",
      })
      .notNull(),
    userId: text("user_id")
      .references(() => users.id, {
        onDelete: "no action",
      })
      .notNull(),
    key: text("key").unique().notNull(), // i.e. 7am-8am:venue_id:game:space:date
    slotDetails: json("slot_details").$type<SlotBookingDetails>().notNull(),
    date: date("date").notNull(),
    status: text("status").$type<"pending" | "booked">().default("pending"), // pending | confirmed | cancelled
    startsAt: time("starts_at").notNull(),
    endsAt: time("ends_at").notNull(),
  },
  // TABLE OPTIONS
  (t) => ({
    uniqueSlotCons: unique("unique_slot_cons").on(t.key, t.startsAt, t.endsAt),

    bookingKeyIndx: index("booking_key_indx").on(t.key),
    bookingDateIndx: index("booking_date_indx").on(t.date),
    bookingByUserIndx: index("booking_by_user_indx").on(t.userId),
    bookingByVenueIndx: index("booking_by_venue_indx").on(t.venueId),
  })
);

export default bookings;

export type tBookingInsertable = typeof bookings.$inferInsert;
export type tBookingSelectable = typeof bookings.$inferSelect;
