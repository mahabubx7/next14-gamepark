import { AvailableGames } from "$/db";
import { get, post } from "$service";

export async function getSpaceTimeSlots(
  uuid: string,
  game: string,
  space: string,
  date?: string
) {
  return await get<Record<string, any>>(
    `/venue/${uuid}/${game}?space=${space}${date ? "&date=" + date : ""}`,
    {
      toastOnError: true,
    }
  );
}

export async function makeBookings(payload: {
  uuid: string;
  game: string;
  type: AvailableGames["types"][number];
  space: string;
  date: string;
  slots: string[];
  passes: number;
}) {
  return await post<Record<string, any>>(
    `/venue/${payload.uuid}/${payload.game}?space=${payload.space}&date=${payload.date}`,
    {
      method: "POST",
      body: JSON.stringify({
        slots: payload.slots,
        passes: payload.passes,
        type: payload.type,
      }),
      toastOnError: true,
      toastOnSuccess: true,
      onSuccessMsg: "Booking successful!",
    }
    // "https://gamepark.lcl.host:44333" // origin
  );
}
