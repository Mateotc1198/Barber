import { Barbero } from "@/types/barbero";
import { PerfilBarbero } from "@/types/resena";
import { solicitar } from "./clienteApi";

const cachePerfiles = new Map<string, Promise<PerfilBarbero>>();

export const barberosApi = {
  listar: (): Promise<Barbero[]> => solicitar("/api/v1/barberos"),

  obtenerPerfil: (id: string): Promise<PerfilBarbero> => {
    let promesa = cachePerfiles.get(id);
    if (!promesa) {
      promesa = solicitar<PerfilBarbero>(`/api/v1/barberos/${id}/perfil`);
      promesa.catch(() => cachePerfiles.delete(id));
      cachePerfiles.set(id, promesa);
    }
    return promesa;
  },

  invalidarPerfil: (id: string): void => {
    cachePerfiles.delete(id);
  },

  crear: (data: Omit<Barbero, "id">): Promise<Barbero> =>
    solicitar("/api/v1/barberos", { method: "POST", body: JSON.stringify(data) }),

  actualizar: (id: string, data: Omit<Barbero, "id">): Promise<Barbero> =>
    solicitar(`/api/v1/barberos/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  eliminar: (id: string): Promise<void> =>
    solicitar(`/api/v1/barberos/${id}`, { method: "DELETE" }),
};
