import { ContactInfo, ContactInfoUpdate } from "../domain/entities/ContactInfo";
import { ContactInfoRepository } from "../domain/repositories/ContactInfoRepository";

export class ContactInfoService {
  constructor(private readonly repo: ContactInfoRepository) {}

  async obtener(): Promise<ContactInfo | null> {
    return this.repo.obtener();
  }

  async upsert(datos: ContactInfoUpdate): Promise<ContactInfo> {
    return this.repo.upsert(datos);
  }
}
