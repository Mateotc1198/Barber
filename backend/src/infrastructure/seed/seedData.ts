import { ServicioData } from "../../domain/entities/Servicio";
import { CORTES } from "./categorias/cortes";
import { BARBA } from "./categorias/barba";
import { COLOR_ESTILOS } from "./categorias/colorEstilos";

export const SEED_SERVICIOS: ServicioData[] = [
  ...CORTES,
  ...BARBA,
  ...COLOR_ESTILOS,
];
