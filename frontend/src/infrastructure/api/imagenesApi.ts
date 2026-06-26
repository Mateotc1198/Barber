import { solicitarFormData } from "./clienteApi";

export const imagenesApi = {
  subir: async (archivo: File): Promise<string> => {
    const formData = new FormData();
    formData.append("imagen", archivo);
    const respuesta = await solicitarFormData<{ url: string }>(
      "/api/v1/images",
      formData
    );
    return respuesta.url;
  },
};
