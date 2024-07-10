import { post } from ".";

export async function getPaymentSession(payload: Record<string, any>[]) {
  return await post("/checkout_sessions", {
    body: JSON.stringify({
      products: payload.map((p) => {
        return {
          name: `${p.name} (${p.type}) - ${p.space}`,
          images: p.images ? p.images : undefined,
          time: p.time,
          price: +Number((p.price as number).toFixed(2)),
          quantity: 1,
          ticketId: p.ticketId,
        };
      }),
    }),
  });
}
