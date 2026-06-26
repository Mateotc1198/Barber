import { SlotDisponibilidad, Reserva, ReservaData } from "@/types/reserva";
import { solicitar } from "./clienteApi";

export const reservasApi = {
  disponibilidad: (servicioId: string, fecha: string, barberoId: string): Promise<SlotDisponibilidad[]> =>
    solicitar<SlotDisponibilidad[]>(
      `/api/v1/reservas/disponibilidad?servicioId=${encodeURIComponent(servicioId)}&fecha=${fecha}&barberoId=${encodeURIComponent(barberoId)}`
    ),

  crear: (data: ReservaData): Promise<Reserva> =>
    solicitar<Reserva>("/api/v1/reservas", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  listarPorFecha: (fecha: string): Promise<(Reserva & { servicio?: { name: string; category: string } })[]> =>
    solicitar(`/api/v1/reservas?fecha=${fecha}`),

  cancelar: (id: string): Promise<void> =>
    solicitar<void>(`/api/v1/reservas/${id}/cancelar`, { method: "PATCH" }),
};
