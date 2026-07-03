import { Categoria, CategoriaUpdate } from "@/types/categoria";
import { solicitar } from "./clienteApi";

export const categoriasApi = {
  listar: (): Promise<Categoria[]> =>
    solicitar<Categoria[]>("/api/v1/categorias", { next: { revalidate: 60 } }),

  actualizar: (nombre: string, data: CategoriaUpdate): Promise<Categoria> =>
    solicitar<Categoria>(`/api/v1/categorias/${encodeURIComponent(nombre)}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};
