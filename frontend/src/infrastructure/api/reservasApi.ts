import { SlotDisponibilidad, Reserva, ReservaData } from "@/types/reserva";
import { solicitar } from "./clienteApi";

const cacheDisponibilidad = new Map<string, Promise<SlotDisponibilidad[]>>();

function claveDisponibilidad(fecha: string, barberoId: string, servicioId?: string): string {
  return `${fecha}|${barberoId}|${servicioId ?? ""}`;
}

export const reservasApi = {
  disponibilidad: (fecha: string, barberoId: string, servicioId?: string): Promise<SlotDisponibilidad[]> => {
    const clave = claveDisponibilidad(fecha, barberoId, servicioId);
    let promesa = cacheDisponibilidad.get(clave);
    if (!promesa) {
      promesa = solicitar<SlotDisponibilidad[]>(
        `/api/v1/reservas/disponibilidad?fecha=${fecha}&barberoId=${encodeURIComponent(barberoId)}${
          servicioId ? `&servicioId=${encodeURIComponent(servicioId)}` : ""
        }`
      );
      promesa.catch(() => cacheDisponibilidad.delete(clave));
      cacheDisponibilidad.set(clave, promesa);
    }
    return promesa;
  },

  invalidarDisponibilidad: (fecha: string, barberoId: string, servicioId?: string): void => {
    cacheDisponibilidad.delete(claveDisponibilidad(fecha, barberoId, servicioId));
  },

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
