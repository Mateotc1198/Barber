const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES_LARGOS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface Props {
  mesActual: Date;
  fechaSeleccionada: Date;
  onCambiarMes: (delta: number) => void;
  onSeleccionarFecha: (d: Date) => void;
}

export function CalendarioMensual({ mesActual, fechaSeleccionada, onCambiarMes, onSeleccionarFecha }: Props) {
  const primerDiaSemana = mesActual.getDay();
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const celdas: (Date | null)[] = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => new Date(mesActual.getFullYear(), mesActual.getMonth(), i + 1)),
  ];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => onCambiarMes(-1)}
          aria-label="Mes anterior"
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ‹
        </button>
        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          {MESES_LARGOS[mesActual.getMonth()]} {mesActual.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => onCambiarMes(1)}
          aria-label="Mes siguiente"
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-zinc-400 mb-1">
        {DIAS.map((d) => <div key={d}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((d, i) => {
          if (!d) return <div key={`vacio-${i}`} />;
          const seleccionado = fechaISO(d) === fechaISO(fechaSeleccionada);
          const esHoy = fechaISO(d) === fechaISO(new Date());
          return (
            <button
              key={fechaISO(d)}
              type="button"
              onClick={() => onSeleccionarFecha(d)}
              className={`relative aspect-square rounded-xl text-sm font-semibold transition-colors ${
                seleccionado
                  ? "bg-amber-500 text-white"
                  : esHoy
                  ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => onSeleccionarFecha(new Date())}
        className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
      >
        Ir a hoy
      </button>
    </div>
  );
}
