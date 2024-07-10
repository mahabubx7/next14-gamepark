import db, { games } from "$/db";
import { NextResponse } from "next/server";

async function getGames() {
  const gameTypes = await db.select().from(games);
  return NextResponse.json(gameTypes);
}

export { getGames as GET };
