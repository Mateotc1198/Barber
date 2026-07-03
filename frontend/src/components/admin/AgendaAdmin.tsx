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

  const reservasFiltradas = filtroBarbero === "todos"
    ? reservas
    : reservas.filter((r) => (r as unknown as { barberoId?: string }).barberoId === filtroBarbero);
  const activas = reservasFiltradas.filter((r) => r.estado !== "cancelada");
  const canceladas = reservasFiltradas.filter((r) => r.estado === "cancelada");

  return (
    <div>
      {/* Filtro barbero */}
      {barberos.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFiltroBarbero("todos")}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${filtroBarbero === "todos" ? "bg-amber-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
          >
            Todos
          </button>
          {barberos.map((b) => (
            <button
              key={b.id}
              onClick={() => setFiltroBarbero(b.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors cursor-pointer ${filtroBarbero === b.id ? "bg-amber-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}
            >
              {b.nombre}
            </button>
          ))}
        </div>
      )}

      {/* Selector de día */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-8">
        {dias.map((d) => {
          const seleccionado = fechaISO(d) === fechaISO(fechaSeleccionada);
          const esHoy = fechaISO(d) === fechaISO(new Date());
          return (
            <button
              key={fechaISO(d)}
              onClick={() => setFechaSeleccionada(d)}
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
          {activas.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 shadow-sm border border-zinc-100 dark:border-zinc-800"
            >
              <div className="text-center flex-shrink-0">
                <p className="text-base font-black text-amber-600 dark:text-amber-400">{formatHora(r.hora)}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{r.nombre}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate">
                  {r.servicio?.name ?? "—"}
                  {r.barbero && <span className="ml-2 text-amber-600 dark:text-amber-400">· {r.barbero.nombre}</span>}
                  {r.telefono && <span className="ml-2">· {r.telefono}</span>}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-3 flex-shrink-0">
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${
                  r.estado === "pendiente"
                    ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                }`}>
                  {r.estado}
                </span>
                <button
                  onClick={() => void cancelar(r.id)}
                  className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {canceladas.length > 0 && (
        <details className="mt-8">
          <summary className="text-sm text-zinc-400 cursor-pointer select-none">
            {canceladas.length} reserva{canceladas.length !== 1 ? "s" : ""} cancelada{canceladas.length !== 1 ? "s" : ""}
          </summary>
          <div className="space-y-2 mt-3">
            {canceladas.map((r) => (
              <div key={r.id} className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl px-5 py-3 opacity-50 line-through text-sm">
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
