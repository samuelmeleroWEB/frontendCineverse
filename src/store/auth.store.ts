import { create } from "zustand"; //crear store
import { persist } from "zustand/middleware"; //guardamos el estado en loccalstorage
import { loginUsuarios, registrarUsuarios } from "../services/auth.services";
import { jwtDecode } from "jwt-decode"; //permite leer el jwt sin validarlo

// === Tipos ===
export interface User {
  // usuario autenticado
  id: string;
  email: string;
  name?: string;
  role?: string;
}
// controlamos el estado, loaders
export type AuthStatus = "idle" | "loading" | "authenticated" | "error";

// tipo para el token decodificado
interface DecodedToken {
  exp: number; // tiempo expiración en segundos por defecto
}
// estado global
export interface AuthState {
  user: User | null;
  token: string | null;
  status: AuthStatus; //estado actual del login
  error: string | null;

  login: (email: string, password: string) => Promise<void>; // ponemos void porque devuelve una promesa vacía
  register: (email: string, password: string) => Promise<void>; // ponemos void porque devuelve una promesa vacía
  logout: () => void; // ponemos void porque no devuelve nada

  checkTokenExpiration: () => void; // ponemos void porque no devuelve nada
}

// === Store ===
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      status: "idle",
      error: null,

      // --- LOGIN ---
      login: async (email: string, password: string) => {
        set({ status: "loading", error: null }); // estado en loading

        try {
          //llamamos al backend
          const respuesta = await loginUsuarios(email, password);
          // esto es lo que recibimos (el token y el usuario)
          const { token, user } = respuesta;
// guardamos todo en el storage
          set({
            user,
            token,
            status: "authenticated", // cambiamos el estado
            error: null,
          });
        } catch (err: any) {
          set({
            status: "error",
            error: err?.message ?? "Error al iniciar sesión",
          });
          throw err;
        }
      },

      // --- REGISTER ---
      register: async (email: string, password: string) => {
        set({ status: "loading", error: null });

        try {// lo registra y logea automaticamente
          await registrarUsuarios(email, password);
          await get().login(email, password);
        } catch (err: any) {
          set({
            status: "error",
            error: err?.message ?? "Error al registrarse",
          });
          throw err;
        }
      },
      // limpia todo el estado, cuando el token caduca o al cerrar sesion, el persist también borra

      // --- LOGOUT ---
      logout: () => {
        set({
          user: null,
          token: null,
          status: "idle",
          error: null,
        });
      },

      // --- COMPROBAR SI EL TOKEN HA CADUCADO ---
      checkTokenExpiration: () => {
        const token = get().token;
        if (!token) return; // si no hay token no hace nada

        try {
          const decoded = jwtDecode<DecodedToken>(token); // decodificamos el jwt
          const nowInSeconds = Date.now() / 1000; //obtenemos el tiempo en sec

          if (decoded.exp < nowInSeconds) {
            // Token caducado → cerramos sesión
            get().logout();
          }
        } catch (error) {
          // Si el token está corrupto o no es válido, también cerramos sesión
          get().logout();
        }
      },
    }),
    {
      name: "cineverse-auth", // persist // guarda el estado en localstorage y permite mantener sesion tras refrescar
    }
  )
);
