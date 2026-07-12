import { Reserva, ReservaData, SlotDisponibilidad } from "../domain/entities/Reserva";
import { ReservaRepository } from "../domain/repositories/ReservaRepository";
import { ServicioRepository } from "../domain/repositories/ServicioRepository";
import { BarberoRepository } from "../domain/repositories/BarberoRepository";
import { Barbero, DiaHorario } from "../domain/entities/Barbero";

const DURACION_MINUTOS_POR_DEFECTO = 30;

const HORARIO_POR_DEFECTO: DiaHorario[] = [
  { diaSemana: 0, activo: false, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 1, activo: true, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 2, activo: true, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 3, activo: true, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 4, activo: true, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 5, activo: true, horaInicio: "09:00", horaFin: "20:00" },
  { diaSemana: 6, activo: true, horaInicio: "09:00", horaFin: "20:00" },
];

function aMinutos(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function obtenerHorarioDelDia(barbero: Barbero | null, fecha: string): DiaHorario | undefined {
  const diaSemana = new Date(`${fecha}T12:00:00`).getDay();
  const horario = barbero?.horario && barbero.horario.length > 0 ? barbero.horario : HORARIO_POR_DEFECTO;
  return horario.find((d) => d.diaSemana === diaSemana);
}

function generarSlots(duracionMinutos: number, horaInicio: string, horaFin: string): string[] {
  const inicioMin = aMinutos(horaInicio);
  const finMin = aMinutos(horaFin);
  const slots: string[] = [];
  for (let min = inicioMin; min + duracionMinutos <= finMin; min += duracionMinutos) {
    slots.push(`${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`);
  }
  return slots;
}

export class ReservaService {
  constructor(
    private readonly reservaRepo: ReservaRepository,
    private readonly servicioRepo: ServicioRepository,
    private readonly barberoRepo: BarberoRepository
  ) {}

  async obtenerDisponibilidad(fecha: string, barberoId: string, servicioId?: string): Promise<SlotDisponibilidad[]> {
    const [servicio, barbero] = await Promise.all([
      servicioId ? this.servicioRepo.getById(servicioId) : Promise.resolve(null),
      this.barberoRepo.getById(barberoId),
    ]);
    if (servicioId && !servicio) throw new Error("Servicio no encontrado");
    if (!barbero || !barbero.activo) throw new Error("Barbero no encontrado");

    const diaHorario = obtenerHorarioDelDia(barbero, fecha);
    if (!diaHorario || !diaHorario.activo) return [];

    const duracionMinutos = servicio?.duracionMinutos ?? DURACION_MINUTOS_POR_DEFECTO;
    const slots = generarSlots(duracionMinutos, diaHorario.horaInicio, diaHorario.horaFin);
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
    const servicio = data.servicioId ? await this.servicioRepo.getById(data.servicioId) : null;
    if (data.servicioId && !servicio) throw new Error("Servicio no encontrado");

    const barbero = data.barberoId ? await this.barberoRepo.getById(data.barberoId) : null;
    if (data.barberoId && (!barbero || !barbero.activo)) throw new Error("Barbero no encontrado");

    const diaHorario = obtenerHorarioDelDia(barbero, data.fecha);
    if (!diaHorario || !diaHorario.activo) throw new Error("El barbero no atiende ese día");

    const duracionMinutos = servicio?.duracionMinutos ?? DURACION_MINUTOS_POR_DEFECTO;
    const slotsValidos = generarSlots(duracionMinutos, diaHorario.horaInicio, diaHorario.horaFin);
    if (!slotsValidos.includes(data.hora)) throw new Error("Hora fuera del horario de atención");

    return this.reservaRepo.crearAtomico(data);
  }
}
