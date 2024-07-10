import db, { venues } from "$/db";
import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// (GET) /api/venue/[game]
export async function GET(_: NextRequest, context: any) {
  const game = (context.params as any).game as string;

  try {
    // Get the venues by avaliable game name matching from the database
    const gameJson = JSON.stringify([{ name: game.toLowerCase() }]);
    const listOfVenues = await db
      .select()
      .from(venues)
      .where(sql`LOWER(${venues.games}::text)::jsonb @> ${gameJson}::jsonb`);
    return NextResponse.json(listOfVenues);
  } catch (error: any) {
    // caught an error
    return NextResponse.json({ error }, { status: error.status || 500 });
  }
}
