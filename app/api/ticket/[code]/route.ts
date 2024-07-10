import db, { tickets } from "$/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, ctx: Record<string, any>) {
  const { code } = ctx.params as { code: string };
  const ticket = await db.select().from(tickets).where(eq(tickets.code, code));
  if (!ticket || ticket.length < 1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  return NextResponse.json(ticket[0]);
}
