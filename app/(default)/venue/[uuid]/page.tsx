import { auth } from "$/auth";
import { VenueDetailsClientOnly } from "$/components/venue/details";
import { getVenue } from "$service/venue";
import Image from "next/image";

export default async function VeunueDetails({ params }: any) {
  const venue = await getVenue(params.uuid);
  const session = await auth();

  if (!venue) {
    return <div className="text-red-500 text-xl">Venue not found!</div>;
  }

  return (
    <div>
      <h2 className="text-center my-4 text-2xl font-semibold">{venue.name}</h2>

      <div className="container flex gap-2">
        <div className="max-w-[540px] w-full md:w-2/3">
          <Image
            src={venue.cover!}
            alt={venue.name!}
            width={300}
            height={120}
            className="object-cover rounded w-full aspect-video"
            priority
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-gray-400">City: {venue.city}</p>
          <p className="italic mb-4">{venue.address}</p>
          {venue.games?.map((game) => (
            <div key={game.name}>
              <h3 className="font-semibold">{game.name}</h3>
              <div className="flex gap-x-1 flex-wrap">
                {game.types?.map((t) => (
                  <span
                    key={t}
                    className="p-1 px-2.5 bg-slate-800 text-gray-400 rounded text-xs"
                  >
                    {t}
                  </span>
                ))}

                {game.openDays.join(", ")}
              </div>
            </div>
          ))}
        </div>
      </div>

      {venue && <VenueDetailsClientOnly venue={venue} auth={session} />}
    </div>
  );
}
