import getStripe from "$helpers/stripe";
import { CartStore } from "$helpers/types";
import { getPaymentSession } from "$service/payment";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

import { SlTrash } from "react-icons/sl";

interface ICartModalProps {
  cart: CartStore;
  isOpen: boolean;
  onClose: () => void;
  backdrop?: "transparent" | "opaque" | "blur";
}

export function CartModal({
  isOpen,
  onClose,
  backdrop,
  cart,
}: ICartModalProps) {
  // checkout session & handler
  const handleCheckout = async () => {
    // get checkout (Stripe) session ID
    const session = await getPaymentSession(cart.items);

    // redirect to stripe-payment portal
    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId: session.id });
  };

  return (
    <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h5 className="text-lg font-semibold text-white">Your Cart</h5>
              <p className="text-xs text-gray-500">
                You have {cart.items.length} items in your cart.
              </p>
            </ModalHeader>
            <ModalBody>
              <ul className="list-none p-0 m-0 text-gray-400">
                {cart.items.map((item, i) => (
                  <li
                    key={`${item.name}-${i}`}
                    className="flex flex-col gap-1 mb-4 w-full border border-gray-800 p-2 rounded"
                  >
                    <span className="w-full inline-flex items-center gap-2 justify-between text-gray-300">
                      <span className="font-semibold">{item.name}</span>
                      <span className="font-semibold ">
                        ${item.price.toFixed(2)}
                      </span>
                    </span>

                    <span className="w-full inline-flex flex-col gap-1 text-xs text-gray-400">
                      <span>Type: {item.type}</span>
                      <span>Space: {item.space}</span>
                      <span>Date: {item.date}</span>
                      <span>Time: {item.time}</span>
                    </span>

                    <span className="w-full block text-right">
                      <Button
                        className="bg-red-600/20 text-red-500 ml-auto p-1.5"
                        isIconOnly
                        onClick={() => cart.removeFromCart(i)}
                      >
                        <SlTrash />
                      </Button>
                    </span>
                  </li>
                ))}
              </ul>

              <div className="my-1 text-gray-300 w-full">
                <span className="block w-full text-right">
                  <strong>Total</strong>
                  <span>:</span>
                  <span className="ml-2 font-semibold">
                    ${cart.totalPrice.toFixed(2)}
                  </span>
                </span>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                isDisabled={cart.items.length === 0}
                onClick={handleCheckout}
              >
                Checkout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
