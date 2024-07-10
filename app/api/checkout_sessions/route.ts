import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

const paymentPayloadDto = z.object({
  products: z
    .array(
      z.object({
        ticketId: z.string().uuid(),
        name: z.string(),
        images: z.optional(z.array(z.string())),
        price: z.number().positive(),
        quantity: z.number().positive(),
        time: z.string().min(8),
      })
    )
    .min(1) // at least 1 product
    .max(3), // max. 3 products at a time or day
});

export async function POST(req: NextRequest) {
  // Parse the request body
  const { products } = await paymentPayloadDto.parseAsync(await req.json());

  const originUrl = req.headers.get("origin")
    ? req.headers.get("origin")!
    : req.nextUrl.origin;

  // Create a Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      // ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: products.map((p) => {
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: p.name,
              images: p.images ? p.images : [],
              // time: p.time,
            },
            unit_amount: Math.round(p.price * 100), // convert to cents
          },
          quantity: p.quantity,
        };
      }),
      mode: "payment",
      success_url: `${originUrl}/payment/success?id={CHECKOUT_SESSION_ID}&ticket=${products
        .map((p) => p.ticketId)
        .join(",")}`,
      cancel_url: `${originUrl}/payment/cancelled?id={CHECKOUT_SESSION_ID}`,
    });

    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    if (err instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: { message: err.message || "Error from Stripe!" } },
        { status: 500, statusText: "(Stripe) Error" }
      );
    } else if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.message, issues: err.issues },
        { status: 400, statusText: "Invalid Request Body" }
      );
    }

    return NextResponse.json(
      { error: err.message || "An error occured!" },
      { status: 500, statusText: "Internal Server Error" }
    );
  }
}
