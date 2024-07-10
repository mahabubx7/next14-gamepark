import db, { venues } from "$/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, ctx: any) {
  const { uuid } = ctx.params as { uuid: string } & Record<string, string>;
  const data = await db.select().from(venues).where(eq(venues.id, uuid));
  const venue = data[0] || null; // return the first item or null
  return NextResponse.json(venue);
}
