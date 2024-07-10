import { auth } from "$/auth";
import db, {
  AvailableGames,
  AvailableSpaces,
  bookings,
  tickets,
  venues,
} from "$/db";
import {
  checkOpenDay,
  checkTimeSlotOverlapps,
  convertTimeStr,
  convertTimeTo24,
  generateKey,
  generatePassKey,
  generateTimeTable,
} from "$helpers/booking";
import { getDate } from "$helpers/generics";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const paramValidation = z.object({
  uuid: z.string().uuid(),
  game: z.string().min(1).max(16),
});

export type ITimeTable = {
  status: "available" | "booked";
  startsAt: string; // time i.e. 6:00 AM (06:00:00)
  endsAt: string; // time i.e. 6:30 AM (06:30:00)
  label: string; // i.e. 6:00 AM - 6:30 AM
};

export async function GET(_: NextRequest, ctx: Record<string, any>) {
  const query = new URLSearchParams(_.nextUrl.searchParams);
  // console.log("GET: => ", ctx.params, query);
  const { uuid, game } = await paramValidation.parseAsync(ctx.params);
  const venue = await db.select().from(venues).where(eq(venues.id, uuid));

  // check if venue exists
  if (!venue || !(venue.length >= 1)) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  // check slot availablility for the spaces according to the Time-Table

  let timeSlots: ITimeTable[] = [];

  let target: (AvailableGames & Record<string, any>) | undefined =
    venue[0].games?.find((g) => g.name.toLowerCase() === game);

  if (!target)
    return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const targetDate = query.get("date") || getDate();

  // check if openDays have target-day
  if (!checkOpenDay(target.openDays, targetDate)) {
    return NextResponse.json(
      { error: "Game not available on this day" },
      { status: 404 }
    );
  }

  if (!query.has("space"))
    return NextResponse.json(
      { error: "Space/Room is missing" },
      { status: 404 }
    );

  const targetSpace: (AvailableSpaces & { table?: ITimeTable[] }) | undefined =
    target.spaces?.find(
      (sp) => sp.name.toLowerCase() === query.get("space")!.toLowerCase()
    );

  if (!targetSpace)
    return NextResponse.json({ error: "Space not found" }, { status: 404 });

  const table = generateTimeTable(targetSpace.startsAt, targetSpace.endsAt);

  for (const slot of table) {
    const status = await checkTimeSlotOverlapps(
      // sample key: afc1bdc4-0b4e-4a24-b084-7869bcb7751e:football:open_roof:indoor
      generateKey(slot.label, uuid, target.name, targetSpace.name, targetDate)
    );

    timeSlots.push({
      status: status ? "booked" : "available",
      startsAt: slot.start,
      endsAt: slot.end,
      label: slot.label,
    });
  }

  targetSpace.table = timeSlots; // attach time-table to the space

  const { spaces, ...gameResp } = target; // taking out spaces from the game response

  return NextResponse.json({
    date: query.get("date") || getDate(),
    game: gameResp,
    space: targetSpace,
  });
}

// .............................................................
/// POST: Add a new booking
// .............................................................
export async function POST(_: NextRequest, ctx: Record<string, any>) {
  const session = await auth();
  const query = new URLSearchParams(_.nextUrl.searchParams);
  const { uuid, game } = await paramValidation.parseAsync(ctx.params);

  const venue = await db.select().from(venues).where(eq(venues.id, uuid));
  // check if venue exists
  if (!venue || !(venue.length >= 1)) {
    return NextResponse.json({ error: "Venue not found" }, { status: 404 });
  }

  let target: (AvailableGames & Record<string, any>) | undefined =
    venue[0].games?.find((g) => g.name.toLowerCase() === game);

  if (!target)
    return NextResponse.json({ error: "Game not found" }, { status: 404 });

  const targetDate = query.get("date") || getDate();

  // check if openDays have target-day
  if (!checkOpenDay(target.openDays, targetDate)) {
    return NextResponse.json(
      { error: "Game not available on this day" },
      { status: 404 }
    );
  }

  if (!query.has("space"))
    return NextResponse.json(
      { error: "Space/Room is missing" },
      { status: 404 }
    );

  const targetSpace: (AvailableSpaces & { table?: ITimeTable[] }) | undefined =
    target.spaces?.find(
      (sp) => sp.name.toLowerCase() === query.get("space")!.toLowerCase()
    );

  if (!targetSpace)
    return NextResponse.json({ error: "Space not found" }, { status: 404 });

  const { slots, type, passes } = (await _.json()) as {
    slots: string[];
    type: string;
    passes: number;
  };

  if (!slots || slots.length === 0 || !type || !passes) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // booked slots
    let booked: Record<string, any>[] = [];
    let tracks: ({
      key: string;
      date: string;
      start: string;
      end: string;
    } | null)[] = [];
    for (let sl of slots) {
      // sl = '06:00 am - 06:30 am'
      let [start, end] = sl.split(" - ");
      // parse into time-string
      start = convertTimeTo24(start.trim());
      end = convertTimeTo24(end.trim());

      const key = generateKey(
        sl, // slot: '06:00 am - 06:30 am'
        uuid,
        target.name,
        targetSpace.name,
        targetDate
      );

      // check availablility of the slot
      const status = await checkTimeSlotOverlapps(key);

      if (status) {
        tracks.push(null); // slot already booked
        break; // exit loop &
      } else {
        tracks.push({
          key,
          date: targetDate,
          start,
          end,
        });
      }
    }

    // insertMany from tracks array of objects by LOOP
    for (let track of tracks) {
      if (!track) continue;

      const booking = await db
        .insert(bookings)
        .values({
          key: track.key,
          venueId: uuid,
          userId: session!.user!.id!,
          date: track.date,
          slotDetails: {
            game: target.name,
            space: targetSpace.name,
            gameType: type,
            spaceType: targetSpace.type,
            rate: targetSpace.rate,
          },
          startsAt: track.start,
          endsAt: track.end,
        })
        .returning();

      booked.push(booking[0]);
    }

    // now, make ticket
    const ticket = await db
      .insert(tickets)
      .values({
        userId: session!.user!.id!,
        bookingIds: booked.map((b) => b.id),
        bookedFor: targetDate,
        code: generatePassKey({ type: "hex", prefix: "TKT-" }),
        cost: targetSpace.rate * (booked.length / 2), // base cost
        price: targetSpace.rate * (booked.length / 2) * (1.15 * 1), // with 15% VAT
        tokens: Array.from({ length: passes }).map(() => ({
          token: generatePassKey({ type: "hex", prefix: "GP-" }),
          used: false,
        })),
        time: `${convertTimeStr(booked[0].startsAt)} - ${convertTimeStr(
          booked[booked.length - 1].endsAt
        )}`,
        game: target.name,
        gameType: type,
        space: targetSpace.name,
      })
      .returning();

    if (ticket.length === 0) {
      return NextResponse.json(
        { error: "Failed to create ticket" },
        { status: 500, statusText: "Failed to create ticket" }
      );
    } else {
      return NextResponse.json(
        {
          ticket: ticket[0],
          bookings: booked,
        },
        { status: 201, statusText: "Booking successfull!" }
      );
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
}
