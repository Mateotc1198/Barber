import { ContactInfo, ContactInfoUpdate } from "@/types/contacto";
import { solicitar } from "./clienteApi";

export const contactoApi = {
  obtener: (): Promise<ContactInfo | null> =>
    solicitar<ContactInfo | null>("/api/v1/contacto"),

  actualizar: (data: ContactInfoUpdate): Promise<ContactInfo> =>
    solicitar<ContactInfo>("/api/v1/contacto", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
