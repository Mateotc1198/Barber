import { Servicio } from "@/types/servicio";
import { NUMERO_WHATSAPP } from "@/constants/barberia";

interface OpcionesCita {
  opcionesPersonalizadas?: Record<string, string>;
}

export function construirMensajeRapido(servicio: Servicio): string {
  return [
    `Hola! Me gustaría reservar una cita en tu barbería:\n`,
    `*${servicio.nombre}*`,
    `- Precio: $${servicio.precio.toLocaleString("es-CO")}`,
    `- Duración aprox.: ${servicio.duracionMinutos} min\n`,
    `¿Cuál es la disponibilidad? ¡Muchas gracias!`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function construirMensajeDetallado(
  servicio: Servicio,
  opciones: OpcionesCita
): string {
  const detallesPersonalizados = opciones.opcionesPersonalizadas
    ? Object.entries(opciones.opcionesPersonalizadas).map(
        ([nombre, valor]) => `- ${nombre}: ${valor}`
      )
    : [];

  return [
    `Hola! Me gustaría reservar la siguiente cita:\n`,
    `*${servicio.nombre}*`,
    `- Categoría: ${servicio.categoria}`,
    ...detallesPersonalizados,
    `- Precio: $${servicio.precio.toLocaleString("es-CO")}`,
    `- Duración aprox.: ${servicio.duracionMinutos} min\n`,
    `¿Cuál es la disponibilidad? ¡Muchas gracias!`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function construirMensajeCita(
  servicioNombre: string,
  fecha: string,
  hora: string,
  nombre: string
): string {
  const [anio, mes, dia] = fecha.split("-");
  const fechaFormateada = `${dia}/${mes}/${anio}`;
  return [
    `Hola! Quiero confirmar mi cita:\n`,
    `*${servicioNombre}*`,
    `- Fecha: ${fechaFormateada}`,
    `- Hora: ${hora}`,
    `- Nombre: ${nombre}\n`,
    `¡Gracias!`,
  ].join("\n");
}

export function abrirWhatsApp(mensaje: string): void {
  const mensajeCodificado = encodeURIComponent(mensaje);
  const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${mensajeCodificado}`;
  window.open(url, "_blank");
}
