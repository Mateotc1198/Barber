import { PrismaClient } from "@prisma/client";
import { Resena, ResenaData } from "../../domain/entities/Resena";
import { ResenaRepository } from "../../domain/repositories/ResenaRepository";

export class PrismaResenaRepository implements ResenaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  listarPorBarbero(barberoId: string): Promise<Resena[]> {
    return this.prisma.resena.findMany({
      where: { barberoId },
      orderBy: { createdAt: "desc" },
    });
  }

  crear(data: ResenaData): Promise<Resena> {
    return this.prisma.resena.create({
      data: {
        barberoId: data.barberoId,
        nombreCliente: data.nombreCliente,
        calificacion: data.calificacion,
        comentario: data.comentario ?? "",
      },
    });
  }

  async eliminar(id: string): Promise<void> {
    await this.prisma.resena.delete({ where: { id } });
  }
}
