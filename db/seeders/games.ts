import db from "..";
import { games } from "../tables";
import { tGameInsertable } from "../types";

const table = "games";

const data: tGameInsertable[] = [
  { name: "Badminton" },
  { name: "Padel" },
  { name: "Tennis" },
  { name: "Table Tennis" },
  { name: "Football" },
  { name: "Cricket" },
];

export const gamesSeeder = async () => {
  console.log(`Seed starts for: ${table} ...`);
  await db.insert(games).values(data);
  console.log(`=> Seed done for: ${table}!`);
};
