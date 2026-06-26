import { Servicio, ServicioData } from "../entities/Servicio";

export interface ServicioRepository {
  list(category?: string): Promise<Servicio[]>;
  listCategories(): Promise<string[]>;
  getById(id: string): Promise<Servicio | null>;
  create(data: ServicioData): Promise<Servicio>;
  update(id: string, data: ServicioData): Promise<Servicio>;
  updateCupos(id: string, cupos: number): Promise<Servicio>;
  delete(id: string): Promise<void>;
  replaceAll(servicios: ServicioData[]): Promise<Servicio[]>;
}
