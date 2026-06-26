import { Reserva, ReservaData, SlotDisponibilidad } from "../domain/entities/Reserva";
import { ReservaRepository } from "../domain/repositories/ReservaRepository";
import { ServicioRepository } from "../domain/repositories/ServicioRepository";
import { BarberoRepository } from "../domain/repositories/BarberoRepository";

const HORA_APERTURA_MIN = 9 * 60;
const HORA_CIERRE_MIN = 20 * 60;

function generarSlots(duracionMinutos: number): string[] {
  const slots: string[] = [];
  for (let min = HORA_APERTURA_MIN; min + duracionMinutos <= HORA_CIERRE_MIN; min += duracionMinutos) {
    slots.push(`${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`);
  }
  return slots;
}

function esDiaValido(fecha: string): boolean {
  const dia = new Date(`${fecha}T12:00:00`).getDay();
  return dia >= 1 && dia <= 6;
}

function esSlotValido(hora: string, duracionMinutos: number): boolean {
  const [h, m] = hora.split(":").map(Number);
  const min = h * 60 + m;
  return min >= HORA_APERTURA_MIN && min + duracionMinutos <= HORA_CIERRE_MIN;
}

export class ReservaService {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly servicioRepo: ServicioRepository,
    private readonly barberoRepo: BarberoRepository
  ) {}

  async obtenerDisponibilidad(servicioId: string, fecha: string, barberoId: string): Promise<SlotDisponibilidad[]> {
    const [servicio, barbero] = await Promise.all([
      this.servicioRepo.getById(servicioId),
      this.barberoRepo.getById(barberoId),
    ]);
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!barbero || !barbero.activo) throw new Error("Barbero no encontrado");
    if (!esDiaValido(fecha)) throw new Error("El local no atiende ese día");

    const slots = generarSlots(servicio.duracionMinutos);
    const ocupados = await this.reservaRepo.obtenerSlotsBarbero(barberoId, fecha);

    return slots.map((hora) => ({
      hora,
      disponibles: ocupados.has(hora) ? 0 : 1,
      total: 1,
    }));
  }

  listarPorFecha(fecha: string): Promise<Reserva[]> {
    return this.reservaRepo.listarPorFecha(fecha);
  }

  cancelar(id: string): Promise<void> {
    return this.reservaRepo.cancelar(id);
  }

  async crear(data: ReservaData): Promise<Reserva> {
    const servicio = await this.servicioRepo.getById(data.servicioId);
    if (!servicio) throw new Error("Servicio no encontrado");
    if (!esDiaValido(data.fecha)) throw new Error("El local no atiende ese día");
    if (!esSlotValido(data.hora, servicio.duracionMinutos)) throw new Error("Hora fuera del horario de atención");

    if (data.barberoId) {
      const barbero = await this.barberoRepo.getById(data.barberoId);
      if (!barbero || !barbero.activo) throw new Error("Barbero no encontrado");
    }

    return this.reservaRepo.crearAtomico(data);
  }
}
