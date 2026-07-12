import { Barbero } from "./barbero";

export interface Resena {
  id: string;
  barberoId: string;
  nombreCliente: string;
  calificacion: number;
  comentario: string;
  createdAt: string;
}

export interface ResenaData {
  barberoId: string;
  nombreCliente: string;
  calificacion: number;
  comentario?: string;
}

export interface PerfilBarbero {
  barbero: Barbero;
  resenas: Resena[];
  promedioCalificacion: number;
  totalResenas: number;
  totalServicios: number;
}
