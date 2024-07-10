"use client";

import { tVenueSelectable } from "$/db";
import Image from "next/image";
import Link from "next/link";

interface MatchedVenuesProps {
  venues: tVenueSelectable[];
  game?: string | null;
  type?: string | null;
}

export function MatchedVenues(props: MatchedVenuesProps) {
  // console.log("MatchedVenues", props);

  return (
    <div>
      <h2>
        Venues for {props.game || "All"} - {props.type || "All"}
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 py-12">
        {props.venues.length >= 1 ? (
          props.venues.map((v) => (
            <li key={v.id}>
              <Link
                className="flex flex-col gap-1 border border-gray-700 rounded p-2"
                href={`/venue/${v.id}`}
              >
                <Image
                  src={v.cover!}
                  alt={v.name}
                  width={300}
                  height={120}
                  className="object-cover rounded w-full aspect-video"
                />

                <h4 className="font-bold mt-4">{v.name}</h4>
                <p className="font-semibold text-gray-400">City: {v.city}</p>
                <p className="italic">{v.address}</p>
              </Link>
            </li>
          ))
        ) : (
          <li>No venues found</li>
        )}
      </ul>
    </div>
  );
}
