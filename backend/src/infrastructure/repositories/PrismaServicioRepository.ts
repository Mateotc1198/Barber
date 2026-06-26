import { PrismaClient, Servicio as ServicioPrisma } from "@prisma/client";
import { Servicio, ServicioData } from "../../domain/entities/Servicio";
import { ServicioRepository } from "../../domain/repositories/ServicioRepository";

export class PrismaServicioRepository implements ServicioRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async list(category?: string): Promise<Servicio[]> {
    const rows = await this.prisma.servicio.findMany({
      where: category ? { category } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toDomain);
  }

  async listCategories(): Promise<string[]> {
    const rows = await this.prisma.servicio.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });
    return rows.map((r) => r.category);
  }

  async getById(id: string): Promise<Servicio | null> {
    const row = await this.prisma.servicio.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async create(data: ServicioData): Promise<Servicio> {
    const row = await this.prisma.servicio.create({ data: toRow(data) });
    return toDomain(row);
  }

  async update(id: string, data: ServicioData): Promise<Servicio> {
    const row = await this.prisma.servicio.update({
      where: { id },
      data: toRow(data),
    });
    return toDomain(row);
  }

  async updateCupos(id: string, cupos: number): Promise<Servicio> {
    const row = await this.prisma.servicio.update({
      where: { id },
      data: { cupos },
    });
    return toDomain(row);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.servicio.delete({ where: { id } });
  }

  async replaceAll(servicios: ServicioData[]): Promise<Servicio[]> {
    await this.prisma.servicio.deleteMany();
    await this.prisma.servicio.createMany({
      data: servicios.map(toRow),
    });
    return this.list();
  }
}

function toDomain(row: ServicioPrisma): Servicio {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    price: row.price,
    category: row.category,
    imageUrls: deserialize<string[]>(row.imageUrls) ?? [],
    cupos: row.cupos,
    duracionMinutos: row.duracionMinutos,
    customOptions: deserialize(row.customOptions),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRow(data: ServicioData) {
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    imageUrls: serialize(data.imageUrls) ?? "[]",
    cupos: data.cupos,
    duracionMinutos: data.duracionMinutos,
    customOptions: serialize(data.customOptions),
  };
}

function serialize(val: unknown): string | null {
  return val === undefined || val === null ? null : JSON.stringify(val);
}

function deserialize<T>(text: string | null): T | undefined {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}
