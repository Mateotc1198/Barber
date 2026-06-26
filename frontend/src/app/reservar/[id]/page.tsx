import { notFound } from "next/navigation";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { BotonTema } from "@/components/ui/BotonTema";
import { PaginaReservar } from "@/components/reserva/PaginaReservar";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function obtenerServicio(id: string) {
  const res = await fetch(`${API_URL}/api/v1/servicios/${id}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

async function obtenerBarberos() {
  const res = await fetch(`${API_URL}/api/v1/barberos`, { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ReservarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [dto, barberos] = await Promise.all([obtenerServicio(id), obtenerBarberos()]);
  if (!dto) notFound();

  const servicio = {
    id: dto.id,
    nombre: dto.name,
    descripcion: dto.description,
    precio: dto.price,
    categoria: dto.category,
    imagenes: dto.imageUrls,
    cupos: dto.cupos,
    disponible: dto.cupos > 0,
    duracionMinutos: dto.duracionMinutos,
    opcionesPersonalizadas: dto.customOptions?.map((o: { name: string; values: string[] }) => ({
      nombre: o.name,
      valores: o.values,
    })),
  };

  return (
    <>
      <Encabezado />
      <BotonTema />
      <main className="min-h-screen pt-[var(--header-height)] pb-16 px-[var(--page-padding-x)]">
        <div className="max-w-xl mx-auto mt-8">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-2">
              Reserva tu cita
            </p>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
              Elige tu barbero y horario
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
              Lunes a sábado · 9:00 am – 8:00 pm
            </p>
          </div>
          <PaginaReservar servicio={servicio} barberos={barberos} />
        </div>
      </main>
      <PieDePagina />
    </>
  );
}
