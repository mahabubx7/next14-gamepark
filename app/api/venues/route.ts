import db, { venues } from "$/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest) {
  const getVenues = await db.select().from(venues);
  return NextResponse.json(getVenues);
}
