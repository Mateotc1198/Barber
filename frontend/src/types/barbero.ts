export interface DiaHorario {
  diaSemana: number;
  activo: boolean;
  horaInicio: string;
  horaFin: string;
}

export interface Barbero {
  id: string;
  nombre: string;
  fotoUrl: string;
  descripcion: string;
  activo: boolean;
  orden: number;
  horario: DiaHorario[];
}
