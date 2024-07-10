import db, { tickets } from "$/db";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_: NextRequest, ctx: Record<string, any>) {
  // Get the code and token from the route
  const { code, token } = ctx.params as { code: string; token: string };
  const ticket = await db.select().from(tickets).where(eq(tickets.code, code));
  if (!ticket || ticket.length < 1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  // find token in ticket
  const { tokens, ..._ticket } = ticket[0];
  const found = tokens.find((t) => t.token === token);

  if (!found) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...found,
    ticket: _ticket.code,
    ticketOwner: _ticket.userId,
    time: _ticket.time,
    game: _ticket.game,
    space: _ticket.space,
    date: _ticket.bookedFor,
  });
}

/// Verify GATE-PASS
export async function POST(_: NextRequest, ctx: Record<string, any>) {
  const { code, token } = ctx.params as { code: string; token: string };
  const ticket = await db.select().from(tickets).where(eq(tickets.code, code));
  if (!ticket || ticket.length < 1) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }
  // find token in ticket
  const { tokens, ..._ticket } = ticket[0];
  const found = tokens.find((t) => t.token === token);

  if (!found) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  // check if token is already used
  if (found.used) {
    return NextResponse.json({ error: "Token already used" }, { status: 400 });
  }

  // mark token as used
  try {
    await db.update(tickets).set({
      tokens: tokens.map((t) => (t.token === token ? { ...t, used: true } : t)),
    });

    return NextResponse.json(
      {
        token,
        used: true,
        ticket: _ticket.code,
        ticketOwner: _ticket.userId,
        time: _ticket.time,
        game: _ticket.game,
        space: _ticket.space,
        date: _ticket.bookedFor,
      },
      { status: 202 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to mark token as used" },
      { status: 500, statusText: error.message }
    );
  }
}
