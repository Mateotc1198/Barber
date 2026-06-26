import { Barbero, BarberoData } from "../entities/Barbero";

export interface BarberoRepository {
  listar(): Promise<Barbero[]>;
  getById(id: string): Promise<Barbero | null>;
  crear(data: BarberoData): Promise<Barbero>;
  actualizar(id: string, data: BarberoData): Promise<Barbero>;
  eliminar(id: string): Promise<void>;
}
