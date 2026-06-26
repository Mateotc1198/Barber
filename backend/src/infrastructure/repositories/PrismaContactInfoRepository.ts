import { PrismaClient } from "@prisma/client";
import { ContactInfo, ContactInfoUpdate } from "../../domain/entities/ContactInfo";
import { ContactInfoRepository } from "../../domain/repositories/ContactInfoRepository";

const SINGLETON_ID = "singleton";

export class PrismaContactInfoRepository implements ContactInfoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async obtener(): Promise<ContactInfo | null> {
    const row = await this.prisma.contactInfo.findFirst();
    return row ?? null;
  }

  async upsert(datos: ContactInfoUpdate): Promise<ContactInfo> {
    return this.prisma.contactInfo.upsert({
      where: { id: SINGLETON_ID },
      update: datos,
      create: { id: SINGLETON_ID, ...datos },
    });
  }
}
