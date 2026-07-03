import { Servicio, OpcionPersonalizada } from "@/types/servicio";
import { solicitar } from "./clienteApi";

interface ServicioDto {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrls: string[];
  cupos: number;
  duracionMinutos: number;
  customOptions?: { name: string; values: string[] }[];
}

function aServicio(dto: ServicioDto): Servicio {
  return {
    id: dto.id,
    nombre: dto.name,
    descripcion: dto.description,
    precio: dto.price,
    categoria: dto.category,
    imagenes: dto.imageUrls,
    cupos: dto.cupos,
    disponible: dto.cupos > 0,
    duracionMinutos: dto.duracionMinutos,
    opcionesPersonalizadas: dto.customOptions?.map((o) => ({
      nombre: o.name,
      valores: o.values,
    })) as OpcionPersonalizada[] | undefined,
  };
}

function aDatosApi(servicio: Omit<Servicio, "id" | "disponible">) {
  return {
    name: servicio.nombre,
    description: servicio.descripcion,
    price: servicio.precio,
    category: servicio.categoria,
    imageUrls: servicio.imagenes,
    cupos: servicio.cupos,
    duracionMinutos: servicio.duracionMinutos,
    customOptions: servicio.opcionesPersonalizadas?.map((o) => ({
      name: o.nombre,
      values: o.valores,
    })),
  };
}

export const serviciosApi = {
  listar: (categoria?: string): Promise<Servicio[]> => {
    const qs = categoria ? `?categoria=${encodeURIComponent(categoria)}` : "";
    return solicitar<ServicioDto[]>(`/api/v1/servicios${qs}`, {
      next: { revalidate: 60 },
    }).then((dtos) => dtos.map(aServicio));
  },

  obtenerPorId: (id: string): Promise<Servicio> =>
    solicitar<ServicioDto>(`/api/v1/servicios/${id}`).then(aServicio),

  crear: (servicio: Omit<Servicio, "id" | "disponible">): Promise<Servicio> =>
    solicitar<ServicioDto>("/api/v1/servicios", {
      method: "POST",
      body: JSON.stringify(aDatosApi(servicio)),
    }).then(aServicio),

  actualizar: (
    id: string,
    servicio: Omit<Servicio, "id" | "disponible">
  ): Promise<Servicio> =>
    solicitar<ServicioDto>(`/api/v1/servicios/${id}`, {
      method: "PUT",
      body: JSON.stringify(aDatosApi(servicio)),
    }).then(aServicio),

  actualizarCupos: (id: string, cupos: number): Promise<Servicio> =>
    solicitar<ServicioDto>(`/api/v1/servicios/${id}/cupos`, {
      method: "PATCH",
      body: JSON.stringify({ cupos }),
    }).then(aServicio),

  eliminar: (id: string): Promise<void> =>
    solicitar<void>(`/api/v1/servicios/${id}`, { method: "DELETE" }),

  reset: (): Promise<Servicio[]> =>
    solicitar<ServicioDto[]>("/api/v1/servicios/reset", {
      method: "POST",
    }).then((dtos) => dtos.map(aServicio)),

  listarCategorias: (): Promise<string[]> =>
    solicitar<string[]>("/api/v1/servicios/categories"),
};
