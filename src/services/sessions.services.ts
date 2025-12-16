import { apiClient } from "./apiClient";

const BASE_URL = "http://localhost:4000";

export async function createSession(session: {
  movieId: string;
  roomId: string;
  startTime: string; 
  basePrice: number;
}) {
  return apiClient(`${BASE_URL}/sessions`, {
    method: "POST",
    body: JSON.stringify(session),
  });
}
export async function getSessionsByMovie(movieId: string) {
  const res = await fetch(`${BASE_URL}/movies/${movieId}/sessions`);
  if (!res.ok) throw new Error("Error al obtener sesiones de la película");
  return res.json();
}
export async function getSessionById(id: string) {
  const res = await fetch(`${BASE_URL}/sessions/${id}`);
  if (!res.ok) throw new Error("Error al obtener sesión");
  return res.json(); // Session con movie, room, occupiedSeats, etc.
}


export async function getSessions() {
  const res = await fetch(`${BASE_URL}/sessions`);
  if (!res.ok) throw new Error("Error al obtener sesiones");
  return res.json();
}