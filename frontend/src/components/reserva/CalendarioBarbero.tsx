"use client";

import { useState } from "react";
import { DiaHorario } from "@/types/barbero";

interface Props {
  horario: DiaHorario[];
  fechaSeleccionada: Date | null;
  onSeleccionar: (d: Date) => void;
  onPrefetch?: (d: Date) => void;
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function diaHabilitado(horario: DiaHorario[], fecha: Date): boolean {
  const dia = horario.find((h) => h.diaSemana === fecha.getDay());
  return dia?.activo ?? false;
}

export function CalendarioBarbero({ horario, fechaSeleccionada, onSeleccionar, onPrefetch }: Props) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));

  const primerDiaSemana = mesActual.getDay();
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const celdas: (Date | null)[] = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => new Date(mesActual.getFullYear(), mesActual.getMonth(), i + 1)),
  ];

  const esMesActualHoy = mesActual.getFullYear() === hoy.getFullYear() && mesActual.getMonth() === hoy.getMonth();

  function cambiarMes(delta: number) {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + delta, 1));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => cambiarMes(-1)}
          disabled={esMesActualHoy}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 disabled:opacity-30 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Mes anterior"
        >
          ‹
        </button>
        <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          {MESES[mesActual.getMonth()]} {mesActual.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => cambiarMes(1)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="Mes siguiente"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase text-zinc-400 mb-1">
        {DIAS.map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {celdas.map((d, i) => {
          if (!d) return <div key={`vacio-${i}`} />;
          const pasado = d < hoy;
          const habilitado = !pasado && diaHabilitado(horario, d);
          const sel = fechaSeleccionada && fechaISO(d) === fechaISO(fechaSeleccionada);
          return (
            <button
              key={fechaISO(d)}
              type="button"
              disabled={!habilitado}
              onPointerDown={() => habilitado && onPrefetch?.(d)}
              onClick={() => onSeleccionar(d)}
              className={`aspect-square rounded-xl text-sm font-semibold transition-colors ${
                sel
                  ? "bg-amber-500 text-white"
                  : habilitado
                  ? "bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/20"
                  : "text-zinc-300 dark:text-zinc-700 cursor-not-allowed"
              }`}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
