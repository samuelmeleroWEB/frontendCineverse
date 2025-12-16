import { apiClient } from "./apiClient";

export  function getUsers() {
 return  apiClient(`http://localhost:4000/users`);
  
}
