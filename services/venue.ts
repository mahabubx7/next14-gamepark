import { tVenueSelectable } from "$/db";
import { get } from "$service";

// GET: /api/venues -> tVenueSelectable[]
export async function getMatchedVenues(game: string, search?: string) {
  if (game === "*") {
    return await get<tVenueSelectable[]>("/venues");
  }

  const endpoint = search ? `/venues/${game}/${search}` : `/venues/${game}`;
  return await get<tVenueSelectable[]>(endpoint);
}

// GET: /api/venue/:uuid -> tVenueSelectable | null
export async function getVenue(uuid: string) {
  return await get<tVenueSelectable | null>(`/venue/${uuid}`);
}
