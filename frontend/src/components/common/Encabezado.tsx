import { categoriasApi } from "@/infrastructure/api/categoriasApi";
import { EncabezadoCliente } from "./EncabezadoCliente";

export async function Encabezado() {
  const categorias = await categoriasApi.listar().catch(() => []);

  return <EncabezadoCliente categorias={categorias} />;
}
