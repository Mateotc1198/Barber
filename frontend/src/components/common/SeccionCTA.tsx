import Link from "next/link";

export function SeccionCTA() {
  return (
    <section className="relative py-24 px-[var(--page-padding-x)] overflow-hidden">
      <div className="absolute inset-0 bg-zinc-950 dark:bg-black" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #d97706 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-600/10 blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-400 mb-4">
          Agenda tu cita
        </p>
        <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight mb-5">
          ¿Listo para tu
          <br />
          <span className="gradient-text">mejor versión?</span>
        </h2>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-md mx-auto mb-10">
          Reserva en menos de un minuto, sin llamadas ni esperas.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/reservar"
            className="px-8 py-4 rounded-full bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Agenda tu cita ahora
          </Link>
          <Link
            href="/servicios"
            className="px-8 py-4 rounded-full border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-amber-400 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Ver todos los servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
