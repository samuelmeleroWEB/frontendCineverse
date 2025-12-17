import type { CartItem } from "../store/cart.store";
import { apiClient } from "./apiClient";

const BASE_URL = "http://localhost:4000";

//  Nuevo tipo para los menús guardados en la reserva
export interface BookingMenuItem {
  name: string;
  quantity: number;
  pricePerUnit: number;
}

export interface Booking {
  id: string;
  createdAt: string;
  seats: string[];
  movieTitle: string;
  sessionDateTime: string | null;
  roomName: string;
  menus?: BookingMenuItem[]; 
}

//  esta función traduce el carrito al formato que quiere el backend
export async function createBooking(items: CartItem[]) {
  // Entradas
  const ticketItems = items.filter((i) => i.type === "ticket") as any[];
  // Menús
  const menuItems = items.filter((i) => i.type === "menu") as any[];

  if (ticketItems.length === 0) {
    throw new Error("No hay entradas en el carrito");
  }

  // De momento asumimos que todas las entradas son de la MISMA sesión
  const sessionId = ticketItems[0].sessionId;
  const seats = ticketItems.flatMap((t) => t.seats);

  // Transformamos los menús al formato que guardará el backend
  const menus = menuItems.map((m: any) => ({
    name: m.name,
    quantity: m.quantity,
    pricePerUnit: m.pricePerUnit,
  }));

  // Body que mandamos al backend
  const body: any = { sessionId, seats };
  if (menus.length > 0) {
    body.menus = menus; // 👈 solo se envía si hay menús en el carrito
  }

  return apiClient(`${BASE_URL}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export async function getMyBookings(): Promise<Booking[]> {
  return apiClient(`${BASE_URL}/bookings/my`, {
    method: "GET",
  });
}
