"use client";

import { CartProvider } from "$helpers/store/cart.store";
import { NextUIProvider } from "@nextui-org/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <NextUIProvider>{children}</NextUIProvider>
    </CartProvider>
  );
}
