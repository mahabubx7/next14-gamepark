import db, { venues } from "..";
import { tVenueInsertable } from "../types";

const table = "venues";

const data: tVenueInsertable[] = [
  {
    name: "NDE Sports Facility",
    city: "Dhaka",
    address: "Road 5, Block G, Bashundhara",
    approved: true, // default is falses @demo-only
    cover: "https://i.ibb.co/nLsXWKf/image.png",
    games: [
      {
        name: "Football",
        types: ["custom"],
        spaces: [
          {
            type: "indoor",
            name: "Open Roof",
            rate: 100,
            startsAt: "06:00:00", // opens at 6:00 AM
            endsAt: "21:00:00", // closes at 9:00 PM
          },
        ],
        openDays: ["wed", "thu", "fri"],
      },
      {
        name: "Cricket",
        types: ["custom"],
        spaces: [
          {
            type: "outdoor",
            name: "Open Roof",
            rate: 75,
            startsAt: "08:00:00", // opens at 8:00 AM
            endsAt: "17:00:00", // closes at 5:00 PM
          },
        ],
        openDays: ["sun", "mon", "thu"],
      },
    ],
  },
  {
    name: "Metroplex Sports",
    city: "Dhaka",
    address: "300 feet road, Khilkhet",
    approved: true, // default is falses @demo-only
    cover: "https://i.ibb.co/rQsCwSq/image.png",
    games: [
      {
        name: "Football",
        types: ["custom"],
        spaces: [
          {
            type: "indoor",
            name: "Turf Ground",
            rate: 100,
            startsAt: "06:00:00", // opens at 6:00 AM
            endsAt: "21:00:00", // closes at 9:00 PM
          },
        ],
        openDays: ["tue", "wed", "thu"],
      },
      {
        name: "Badminton",
        types: ["1v1", "2v2"],
        spaces: [
          {
            type: "indoor",
            name: "Roof A",
            rate: 150,
            startsAt: "06:00:00", // opens at 6:00 AM
            endsAt: "21:00:00", // closes at 9:00 PM
          },
          {
            type: "indoor",
            name: "Roof B",
            rate: 100,
            startsAt: "09:00:00", // opens at 9:00 AM
            endsAt: "18:00:00", // closes at 6:00 PM
          },
        ],
        openDays: ["sun", "mon", "tue", "wed", "thu"],
      },
    ],
  },
];

export const venuesSeeder = async () => {
  console.log(`Seed starts for: ${table} ...`);
  await db.insert(venues).values(data);
  console.log(`=> Seed done for: ${table}!`);
};
