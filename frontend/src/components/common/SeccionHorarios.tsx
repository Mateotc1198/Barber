const HORARIOS = [
  { dia: "Lunes", horas: "9:00 am – 7:00 pm", activo: true },
  { dia: "Martes", horas: "9:00 am – 7:00 pm", activo: true },
  { dia: "Miércoles", horas: "9:00 am – 7:00 pm", activo: true },
  { dia: "Jueves", horas: "9:00 am – 7:00 pm", activo: true },
  { dia: "Viernes", horas: "9:00 am – 8:00 pm", activo: true },
  { dia: "Sábado", horas: "8:00 am – 8:00 pm", activo: true },
  { dia: "Domingo", horas: "Cerrado", activo: false },
];

function diaActual() {
  return new Date().toLocaleDateString("es-CO", { weekday: "long" }).replace(/^\w/, (c) => c.toUpperCase());
}

export function SeccionHorarios() {
  const hoy = diaActual();

  return (
    <section className="py-20 px-[var(--page-padding-x)] bg-zinc-50 dark:bg-zinc-900/50">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
        {/* Texto */}
        <div className="md:col-span-5">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-amber-600 dark:text-amber-400 mb-3">
            Horarios
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 dark:text-zinc-100 mb-4">
            Siempre listos
            <br />
            <span className="gradient-text">para ti.</span>
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
            Abrimos casi todos los días para que puedas agendar cuando mejor te quede.
            Reserva tu cita por WhatsApp y te confirmamos disponibilidad al instante.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 dark:text-green-400 font-semibold">Abierto hoy</span>
          </div>
        </div>

        {/* Tabla de horarios */}
        <div className="md:col-span-7 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 overflow-hidden shadow-sm">
          {HORARIOS.map((h, i) => {
            const esHoy = h.dia === hoy;
            return (
              <div
                key={h.dia}
                className={`flex justify-between items-center px-5 py-3.5 text-sm transition-colors ${
                  esHoy
                    ? "bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500"
                    : i % 2 === 0
                    ? "bg-white dark:bg-zinc-900"
                    : "bg-zinc-50/60 dark:bg-zinc-800/30"
                }`}
              >
                <span
                  className={`font-medium ${
                    esHoy
                      ? "text-amber-700 dark:text-amber-400"
                      : "text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  {h.dia}
                  {esHoy && (
                    <span className="ml-2 text-[10px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded-full">
                      HOY
                    </span>
                  )}
                </span>
                <span
                  className={
                    h.activo
                      ? "text-zinc-600 dark:text-zinc-400"
                      : "text-red-400 dark:text-red-500 font-medium"
                  }
                >
                  {h.horas}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
