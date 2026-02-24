import { apiClient } from "./apiClient";
const BASE_URL = import.meta.env.VITE_API_URL;
export  function getUsers() {
 return  apiClient(`${BASE_URL}/users`);
  
}
