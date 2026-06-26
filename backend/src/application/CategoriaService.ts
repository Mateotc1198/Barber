import { Categoria, CategoriaUpdate } from "../domain/entities/Categoria";
import { CategoriaRepository } from "../domain/repositories/CategoriaRepository";
import { ServicioRepository } from "../domain/repositories/ServicioRepository";

export class CategoriaService {
  constructor(
    private readonly repo: CategoriaRepository,
    private readonly servicioRepo: ServicioRepository
  ) {}

  async listar(): Promise<Categoria[]> {
    const nombresServicios = await this.servicioRepo.listCategories();
    await this.repo.sincronizarDesdeServicios(nombresServicios);
    return this.repo.listar();
  }

  async actualizar(nombre: string, datos: CategoriaUpdate): Promise<Categoria> {
    return this.repo.upsertPorNombre(nombre, datos);
  }
}
