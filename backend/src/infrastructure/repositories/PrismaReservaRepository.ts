import { PrismaClient } from "@prisma/client";
import { Reserva, ReservaData } from "../../domain/entities/Reserva";
import { ReservaRepository } from "../../domain/repositories/ReservaRepository";

export class PrismaReservaRepository implements ReservaRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async crearAtomico(data: ReservaData): Promise<Reserva> {
    return this.prisma.$transaction(async (tx) => {
      if (data.barberoId) {
        const ocupado = await tx.reserva.count({
          where: { barberoId: data.barberoId, fecha: data.fecha, hora: data.hora, estado: { not: "cancelada" } },
        });
        if (ocupado >= 1) throw new Error("Este barbero ya tiene una cita en ese horario");
      }
      return tx.reserva.create({
        data: {
          servicioId: data.servicioId,
          barberoId: data.barberoId ?? null,
          fecha: data.fecha,
          hora: data.hora,
          nombre: data.nombre,
          telefono: data.telefono ?? "",
        },
      }) as unknown as Reserva;
    });
  }

  async obtenerSlotsBarbero(barberoId: string, fecha: string): Promise<Set<string>> {
    const reservas = await this.prisma.reserva.findMany({
      where: { barberoId, fecha, estado: { not: "cancelada" } },
      select: { hora: true },
    });
    return new Set(reservas.map((r) => r.hora));
  }

  async listarPorFecha(fecha: string): Promise<Reserva[]> {
    return this.prisma.reserva.findMany({
      where: { fecha },
      orderBy: [{ hora: "asc" }, { createdAt: "asc" }],
      include: {
        servicio: { select: { name: true, category: true } },
        barbero: { select: { nombre: true } },
      },
    }) as unknown as Reserva[];
  }

  async cancelar(id: string): Promise<void> {
    await this.prisma.reserva.update({ where: { id }, data: { estado: "cancelada" } });
  }

  async contarCompletadas(barberoId: string): Promise<number> {
    const hoy = new Date();
    const hoyISO = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, "0")}-${String(hoy.getDate()).padStart(2, "0")}`;
    return this.prisma.reserva.count({
      where: { barberoId, estado: { not: "cancelada" }, fecha: { lt: hoyISO } },
    });
  }
}
