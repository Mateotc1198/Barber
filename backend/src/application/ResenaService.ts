import { Resena, ResenaData } from "../domain/entities/Resena";
import { ResenaRepository } from "../domain/repositories/ResenaRepository";

export class ResenaService {
  constructor(private readonly repo: ResenaRepository) {}

  listarPorBarbero(barberoId: string): Promise<Resena[]> {
    return this.repo.listarPorBarbero(barberoId);
  }

  crear(data: ResenaData): Promise<Resena> {
    if (data.calificacion < 1 || data.calificacion > 5) {
      throw new Error("La calificación debe estar entre 1 y 5");
    }
    return this.repo.crear(data);
  }

  eliminar(id: string): Promise<void> {
    return this.repo.eliminar(id);
  }
}
