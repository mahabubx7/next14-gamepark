import { auth } from "$/auth";
import db, { tickets } from "$/db";
import { and, eq } from "drizzle-orm";
import Link from "next/link";

// TODO: load confirmed tickets from the database
async function getConfirmedTickets(userId: string) {
  const confirmedTickets = await db
    .select()
    .from(tickets)
    .where(
      and(
        eq(tickets.userId, userId) // filter by the user ID
        // payment status is confirmed only from json-field: payment {}
        // sql`tickets.payment->>'status' = 'confirmed'`
      )
    );

  console.log("Q: ", confirmedTickets.length, userId);
  return confirmedTickets;
}

export default async function DTickets() {
  const session = await auth();

  let tickektsList: Awaited<ReturnType<typeof getConfirmedTickets>> = [];

  await getConfirmedTickets(session?.user?.id!)
    .then((tickets) => {
      tickektsList = tickets;
    })
    .catch((err) => {
      console.error(err);
      tickektsList = [];
    });

  return (
    <div>
      <h2>Your Tickets</h2>

      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Date</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickektsList.length > 0 &&
            tickektsList.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.code}</td>
                <td>{ticket.bookedFor}</td>
                <td>{ticket.price}</td>
                <td>{ticket.payment?.status}</td>
                <td>
                  <button>Cancel</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <Link href="/dashboard">Return to Dashboard</Link>
    </div>
  );
}
