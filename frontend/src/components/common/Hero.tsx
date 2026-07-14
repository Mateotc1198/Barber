import Image from "next/image";
import Link from "next/link";
import { IMAGEN_HERO, DESCRIPCION_HERO, NOMBRE_BARBERIA } from "@/constants/barberia";

export function Hero() {
  return (
    <section
      className="relative flex items-center justify-center overflow-hidden"
      style={{ height: "var(--hero-height)" }}
    >
      <Image
        src={IMAGEN_HERO.url}
        alt={IMAGEN_HERO.alt}
        fill
        priority
        className="object-cover scale-105"
        style={{ transform: "scale(1.05)" }}
      />
      {/* Gradient: oscuro arriba y abajo, semi-transparente en el centro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/45 to-black/85" />
      {/* Viñeta focal detrás del bloque de texto para reforzar contraste */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_45%,rgba(0,0,0,0.5),transparent_70%)]" />
      {/* Textura sutil de patrón */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
          backgroundSize: "12px 12px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        {/* Badge */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in-up">
          <span className="barber-stripe" />
          <p
            className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300"
            style={{ textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 2px 12px rgba(0,0,0,0.6)" }}
          >
            {DESCRIPCION_HERO.subtitulo}
          </p>
          <span className="barber-stripe" />
        </div>

        <h1
          className="font-[family-name:var(--font-display)] text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5 animate-fade-in-up"
          style={{ animationDelay: "0.1s", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          {DESCRIPCION_HERO.titulo.split(",")[0]},
          <br />
          <span
            className="gradient-text"
            style={{ filter: "drop-shadow(0 2px 18px rgba(217,119,6,0.55))" }}
          >
            {DESCRIPCION_HERO.titulo.split(",")[1]?.trim()}
          </span>
        </h1>

        <p
          className="text-base sm:text-lg text-white/90 max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s", textShadow: "0 1px 3px rgba(0,0,0,0.9), 0 4px 16px rgba(0,0,0,0.6)" }}
        >
          {DESCRIPCION_HERO.descripcion}
        </p>

        <div
          className="flex flex-wrap gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/reservar"
            className="group px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-[0_0_24px_rgba(217,119,6,0.5)] hover:shadow-[0_0_32px_rgba(217,119,6,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
          >
            Agendar Cita
          </Link>
          <Link
            href="/servicios"
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
          >
            Ver Servicios
          </Link>
        </div>

        <Link
          href="/contacto"
          className="inline-block mt-5 text-xs text-white/60 hover:text-white/90 underline underline-offset-4 transition-colors animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Contáctanos
        </Link>

      </div>

      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="animate-scroll-bounce absolute bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 w-6 h-6 text-white/60"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </section>
  );
}
