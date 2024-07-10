import db, { tickets } from "$/db";
import { eq } from "drizzle-orm";

async function updatePaymentInfo(ticketIDs: string[], sessionId: string) {
  // Update the ticket with the payment info
  ticketIDs.map(async (ticket) => {
    // const t = await db.select().from(tickets).where(eq(tickets.id, ticket));
    await db
      .update(tickets)
      .set({
        payment: {
          status: "paid",
          info: {
            sessionId,
            timestamp: new Date().toISOString(),
          },
        },
      })
      .where(eq(tickets.id, ticket));
  });

  return;
}

export default async function PaymentSuccess({ searchParams }: any) {
  const query = new URLSearchParams(searchParams);
  const sessionId = query.get("id");
  const tickets: string[] = query.get("ticket")
    ? query.get("ticket")!.split(",")
    : [];

  if (sessionId && tickets.length > 0) {
    // Update the payment info
    await updatePaymentInfo(tickets, sessionId!).catch((err) => {
      console.error(err);
      throw err; // throw the error
    });
  }

  if (!sessionId || tickets.length === 0) {
    return (
      <div className="mx-auto mt-12 w-full max-w-screen-md bg-red-500/30 text-red-600 p-2 rounded">
        <h1 className="my-2 text-xl font-bold">Payment processing Failed!</h1>
        <p>Sorry, something went wrong with your payment transaction.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-12 w-full max-w-screen-md bg-green-500/30 text-green-600 p-2 rounded">
      <h1 className="my-2 text-xl font-bold">Payment Accepted!</h1>
      <p>Thanks for your booking!</p>
      <small>{sessionId}</small>
      <p>
        <small>{tickets}</small>
      </p>
    </div>
  );
}
