import { Reserva, ReservaData } from "../entities/Reserva";

export interface ReservaRepository {
  crearAtomico(data: ReservaData): Promise<Reserva>;
  obtenerSlotsBarbero(barberoId: string, fecha: string): Promise<Set<string>>;
  listarPorFecha(fecha: string): Promise<Reserva[]>;
  cancelar(id: string): Promise<void>;
}
