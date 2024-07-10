import { tGameSelectable } from "$/db";
import { get } from "$service";

// GET: /api/game -> tGameSelectable[]
export async function getGamesOptions() {
  return await get<tGameSelectable[]>("/game");
}
