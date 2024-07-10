export type Cart = {
  name: string;
  type: string;
  space: string;
  date: string;
  price: number;
  time: string;
  ticketId: string;
  images?: string[];
};

export type CartStore = {
  items: Cart[];
  totalPrice: number;
  addToCart: (item: Cart) => void;
  removeFromCart: (index: number) => void;
};
