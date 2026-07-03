import { Suspense } from "react";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { BotonTema } from "@/components/ui/BotonTema";
import { CatalogoCliente } from "@/components/catalog/CatalogoCliente";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { categoriasApi } from "@/infrastructure/api/categoriasApi";

export default async function ServiciosPage() {
  const [servicios, categorias] = await Promise.all([
    serviciosApi.listar().catch(() => []),
    categoriasApi.listar().catch(() => []),
  ]);

  return (
    <>
      <Encabezado />
      <BotonTema />
      <main className="min-h-screen pt-[var(--header-height)] pb-16 px-[var(--page-padding-x)]">
        <div className="max-w-[var(--page-max-width)] mx-auto">
          <Suspense>
            <CatalogoCliente servicios={servicios} categorias={categorias} />
          </Suspense>
        </div>
      </main>
      <PieDePagina />
    </>
  );
}
