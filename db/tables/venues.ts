import { boolean, index, json, pgTable, text } from "drizzle-orm/pg-core";
import vendors from "./vendors";

export const spaceTypes = ["indoor", "outdoor"] as const;
export const gameTypes = ["1v1", "2v2", "4v4", "11v11", "custom"] as const;
export const weekDays = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const;

export type AvailableGames = {
  name: string; // game name from Games
  types: (typeof gameTypes)[number][];
  spaces: AvailableSpaces[];
  openDays: (typeof weekDays)[number][]; // week-days
};

export type AvailableSpaces = {
  type: (typeof spaceTypes)[number];
  name: string;
  rate: number;
  startsAt: string; // time i.e. 6:00 AM (06:00:00)
  endsAt: string; // time i.e. 9:00 AM (21:00:00)
};

const venues = pgTable(
  "venues",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    ownerId: text("owner_id")
      .notNull()
      .references(() => vendors.id, { onDelete: "no action" }),
    name: text("name").notNull().unique(),
    city: text("city").notNull(),
    address: text("address"),
    approved: boolean("approved").$default(() => false),
    games: json("games").$type<AvailableGames[]>(),
    cover: text("cover").default("venue.png"),

    createdAt: text("created_at").$defaultFn(() => new Date().toISOString()),
    updatedAt: text("updated_at").$onUpdateFn(() => new Date().toISOString()),
  },
  (t) => ({
    venueNameIndx: index("venue_name_indx").on(t.name),
    venueCityIndx: index("venue_city_indx").on(t.city),
    venueApprovedIndx: index("venue_approved_indx").on(t.approved),
  })
);

export default venues;

export type tVenueInsertable = typeof venues.$inferInsert;
export type tVenueSelectable = typeof venues.$inferSelect;
