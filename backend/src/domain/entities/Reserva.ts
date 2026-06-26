export interface Reserva {
  id: string;
  servicioId: string;
  fecha: string;
  hora: string;
  nombre: string;
  telefono: string;
  estado: string;
  createdAt: Date;
}

export interface ReservaData {
  servicioId: string;
  barberoId?: string;
  fecha: string;
  hora: string;
  nombre: string;
  telefono?: string;
}

export interface SlotDisponibilidad {
  hora: string;
  disponibles: number;
  total: number;
}
