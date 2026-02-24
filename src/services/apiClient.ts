import { useAuthStore } from "../store/auth.store";

export interface ApiClientOptions extends RequestInit {
  isFormData?: boolean;
}

export async function apiClient(
  url: string,
  options: ApiClientOptions = {}
) {
  const { token, logout } = useAuthStore.getState();

  const { isFormData, headers: optionHeaders, ...restOptions } = options;

  // ✅ Cambiado de HeadersInit a Record<string, string>
  const headers: Record<string, string> = {
    ...(optionHeaders as Record<string, string> || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const config: RequestInit = {
    ...restOptions,
    headers,
  };

  const response = await fetch(url, config);

  if (response.status === 401) {
    logout();
    throw new Error("Sesión expirada. Inicia sesión de nuevo.");
  }

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Error en la petición");
  }

  return response.json();
}