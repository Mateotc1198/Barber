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
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80" />
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
        <div className="flex items-center justify-center gap-2 mb-6 animate-fade-in-up">
          <div className="h-px w-8 bg-amber-400/60" />
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-amber-300">
            {DESCRIPCION_HERO.subtitulo}
          </p>
          <div className="h-px w-8 bg-amber-400/60" />
        </div>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-[1.05] tracking-tight mb-5 animate-fade-in-up"
          style={{ animationDelay: "0.1s", textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}
        >
          {DESCRIPCION_HERO.titulo.split(",")[0]},
          <br />
          <span className="gradient-text">{DESCRIPCION_HERO.titulo.split(",")[1]?.trim()}</span>
        </h1>

        <p
          className="text-base sm:text-lg text-white/70 max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          {DESCRIPCION_HERO.descripcion}
        </p>

        <div
          className="flex flex-wrap gap-3 justify-center animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href="/servicios"
            className="group px-8 py-3.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-[0_0_24px_rgba(217,119,6,0.5)] hover:shadow-[0_0_32px_rgba(217,119,6,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
          >
            Ver Servicios
            <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            href="/contacto"
            className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 text-white font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 tracking-wide"
          >
            Contáctanos
          </Link>
        </div>

        {/* Nombre de la barbería como watermark */}
        <p className="mt-8 text-white/20 text-xs tracking-[0.5em] uppercase font-light animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          {NOMBRE_BARBERIA} · Est. 2024
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-scroll-bounce">
        <p className="text-white/40 text-[10px] tracking-widest uppercase">Scroll</p>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5 text-white/40">
          <path d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
