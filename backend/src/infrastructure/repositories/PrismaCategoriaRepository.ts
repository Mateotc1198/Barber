import { PrismaClient } from "@prisma/client";
import { Categoria, CategoriaUpdate } from "../../domain/entities/Categoria";
import { CategoriaRepository } from "../../domain/repositories/CategoriaRepository";

export class PrismaCategoriaRepository implements CategoriaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async listar(): Promise<Categoria[]> {
    return this.prisma.categoria.findMany({ orderBy: { orden: "asc" } });
  }

  async upsertPorNombre(nombre: string, datos: CategoriaUpdate): Promise<Categoria> {
    return this.prisma.categoria.upsert({
      where: { nombre },
      update: datos,
      create: { nombre, ...datos },
    });
  }

  async sincronizarDesdeServicios(nombres: string[]): Promise<void> {
    const activas = new Set(nombres);

    await this.prisma.categoria.deleteMany({
      where: { nombre: { notIn: nombres } },
    });

    const existentes = await this.prisma.categoria.findMany({ select: { nombre: true } });
    const existentesSet = new Set(existentes.map((c) => c.nombre));
    const faltantes = nombres.filter((n) => !existentesSet.has(n));

    if (faltantes.length > 0) {
      await this.prisma.categoria.createMany({
        data: faltantes.map((nombre) => ({ nombre })),
      });
    }

  }
}
