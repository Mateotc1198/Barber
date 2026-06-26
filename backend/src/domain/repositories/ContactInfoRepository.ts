import { ContactInfo, ContactInfoUpdate } from "../entities/ContactInfo";

export interface ContactInfoRepository {
  obtener(): Promise<ContactInfo | null>;
  upsert(datos: ContactInfoUpdate): Promise<ContactInfo>;
}
