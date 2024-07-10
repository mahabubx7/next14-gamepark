"use client";
import { Cart, CartStore } from "$helpers/types";
import { ReactNode, createContext, useContext } from "react";
import { StoreApi, UseBoundStore, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

type CartState = Omit<CartStore, "addToCart" | "removeFromCart">;

const initialState: CartState = {
  items: [],
  totalPrice: 0,
};

const createCartStore = () => {
  return create<CartStore>()(
    persist<CartStore>(
      (set) => ({
        ...initialState,
        // Action: Add to cart
        addToCart: (item: Cart) => {
          // console.log("Adding to cart: ", item);
          set((state) => ({
            items: [...state.items, item],
            totalPrice: state.totalPrice + item.price,
          }));
        },

        // Action: Remove from cart
        removeFromCart: (index: number) => {
          set((state) => {
            const items = [...state.items];
            const [removed] = items.splice(index, 1);
            return {
              items,
              totalPrice: state.totalPrice - removed.price,
            };
          });
        },
      }),
      {
        name: "cart-storage", // unique name for storage key
      } as PersistOptions<CartStore>
    )
  );
};

const CartContext = createContext<UseBoundStore<StoreApi<CartStore>> | null>(
  null
);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const store = createCartStore();
  return <CartContext.Provider value={store}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
