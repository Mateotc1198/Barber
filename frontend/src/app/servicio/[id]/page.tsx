import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { VistaServicio } from "@/components/services/VistaServicio";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { BotonTema } from "@/components/ui/BotonTema";
import { NOMBRE_BARBERIA } from "@/constants/barberia";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function obtenerServicio(id: string) {
  const res = await fetch(`${API_URL}/api/v1/servicios/${id}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  return res.json();
}

async function obtenerServicios() {
  const res = await fetch(`${API_URL}/api/v1/servicios`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const dto = await obtenerServicio(id);
  if (!dto) return { title: "Servicio no encontrado" };

  return {
    title: dto.name,
    description: dto.description,
    openGraph: {
      title: `${dto.name} | ${NOMBRE_BARBERIA}`,
      description: dto.description,
      images: dto.imageUrls?.[0] ? [{ url: dto.imageUrls[0] }] : [],
    },
  };
}

function dtoAServicio(dto: Record<string, unknown>) {
  return {
    id: dto.id as string,
    nombre: dto.name as string,
    descripcion: dto.description as string,
    precio: dto.price as number,
    categoria: dto.category as string,
    imagenes: dto.imageUrls as string[],
    cupos: dto.cupos as number,
    disponible: (dto.cupos as number) > 0,
    duracionMinutos: dto.duracionMinutos as number,
    opcionesPersonalizadas: (dto.customOptions as { name: string; values: string[] }[] | undefined)?.map(
      (o) => ({ nombre: o.name, valores: o.values })
    ),
  };
}

export default async function ServicioPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [dto, todosDto] = await Promise.all([obtenerServicio(id), obtenerServicios()]);

  if (!dto) notFound();

  const servicio = dtoAServicio(dto);
  const todos = (todosDto as Record<string, unknown>[]).map(dtoAServicio);
  const relacionados = todos.filter(
    (s) => s.categoria === servicio.categoria && s.id !== servicio.id
  );

  return (
    <>
      <Encabezado />
      <BotonTema />
      <VistaServicio servicio={servicio} relacionados={relacionados} />
      <PieDePagina />
    </>
  );
}
