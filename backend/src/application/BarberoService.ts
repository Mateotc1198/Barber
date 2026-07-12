import { Barbero, BarberoData } from "../domain/entities/Barbero";
import { BarberoRepository } from "../domain/repositories/BarberoRepository";
import { ReservaRepository } from "../domain/repositories/ReservaRepository";
import { ResenaRepository } from "../domain/repositories/ResenaRepository";
import { Resena } from "../domain/entities/Resena";

export interface PerfilBarbero {
  barbero: Barbero;
  resenas: Resena[];
  promedioCalificacion: number;
  totalResenas: number;
  totalServicios: number;
}

export class BarberoService {
  constructor(
    private readonly repo: BarberoRepository,
    private readonly reservaRepo?: ReservaRepository,
    private readonly resenaRepo?: ResenaRepository
  ) {}

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

  async obtenerPerfil(id: string): Promise<PerfilBarbero | null> {
    const barbero = await this.repo.getById(id);
    if (!barbero) return null;

    const [resenas, totalServicios] = await Promise.all([
      this.resenaRepo?.listarPorBarbero(id) ?? Promise.resolve([]),
      this.reservaRepo?.contarCompletadas(id) ?? Promise.resolve(0),
    ]);

    const promedioCalificacion = resenas.length > 0
      ? resenas.reduce((suma, r) => suma + r.calificacion, 0) / resenas.length
      : 0;

    return { barbero, resenas, promedioCalificacion, totalResenas: resenas.length, totalServicios };
  }
}
