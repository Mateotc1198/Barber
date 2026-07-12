import { Resena, ResenaData } from "@/types/resena";
import { solicitar } from "./clienteApi";

export const resenasApi = {
  listarPorBarbero: (barberoId: string): Promise<Resena[]> =>
    solicitar(`/api/v1/resenas?barberoId=${encodeURIComponent(barberoId)}`),

  crear: (data: ResenaData): Promise<Resena> =>
    solicitar("/api/v1/resenas", { method: "POST", body: JSON.stringify(data) }),

  eliminar: (id: string): Promise<void> =>
    solicitar(`/api/v1/resenas/${id}`, { method: "DELETE" }),
};
