import db, { venues } from "$/db";
import { and, ilike, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, context: any) {
  const { game, search } = context.params as {
    game: string;
    search: string;
  } & Record<string, string>;

  try {
    const payloadJson = JSON.stringify([{ name: game.toLowerCase() }]);
    const matched = await db
      .select()
      .from(venues)
      .where(
        and(
          sql`LOWER(${venues.games}::text)::jsonb @> ${payloadJson}::jsonb`,
          or(
            ilike(venues.name, `%${search}%`),
            ilike(venues.address, `%${search}%`),
            ilike(venues.city, `%${search}%`)
          )
        )
      );

    return NextResponse.json(matched);
  } catch (error: any) {
    return NextResponse.json({ error }, { status: error.status || 500 });
  }
}
