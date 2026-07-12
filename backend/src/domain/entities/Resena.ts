export interface Resena {
  id: string;
  barberoId: string;
  nombreCliente: string;
  calificacion: number;
  comentario: string;
  createdAt: Date;
}

export interface ResenaData {
  barberoId: string;
  nombreCliente: string;
  calificacion: number;
  comentario?: string;
}
