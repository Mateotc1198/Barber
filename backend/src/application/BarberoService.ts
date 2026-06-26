import { Barbero, BarberoData } from "../domain/entities/Barbero";
import { BarberoRepository } from "../domain/repositories/BarberoRepository";

export class BarberoService {
  constructor(private readonly repo: BarberoRepository) {}

  listar(): Promise<Barbero[]> { return this.repo.listar(); }
  getById(id: string): Promise<Barbero | null> { return this.repo.getById(id); }
  crear(data: BarberoData): Promise<Barbero> { return this.repo.crear(data); }

  async actualizar(id: string, data: BarberoData): Promise<Barbero> {
    const b = await this.repo.getById(id);
    if (!b) throw new Error("Barbero no encontrado");
    return this.repo.actualizar(id, data);
  }

  async eliminar(id: string): Promise<void> {
    const b = await this.repo.getById(id);
    if (!b) throw new Error("Barbero no encontrado");
    return this.repo.eliminar(id);
  }

  async seedInicial(barberos: BarberoData[]): Promise<void> {
    const total = await this.repo.listar();
    if (total.length > 0) return;
    for (const b of barberos) await this.repo.crear(b);
  }
}
