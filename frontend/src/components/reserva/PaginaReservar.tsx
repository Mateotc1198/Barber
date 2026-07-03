"use client";

import { useState, useEffect } from "react";
import { Servicio } from "@/types/servicio";
import { Barbero } from "@/types/barbero";
import { SlotDisponibilidad } from "@/types/reserva";
import { reservasApi } from "@/infrastructure/api/reservasApi";

interface Props {
  servicio: Servicio;
  barberos: Barbero[];
}

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function generarDiasDisponibles(): Date[] {
  const dias: Date[] = [];
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  let d = new Date(hoy);
  d.setDate(d.getDate() + 1);
  while (dias.length < 10) {
    if (d.getDay() >= 1 && d.getDay() <= 6) dias.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return dias;
}

function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatHora(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

type Paso = "barbero" | "fecha" | "hora" | "nombre" | "confirmado";

export function PaginaReservar({ servicio, barberos }: Props) {
  const dias = generarDiasDisponibles();
  const [paso, setPaso] = useState<Paso>("barbero");
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<Barbero | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [slots, setSlots] = useState<SlotDisponibilidad[]>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fechaSeleccionada || !barberoSeleccionado) return;
    setCargandoSlots(true);
    setSlots([]);
    setSlotSeleccionado(null);
    reservasApi
      .disponibilidad(servicio.id, fechaISO(fechaSeleccionada), barberoSeleccionado.id)
      .then(setSlots)
      .catch(() => setError("No se pudo cargar la disponibilidad"))
      .finally(() => setCargandoSlots(false));
  }, [fechaSeleccionada, barberoSeleccionado, servicio.id]);

  async function confirmar() {
    if (!fechaSeleccionada || !slotSeleccionado || !nombre.trim() || !barberoSeleccionado) return;
    setCargando(true);
    setError(null);
    try {
      await reservasApi.crear({
        servicioId: servicio.id,
        barberoId: barberoSeleccionado.id,
        fecha: fechaISO(fechaSeleccionada),
        hora: slotSeleccionado,
        nombre: nombre.trim(),
      });
      setPaso("confirmado");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear la reserva");
    } finally {
      setCargando(false);
    }
  }

  function reiniciar() {
    setPaso("barbero");
    setBarberoSeleccionado(null);
    setFechaSeleccionada(null);
    setSlotSeleccionado(null);
    setNombre("");
    setError(null);
  }

  if (paso === "confirmado" && fechaSeleccionada && slotSeleccionado && barberoSeleccionado) {
    const [anio, mes, dia] = fechaISO(fechaSeleccionada).split("-");
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Cita confirmada</h2>
        <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-6 mt-6 mb-8 text-left space-y-2 text-sm">
          <p><span className="text-zinc-400">Servicio:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{servicio.nombre}</span></p>
          <p><span className="text-zinc-400">Barbero:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{barberoSeleccionado.nombre}</span></p>
          <p><span className="text-zinc-400">Fecha:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{dia}/{mes}/{anio}</span></p>
          <p><span className="text-zinc-400">Hora:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatHora(slotSeleccionado)}</span></p>
          <p><span className="text-zinc-400">Nombre:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{nombre}</span></p>
        </div>
        <button onClick={reiniciar} className="text-amber-600 dark:text-amber-400 font-semibold underline text-sm">
          Reservar otra cita
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Resumen del servicio */}
      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-4 mb-8 flex items-center gap-4">
        <div className="flex-1">
          <p className="font-bold text-zinc-900 dark:text-zinc-100">{servicio.nombre}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            {servicio.duracionMinutos} min · ${servicio.precio.toLocaleString("es-CO")} COP
          </p>
        </div>
        <span className="text-amber-600 dark:text-amber-400 font-black text-xl">+</span>
      </div>

      {/* PASO 1: Elegir barbero */}
      <div className="mb-8">
        <h2 className="text-sm font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-4">
          1. Elige tu barbero
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {barberos.filter((b) => b.activo).map((b) => {
            const sel = barberoSeleccionado?.id === b.id;
            return (
              <button
                key={b.id}
                onClick={() => { setBarberoSeleccionado(b); setPaso("fecha"); setFechaSeleccionada(null); setSlotSeleccionado(null); }}
                className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-colors ${
                  sel
                    ? "border-amber-500 bg-amber-50 dark:bg-amber-900/20"
                    : "border-zinc-200 dark:border-zinc-700 hover:border-amber-300"
                }`}
              >
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ring-transparent">
                  {b.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.fotoUrl} alt={b.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg font-bold text-amber-600">
                      {b.nombre.charAt(0).toUpperCase()}
                    </div>
                  )}
                  {sel && (
                    <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                      <span className="text-amber-600 font-black text-sm">Sel.</span>
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className={`font-bold text-sm ${sel ? "text-amber-600 dark:text-amber-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                    {b.nombre}
                  </p>
                  {b.descripcion && (
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 line-clamp-2">{b.descripcion}</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PASO 2: Elegir fecha */}
      {barberoSeleccionado && (
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-4">
            2. Elige el día
          </h2>
          <div className="grid grid-cols-5 gap-2">
            {dias.map((d) => {
              const sel = fechaSeleccionada && fechaISO(d) === fechaISO(fechaSeleccionada);
              return (
                <button
                  key={fechaISO(d)}
                  onClick={() => { setFechaSeleccionada(d); setPaso("hora"); }}
                  className={`flex flex-col items-center py-3 px-1 rounded-2xl border-2 transition-colors text-sm font-semibold ${
                    sel
                      ? "border-amber-500 bg-amber-500 text-white"
                      : "border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-amber-400"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase opacity-70">{DIAS[d.getDay()]}</span>
                  <span className="text-base font-black">{d.getDate()}</span>
                  <span className="text-[10px] opacity-70">{MESES[d.getMonth()]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* PASO 3: Elegir hora */}
      {fechaSeleccionada && barberoSeleccionado && (
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-4">
            3. Elige la hora
          </h2>
          {cargandoSlots ? (
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {slots.map((slot) => {
                const lleno = slot.disponibles === 0;
                const sel = slotSeleccionado === slot.hora;
                return (
                  <button
                    key={slot.hora}
                    disabled={lleno}
                    onClick={() => { setSlotSeleccionado(slot.hora); setPaso("nombre"); }}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                      lleno
                        ? "border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 text-red-400 cursor-not-allowed line-through"
                        : sel
                        ? "border-amber-500 bg-amber-500 text-white"
                        : "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 text-green-700 dark:text-green-400 hover:border-green-400"
                    }`}
                  >
                    {formatHora(slot.hora)}
                    <span className="block text-[10px] opacity-70">{lleno ? "Ocupado" : "Libre"}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* PASO 4: Nombre + confirmar */}
      {slotSeleccionado && fechaSeleccionada && barberoSeleccionado && (
        <div className="mb-8">
          <h2 className="text-sm font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 mb-4">
            4. Tu nombre
          </h2>
          <input
            type="text"
            placeholder="¿Cómo te llamas?"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors mb-4"
          />

          {error && (
            <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">{error}</p>
          )}

          <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-4 text-sm space-y-1">
            <p className="text-zinc-500">Barbero: {barberoSeleccionado.nombre}</p>
            <p className="text-zinc-500">Fecha: {DIAS[fechaSeleccionada.getDay()]} {fechaSeleccionada.getDate()} {MESES[fechaSeleccionada.getMonth()]}</p>
            <p className="text-zinc-500">Hora: {formatHora(slotSeleccionado)}</p>
          </div>

          <button
            onClick={confirmar}
            disabled={!nombre.trim() || cargando}
            className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-bold text-base transition-colors disabled:cursor-not-allowed"
          >
            {cargando ? "Reservando..." : "Confirmar cita"}
          </button>
        </div>
      )}
    </div>
  );
}
