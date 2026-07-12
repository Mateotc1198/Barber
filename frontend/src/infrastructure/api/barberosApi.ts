import { Barbero } from "@/types/barbero";
import { PerfilBarbero } from "@/types/resena";
import { solicitar } from "./clienteApi";

export const barberosApi = {
  listar: (): Promise<Barbero[]> => solicitar("/api/v1/barberos"),

  obtenerPerfil: (id: string): Promise<PerfilBarbero> =>
    solicitar(`/api/v1/barberos/${id}/perfil`),

  crear: (data: Omit<Barbero, "id">): Promise<Barbero> =>
    solicitar("/api/v1/barberos", { method: "POST", body: JSON.stringify(data) }),

  actualizar: (id: string, data: Omit<Barbero, "id">): Promise<Barbero> =>
    solicitar(`/api/v1/barberos/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  eliminar: (id: string): Promise<void> =>
    solicitar(`/api/v1/barberos/${id}`, { method: "DELETE" }),
};
