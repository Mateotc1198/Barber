"use client";

import { useState, useEffect, useCallback } from "react";
import { reservasApi } from "@/infrastructure/api/reservasApi";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { Reserva } from "@/types/reserva";
import { Barbero } from "@/types/barbero";

type ReservaConServicio = Reserva & {
  servicio?: { name: string; category: string };
  barbero?: { nombre: string };
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const MESES_LARGOS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function generarDias(): Date[] {
  const dias: Date[] = [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  for (let i = 0; i < 14; i++) {
    const d = new Date(hoy);
    d.setDate(hoy.getDate() + i);
    if (d.getDay() >= 1 && d.getDay() <= 6) dias.push(d);
    if (dias.length === 10) break;
  }
  return dias;
}

function formatHora(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

export function AgendaAdmin() {
  const dias = generarDias();
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(dias[0]);
  const [mesActual, setMesActual] = useState(new Date(dias[0].getFullYear(), dias[0].getMonth(), 1));
  const [reservas, setReservas] = useState<ReservaConServicio[]>([]);
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [filtroBarbero, setFiltroBarbero] = useState<string>("todos");
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await reservasApi.listarPorFecha(fechaISO(fechaSeleccionada));
      setReservas(data);
    } finally {
      setCargando(false);
    }
  }, [fechaSeleccionada]);

  useEffect(() => { void cargar(); }, [cargar]);
  useEffect(() => { barberosApi.listar().then(setBarberos).catch(() => {}); }, []);

  async function cancelar(id: string) {
    if (!confirm("¿Cancelar esta reserva?")) return;
    await reservasApi.cancelar(id);
    await cargar();
  }

  function seleccionarFecha(d: Date) {
    setFechaSeleccionada(d);
    setMesActual(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function cambiarMes(delta: number) {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + delta, 1));
  }

  const primerDiaSemana = mesActual.getDay();
  const diasEnMes = new Date(mesActual.getFullYear(), mesActual.getMonth() + 1, 0).getDate();
  const celdasMes: (Date | null)[] = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => new Date(mesActual.getFullYear(), mesActual.getMonth(), i + 1)),
  ];

  const reservasFiltradas = filtroBarbero === "todos"
    ? reservas
    : reservas.filter((r) => (r as unknown as { barberoId?: string }).barberoId === filtroBarbero);
  const activas = reservasFiltradas.filter((r) => r.estado !== "cancelada");
  const canceladas = reservasFiltradas.filter((r) => r.estado === "cancelada");

  return (
    <div>
      {/* Filtro barbero */}
      {barberos.length > 0 && (
        <div className="flex gap-1.5 sm:gap-2 mb-6 sm:mb-8 flex-wrap">
          <button
            onClick={() => setFiltroBarbero("todos")}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${filtroBarbero === "todos" ? "bg-amber-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
          >
            Todos
          </button>
          {barberos.map((b) => (
            <button
              key={b.id}
              onClick={() => setFiltroBarbero(b.id)}
              className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${filtroBarbero === b.id ? "bg-amber-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
            >
              {b.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Selector de día — calendario en mobile, tira de días en desktop */}
      <div className="sm:hidden mb-6 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => cambiarMes(-1)}
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
            onClick={() => cambiarMes(1)}
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
          {celdasMes.map((d, i) => {
            if (!d) return <div key={`vacio-${i}`} />;
            const seleccionado = fechaISO(d) === fechaISO(fechaSeleccionada);
            const esHoy = fechaISO(d) === fechaISO(new Date());
            return (
              <button
                key={fechaISO(d)}
                type="button"
                onClick={() => seleccionarFecha(d)}
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
          onClick={() => seleccionarFecha(new Date())}
          className="mt-3 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
        >
          Ir a hoy
        </button>
      </div>

      <div className="hidden sm:flex gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
        {dias.map((d) => {
          const seleccionado = fechaISO(d) === fechaISO(fechaSeleccionada);
          const esHoy = fechaISO(d) === fechaISO(new Date());
          return (
            <button
              key={fechaISO(d)}
              onClick={() => seleccionarFecha(d)}
              className={`flex-shrink-0 flex flex-col items-center py-3 px-4 rounded-2xl border-2 transition-colors text-sm font-semibold ${
                seleccionado
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-400"
              }`}
            >
              <span className="text-[10px] font-bold uppercase opacity-70">{DIAS[d.getDay()]}</span>
              <span className="text-lg font-black">{d.getDate()}</span>
              <span className="text-[10px] opacity-70">{MESES[d.getMonth()]}</span>
              {esHoy && <span className="text-[9px] mt-0.5 font-bold uppercase tracking-wider opacity-80">Hoy</span>}
            </button>
          );
        })}
      </div>

      <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3 sm:hidden">
        {DIAS[fechaSeleccionada.getDay()]} {fechaSeleccionada.getDate()} de {MESES[fechaSeleccionada.getMonth()]}
      </p>

      {cargando ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : activas.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 dark:text-zinc-600">
          <p className="font-semibold">Sin reservas para este día</p>
        </div>
      ) : (
        <div className="space-y-3">
          {activas.map((r) => {
            const pillClase = r.estado === "pendiente"
              ? "bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
              : "bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800/50";
            const meta: { texto: string; clase?: string }[] = [];
            if (r.servicio?.name) meta.push({ texto: r.servicio.name });
            if (r.barbero) meta.push({ texto: r.barbero.nombre, clase: "text-amber-600 dark:text-amber-400 font-medium" });
            if (r.telefono) meta.push({ texto: r.telefono });

            return (
              <div
                key={r.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl px-4 sm:px-5 py-3.5 sm:py-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <p className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 flex-shrink-0 min-w-[4.25rem] whitespace-nowrap">
                    {formatHora(r.hora)}
                  </p>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{r.nombre}</p>
                      <span className={`hidden sm:inline-block text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap flex-shrink-0 ${pillClase}`}>
                        {r.estado}
                      </span>
                    </div>
                    {meta.length > 0 && (
                      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 truncate">
                        {meta.map((m, i) => (
                          <span key={i} className={m.clase}>
                            {i > 0 && <span className="text-zinc-300 dark:text-zinc-600"> · </span>}
                            {m.texto}
                          </span>
                        ))}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => void cancelar(r.id)}
                    className="hidden sm:inline text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer flex-shrink-0"
                  >
                    Cancelar
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 sm:hidden">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${pillClase}`}>{r.estado}</span>
                  <button
                    onClick={() => void cancelar(r.id)}
                    className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {canceladas.length > 0 && (
        <details className="mt-8">
          <summary className="text-sm text-zinc-400 cursor-pointer select-none">
            {canceladas.length} reserva{canceladas.length !== 1 ? "s" : ""} cancelada{canceladas.length !== 1 ? "s" : ""}
          </summary>
          <div className="space-y-2 mt-3">
            {canceladas.map((r) => (
              <div key={r.id} className="flex flex-wrap items-center gap-2 sm:gap-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl px-4 sm:px-5 py-3 opacity-50 line-through text-xs sm:text-sm">
                <span className="font-mono text-zinc-500">{formatHora(r.hora)}</span>
                <span className="text-zinc-500">{r.nombre}</span>
                <span className="text-zinc-400">{r.servicio?.name}</span>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
