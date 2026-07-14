import { CODIGOS_PAIS, CODIGO_PAIS_DEFECTO } from "@/constants/codigosPais";

const CODIGOS_ORDENADOS = [...CODIGOS_PAIS].sort((a, b) => b.codigo.length - a.codigo.length);

export interface NumeroWhatsAppSeparado {
  codigo: string;
  numeroLocal: string;
}

export function separarNumeroWhatsApp(valor: string | null): NumeroWhatsAppSeparado {
  const digitos = (valor ?? "").replace(/\D/g, "");
  const coincidencia = CODIGOS_ORDENADOS.find((c) => digitos.startsWith(c.codigo));
  if (!coincidencia) return { codigo: CODIGO_PAIS_DEFECTO, numeroLocal: digitos };
  return { codigo: coincidencia.codigo, numeroLocal: digitos.slice(coincidencia.codigo.length) };
}

export function combinarNumeroWhatsApp(codigo: string, numeroLocal: string): string | null {
  const local = numeroLocal.replace(/\D/g, "");
  if (!local) return null;
  return `${codigo}${local}`;
}
