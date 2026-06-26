import { Servicio, ServicioData } from "../domain/entities/Servicio";
import { ServicioRepository } from "../domain/repositories/ServicioRepository";
import { ServicioNotFound } from "../domain/errors/DomainErrors";

export class ServicioService {
  constructor(
    private readonly repository: ServicioRepository,
    private readonly seedData: ServicioData[]
  ) {}

  list(category?: string): Promise<Servicio[]> {
    return this.repository.list(category);
  }

  listCategories(): Promise<string[]> {
    return this.repository.listCategories();
  }

  getById(id: string): Promise<Servicio | null> {
    return this.repository.getById(id);
  }

  create(data: ServicioData): Promise<Servicio> {
    return this.repository.create(data);
  }

  async update(id: string, data: ServicioData): Promise<Servicio> {
    await this.ensureExists(id);
    return this.repository.update(id, data);
  }

  async updateCupos(id: string, cupos: number): Promise<Servicio> {
    await this.ensureExists(id);
    return this.repository.updateCupos(id, cupos);
  }

  async delete(id: string): Promise<void> {
    await this.ensureExists(id);
    return this.repository.delete(id);
  }

  reset(): Promise<Servicio[]> {
    return this.repository.replaceAll(this.seedData);
  }

  private async ensureExists(id: string): Promise<void> {
    const servicio = await this.repository.getById(id);
    if (!servicio) {
      throw new ServicioNotFound(id);
    }
  }
}
