import { Resena, ResenaData } from "../entities/Resena";

export interface ResenaRepository {
  listarPorBarbero(barberoId: string): Promise<Resena[]>;
  crear(data: ResenaData): Promise<Resena>;
  eliminar(id: string): Promise<void>;
}
