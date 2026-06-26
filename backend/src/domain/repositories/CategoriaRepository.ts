import { Categoria, CategoriaUpdate } from "../entities/Categoria";

export interface CategoriaRepository {
  listar(): Promise<Categoria[]>;
  upsertPorNombre(nombre: string, datos: CategoriaUpdate): Promise<Categoria>;
  sincronizarDesdeServicios(nombres: string[]): Promise<void>;
}
