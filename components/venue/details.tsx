"use client";

import { tVenueSelectable } from "$/db";
import { Session } from "next-auth";
import { VenueBooking } from "./booking";

interface IVenueDetailsProps {
  venue: tVenueSelectable | null;
  auth: Session | null;
}

export function VenueDetailsClientOnly({ venue, auth }: IVenueDetailsProps) {
  return (
    <div className="container">
      <VenueBooking venue={venue} auth={auth} />
    </div>
  );
}
