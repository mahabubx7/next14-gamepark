"use client";

import { useCart } from "$helpers/store/cart.store";

export function SuccessMessage(props: {
  sessionId?: string;
  tickets?: string[];
}) {
  // cart store
  const cart = useCart()();

  // clear the cart
  const clearCart = () => cart.clearCart();

  setTimeout(() => {
    clearCart();
  }, 500);

  return (
    <div className="mx-auto mt-12 w-full max-w-screen-md bg-green-500/30 text-green-600 p-2 rounded">
      <h1 className="my-2 text-xl font-bold">Payment Accepted!</h1>
      <p>Your Tickets are confirmed!</p>
    </div>
  );
}
