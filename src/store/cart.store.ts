import { create } from "zustand"; // para crear el store global
// tipos de items
export type CartItemTicket = {
  id: string; // id interno del carrito
  type: "ticket";
  movieId: string;
  movieTitle: string;
  sessionId: string;
  sessionDateTime: string;
  roomName: string;
  seats: string[]; // ["A1", "A2", ...]
  pricePerSeat: number;
  total: number;
};
// tipos de menus
export type CartItemMenu = {
  id: string;
  type: "menu";
  menuId: string;
  name: string;
  quantity: number;
  pricePerUnit: number;
  total: number;
};
// union de tipos, 
export type CartItem = CartItemTicket | CartItemMenu;
// estado del carrito
interface CartState {
  items: CartItem[];
  addItem: (
    item: Omit<CartItem, "id" | "total"> & Partial<Pick<CartItem, "total">>
  ) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalAmount: () => number;
}
//  usamos aqui zustand para mantener la persistencia del carrito
// set actualiza el estado y get lo lee
export const useCartStore = create<CartState>((set, get) => ({
  items: [], // carrito vacio , asi empieza

  addItem: (item) => {
    const id = crypto.randomUUID?.() ?? String(Date.now()); //usamos UUID si el navegador lo soporta si no usaremos la fecha actual, garantiza ids unicos

    let total = 0; // calcular el total

    if (item.type === "ticket") {
      const pricePerSeat = (item as any).pricePerSeat ?? 0; // precio por butaca
      const seatsCount = (item as any).seats?.length ?? 0; // numero de butaca
      total = pricePerSeat * seatsCount;
    } else if (item.type === "menu") {
      const raw = item as any;
      const quantity = raw.quantity ?? 1;
      const unit = raw.pricePerUnit ?? raw.price ?? 0; // soporta price o pricePerUnit
      total = unit * quantity;
    }
    // Normalizar el carrito y garantiza que todos los items guardados tengan un id y un total

    const withTotal: CartItem =
      item.type === "ticket"
        ? ({
            ...(item as any),
            id,
            total,
          } as CartItemTicket)
        : ({
            ...(item as any),
            id,
            // normalizamos: siempre guardamos pricePerUnit
            pricePerUnit:
              (item as any).pricePerUnit ?? (item as any).price ?? 0,
            quantity: (item as any).quantity ?? 1,
            total,
          } as CartItemMenu);

    set((state) => ({ // añade el nuevo producto y mantiene los existentes
      items: [...state.items, withTotal],
    }));
  },

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.length,

  totalAmount: () => get().items.reduce((acc, item) => acc + item.total, 0), // suma el total
}));
