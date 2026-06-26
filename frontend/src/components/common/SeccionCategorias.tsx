import Image from "next/image";
import Link from "next/link";
import { Categoria } from "@/types/categoria";

const BANNERS_DEFAULT: Record<string, string> = {
  Cortes: "/uploads/banner-cortes.jpg",
  Barba: "/uploads/banner-barba.jpg",
  "Color & Estilos": "/uploads/color-estilos.jpg",
};

const ICONOS: Record<string, string> = {
  Cortes: "✂",
  Barba: "🧔",
  "Color & Estilos": "🎨",
};

interface Props {
  categorias: Categoria[];
}

export function SeccionCategorias({ categorias }: Props) {
  if (categorias.length === 0) return null;

  return (
    <section className="py-20 px-[var(--page-padding-x)] bg-zinc-50 dark:bg-zinc-900/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-3">
            Explorar
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100">
            Nuestras categorías
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categorias.map((cat) => {
            const banner = cat.imagenBanner || BANNERS_DEFAULT[cat.nombre] || "";
            return (
              <Link
                key={cat.id}
                href={`/servicios?categoria=${encodeURIComponent(cat.nombre)}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-200 dark:bg-zinc-800 block"
              >
                {banner && (
                  <Image
                    src={banner}
                    alt={cat.nombre}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-xl mb-1">{ICONOS[cat.nombre] ?? "✂"}</p>
                  <p className="text-white font-black text-lg leading-tight">{cat.nombre}</p>
                  <p className="text-white/60 text-xs mt-1 flex items-center gap-1 group-hover:text-amber-300 transition-colors">
                    Ver servicios
                    <span className="transition-transform group-hover:translate-x-1 inline-block">→</span>
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
