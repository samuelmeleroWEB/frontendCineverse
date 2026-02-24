import { apiClient } from "./apiClient";

const BASE_URL = import.meta.env.VITE_API_URL;



export async function getRooms() {
  const res = await fetch(`${BASE_URL}/rooms`);
  if (!res.ok) throw new Error("Error al obtener salas");
  return res.json();
}
export async function addRoom(room: {
  name: string;
  capacity: number;
 
}) {
  return apiClient(`${BASE_URL}/rooms`, {
    method: "POST",
    body: JSON.stringify(room),
  });
}