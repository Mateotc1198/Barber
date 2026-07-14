import { TarjetaContacto } from "@/components/contact/TarjetaContacto";
import { Encabezado } from "@/components/common/Encabezado";
import { PieDePagina } from "@/components/common/PieDePagina";
import { BotonTema } from "@/components/ui/BotonTema";
import { ContactInfo } from "@/types/contacto";
import { Barbero } from "@/types/barbero";
import { TarjetaBarbero } from "@/components/contact/TarjetaBarbero";
import { NOMBRE_BARBERIA, NUMERO_WHATSAPP } from "@/constants/barberia";

export const metadata = {
  title: "Contacto",
  description: `Conoce cómo contactar a ${NOMBRE_BARBERIA}`,
};

const FALLBACK_CONTACTO: ContactInfo = {
  nombre: NOMBRE_BARBERIA,
  fotoUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&q=80&auto=format&fit=crop",
  instagram: null,
  facebook: null,
  whatsapp: NUMERO_WHATSAPP,
  tiktok: null,
  twitter: null,
  gmail: null,
  youtube: null,
};

async function obtenerBarberos(): Promise<Barbero[]> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${API_URL}/api/v1/barberos`, { cache: "no-store" });
    if (!res.ok) return [];
    return res.json();
  } catch { return []; }
}

async function obtenerContacto(): Promise<ContactInfo> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  try {
    const res = await fetch(`${API_URL}/api/v1/contacto`, { cache: "no-store" });
    if (!res.ok) return FALLBACK_CONTACTO;
    const data = await res.json() as Record<string, unknown>;
    if (!data || !data.nombre) return FALLBACK_CONTACTO;
    return data as unknown as ContactInfo;
  } catch {
    return FALLBACK_CONTACTO;
  }
}

export default async function ContactoPage() {
  const [info, barberos] = await Promise.all([obtenerContacto(), obtenerBarberos()]);

  return (
    <>
      <Encabezado />
      <BotonTema />
      <main className="min-h-screen pt-[var(--header-height)] pb-16 px-[var(--page-padding-x)]">
        <div className="max-w-xl mx-auto py-16">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-2">
              Estamos aquí para ti
            </p>
            <h1 className="text-3xl font-black text-zinc-900 dark:text-zinc-100">
              Contáctanos
            </h1>
          </div>
          <TarjetaContacto info={info} />

          {barberos.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-2 text-center">
                Equipo
              </p>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 text-center mb-6">
                Nuestros barberos
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {barberos.filter((b) => b.activo).map((b) => (
                  <TarjetaBarbero key={b.id} barbero={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <PieDePagina numeroWhatsApp={info.whatsapp} />
    </>
  );
}
