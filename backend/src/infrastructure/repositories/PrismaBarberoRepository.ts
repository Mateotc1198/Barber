import { PrismaClient, Barbero as BarberoPrisma } from "@prisma/client";
import { Barbero, BarberoData, DiaHorario } from "../../domain/entities/Barbero";
import { BarberoRepository } from "../../domain/repositories/BarberoRepository";

export class PrismaBarberoRepository implements BarberoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(): Promise<Barbero[]> {
    const rows = await this.prisma.barbero.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "asc" }] });
    return rows.map(toDomain);
  }

  async getById(id: string): Promise<Barbero | null> {
    const row = await this.prisma.barbero.findUnique({ where: { id } });
    return row ? toDomain(row) : null;
  }

  async crear(data: BarberoData): Promise<Barbero> {
    const row = await this.prisma.barbero.create({ data: toRow(data) });
    return toDomain(row);
  }

  async actualizar(id: string, data: BarberoData): Promise<Barbero> {
    const row = await this.prisma.barbero.update({ where: { id }, data: toRow(data) });
    return toDomain(row);
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.barbero.delete({ where: { id } });
  }
}

function toDomain(row: BarberoPrisma): Barbero {
  return {
    id: row.id,
    nombre: row.nombre,
    fotoUrl: row.fotoUrl,
    descripcion: row.descripcion,
    activo: row.activo,
    orden: row.orden,
    horario: deserialize<DiaHorario[]>(row.horario) ?? [],
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function toRow(data: BarberoData) {
  return {
    nombre: data.nombre,
    fotoUrl: data.fotoUrl,
    descripcion: data.descripcion,
    activo: data.activo,
    orden: data.orden,
    horario: data.horario ? serialize(data.horario) : undefined,
  };
}

function serialize(val: unknown): string {
  return JSON.stringify(val);
}

function deserialize<T>(text: string | null): T | undefined {
  if (!text) return undefined;
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined;
  }
}
