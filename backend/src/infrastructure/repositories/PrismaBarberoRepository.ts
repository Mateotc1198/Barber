import { PrismaClient } from "@prisma/client";
import { Barbero, BarberoData } from "../../domain/entities/Barbero";
import { BarberoRepository } from "../../domain/repositories/BarberoRepository";

export class PrismaBarberoRepository implements BarberoRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listar(): Promise<Barbero[]> {
    return this.prisma.barbero.findMany({ orderBy: [{ orden: "asc" }, { createdAt: "asc" }] });
  }

  getById(id: string): Promise<Barbero | null> {
    return this.prisma.barbero.findUnique({ where: { id } });
  }

  crear(data: BarberoData): Promise<Barbero> {
    return this.prisma.barbero.create({ data });
  }

  actualizar(id: string, data: BarberoData): Promise<Barbero> {
    return this.prisma.barbero.update({ where: { id }, data });
  }

  eliminar(id: string): Promise<void> {
    return this.prisma.barbero.delete({ where: { id } }).then(() => undefined);
  }
}
