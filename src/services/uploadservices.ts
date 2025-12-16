import { apiClient } from "./apiClient";

const BASE_URL = "http://localhost:4000";

export interface UploadImageResponse {
  url: string;
}

export async function uploadImage(file: File): Promise<UploadImageResponse> {
  const formData = new FormData();
  formData.append("file", file);

  //  no poner manualmente Content-Type aquí,
  // el propio navegador lo hace con multipart/form-data
  return apiClient(`${BASE_URL}/uploads/image`, {
    method: "POST",
    body: formData,
    isFormData: true, 
  });
}
