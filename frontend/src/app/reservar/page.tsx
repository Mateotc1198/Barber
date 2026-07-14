import { Suspense } from "react";
import { EncabezadoReservar } from "@/components/reserva/EncabezadoReservar";
import { PaginaReservar } from "@/components/reserva/PaginaReservar";
import { barberosApi } from "@/infrastructure/api/barberosApi";

export default async function ReservarPage() {
  const barberos = await barberosApi.listar().catch(() => []);

  return (
    <div className="flex flex-col h-[100dvh] overflow-hidden">
      <EncabezadoReservar />
      <main className="flex-1 min-h-0 overflow-y-auto px-[var(--page-padding-x)]">
        <Suspense>
          <div className="w-full max-w-md mx-auto py-6">
            <PaginaReservar barberos={barberos} />
          </div>
        </Suspense>
      </main>
    </div>
  );
}
