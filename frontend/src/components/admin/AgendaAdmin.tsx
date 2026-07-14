"use client";

import { useState, useEffect, useCallback } from "react";
import { reservasApi } from "@/infrastructure/api/reservasApi";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { Reserva } from "@/types/reserva";
import { Barbero } from "@/types/barbero";
import { CalendarioMensual, fechaISO } from "./CalendarioMensual";
import { useToast } from "@/components/ui/ToastProvider";

type ReservaConServicio = Reserva & {
  servicio?: { name: string; category: string };
  barbero?: { nombre: string };
};

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function formatHora(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

function primerDiaHabil(desde: Date): Date {
  const d = new Date(desde);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d;
}

export function AgendaAdmin() {
  const { mostrar } = useToast();
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(() => primerDiaHabil(hoy));
  const [mesActual, setMesActual] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
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
    mostrar("Reserva cancelada");
  }

  function seleccionarFecha(d: Date) {
    setFechaSeleccionada(d);
    setMesActual(new Date(d.getFullYear(), d.getMonth(), 1));
  }

  function cambiarMes(delta: number) {
    setMesActual(new Date(mesActual.getFullYear(), mesActual.getMonth() + delta, 1));
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

      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:items-start lg:gap-8">
        <div className="mb-6 lg:mb-0 lg:sticky lg:top-6">
          <CalendarioMensual
            mesActual={mesActual}
            fechaSeleccionada={fechaSeleccionada}
            onCambiarMes={cambiarMes}
            onSeleccionarFecha={seleccionarFecha}
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 mb-3">
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
                const meta: { texto: string; clase?: string }[] = [];
                if (r.servicio?.name) meta.push({ texto: r.servicio.name });
                if (r.barbero) meta.push({ texto: r.barbero.nombre, clase: "text-amber-600 dark:text-amber-400 font-medium" });
                if (r.telefono) meta.push({ texto: r.telefono });

                return (
                  <div
                    key={r.id}
                    className="bg-white dark:bg-zinc-900 rounded-[var(--radius-card)] px-4 sm:px-5 py-3.5 sm:py-4 shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] border border-zinc-100 dark:border-zinc-800"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <p className="text-sm sm:text-base font-black text-amber-600 dark:text-amber-400 flex-shrink-0 min-w-[4.25rem] whitespace-nowrap">
                        {formatHora(r.hora)}
                      </p>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{r.nombre}</p>
                          <span className="text-[11px] text-zinc-400 dark:text-zinc-500 capitalize flex-shrink-0">
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
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition-colors cursor-pointer flex-shrink-0"
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
      </div>
    </div>
  );
}
