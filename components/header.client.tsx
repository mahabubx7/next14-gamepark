"use client";

import { useCart } from "$helpers/store/cart.store";
import { CartStore } from "$helpers/types";
import { useState } from "react";
import { CartModal } from "./cart/modal";

export function CartButton() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const cart = useCart()((state: CartStore) => state);

  const toggleOpen = () => {
    setOpen(!isOpen);
  };

  return (
    <>
      <button className="mx-1" onClick={toggleOpen}>
        <span className="text-white">Cart</span>
        <span className="text-white text-xs">({cart.items.length})</span>
      </button>

      <CartModal
        isOpen={isOpen}
        onClose={() => {
          toggleOpen();
        }}
        cart={cart}
      />
    </>
  );
}
