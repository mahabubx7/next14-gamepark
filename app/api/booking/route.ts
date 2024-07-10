import db, { bookings } from "$/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// DTO: BookingDTO <InsertType>
const bookingDto = z.object({
  key: z.string({ required_error: "Key is required!" }),
  date: z.string({ required_error: "Date is required!" }).date(),
  startsAt: z.string({ required_error: "Start time is required!" }).time(),
  endsAt: z.string({ required_error: "End time is required!" }).time(),
  venueId: z.string({ required_error: "Venue ID is required!" }).uuid(),
  slotDetails: z.object({
    game: z.string({ required_error: "Game is required!" }),
    space: z.string({ required_error: "Space is required!" }),
    gameType: z.string({ required_error: "Game type is required!" }),
    spaceType: z.string({ required_error: "Space type is required!" }),
    rate: z.number({ required_error: "Rate is required!" }),
  }),
});

export async function POST(req: NextRequest, ctx: any) {
  try {
    const payload = await bookingDto.parseAsync(await req.json());
    return NextResponse.json(payload, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error }, { status: error.status || 400 });
  }
}

export async function GET(_: NextRequest) {
  const data = await db.select().from(bookings);
  return NextResponse.json(data);
}
