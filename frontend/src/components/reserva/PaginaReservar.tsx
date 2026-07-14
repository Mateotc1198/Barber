"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Servicio } from "@/types/servicio";
import { Barbero } from "@/types/barbero";
import { SlotDisponibilidad } from "@/types/reserva";
import { reservasApi } from "@/infrastructure/api/reservasApi";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { PerfilBarbero } from "./PerfilBarbero";
import { CalendarioBarbero } from "./CalendarioBarbero";

interface Props {
  servicio?: Servicio;
  barberos: Barbero[];
}

const REDIRECCION_MS = 8000;

const DIAS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function fechaISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatHora(hora: string): string {
  const [h, m] = hora.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}

type Paso = "barbero" | "perfil" | "fecha" | "hora" | "nombre" | "confirmado";

const PASOS: { paso: Paso; etiqueta: string }[] = [
  { paso: "barbero", etiqueta: "Barbero" },
  { paso: "perfil", etiqueta: "Perfil" },
  { paso: "fecha", etiqueta: "Fecha" },
  { paso: "hora", etiqueta: "Hora" },
  { paso: "nombre", etiqueta: "Datos" },
];

function AvatarBarbero({ barbero, tamano }: { barbero: Barbero; tamano: number }) {
  return (
    <div
      className="rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex-shrink-0"
      style={{ width: tamano, height: tamano }}
    >
      {barbero.fotoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={barbero.fotoUrl} alt={barbero.nombre} className="w-full h-full object-cover" />
      ) : (
        <div
          className="w-full h-full flex items-center justify-center font-bold text-amber-600"
          style={{ fontSize: tamano * 0.35 }}
        >
          {barbero.nombre.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
}

export function PaginaReservar({ servicio, barberos }: Props) {
  const router = useRouter();
  const [paso, setPaso] = useState<Paso>("barbero");
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<Barbero | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [slots, setSlots] = useState<SlotDisponibilidad[]>([]);
  const [cargandoSlots, setCargandoSlots] = useState(false);
  const [slotSeleccionado, setSlotSeleccionado] = useState<string | null>(null);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    barberos.filter((b) => b.activo).forEach((b) => {
      barberosApi.obtenerPerfil(b.id).catch(() => {});
    });
  }, [barberos]);

  useEffect(() => {
    if (!fechaSeleccionada || !barberoSeleccionado) return;
    setCargandoSlots(true);
    setSlots([]);
    setSlotSeleccionado(null);
    setError(null);
    reservasApi
      .disponibilidad(fechaISO(fechaSeleccionada), barberoSeleccionado.id, servicio?.id)
      .then(setSlots)
      .catch(() => setError("No se pudo cargar la disponibilidad"))
      .finally(() => setCargandoSlots(false));
  }, [fechaSeleccionada, barberoSeleccionado, servicio?.id]);

  async function confirmar() {
    if (!fechaSeleccionada || !slotSeleccionado || !nombre.trim() || !telefono.trim() || !barberoSeleccionado) return;
    setCargando(true);
    setError(null);
    try {
      await reservasApi.crear({
        servicioId: servicio?.id,
        barberoId: barberoSeleccionado.id,
        fecha: fechaISO(fechaSeleccionada),
        hora: slotSeleccionado,
        nombre: nombre.trim(),
        telefono: telefono.trim(),
      });
      reservasApi.invalidarDisponibilidad(fechaISO(fechaSeleccionada), barberoSeleccionado.id, servicio?.id);
      setPaso("confirmado");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al crear la reserva");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if (paso !== "confirmado") return;
    const t = setTimeout(() => router.push("/"), REDIRECCION_MS);
    return () => clearTimeout(t);
  }, [paso, router]);

  function elegirBarbero(b: Barbero) {
    setBarberoSeleccionado(b);
    setFechaSeleccionada(null);
    setSlotSeleccionado(null);
    setError(null);
    setPaso("perfil");
  }

  function cambiarBarbero() {
    setBarberoSeleccionado(null);
    setFechaSeleccionada(null);
    setSlotSeleccionado(null);
    setError(null);
    setPaso("barbero");
  }

  function volver() {
    const indice = PASOS.findIndex((p) => p.paso === paso);
    if (indice <= 0) return;
    setPaso(PASOS[indice - 1].paso);
  }

  if (paso === "confirmado" && fechaSeleccionada && slotSeleccionado && barberoSeleccionado) {
    const [anio, mes, dia] = fechaISO(fechaSeleccionada).split("-");
    return (
      <div className="text-center py-10 animate-step-in">
        <div className="animate-success-pop w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 dark:bg-amber-900/20 ring-4 ring-amber-100 dark:ring-amber-900/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-8 h-8 text-amber-600 dark:text-amber-400">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-100 mb-2">Cita confirmada</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">Te esperamos, {nombre.split(" ")[0]}.</p>

        <div className="bg-white dark:bg-zinc-900 rounded-[var(--radius-card)] border border-zinc-100 dark:border-zinc-800 shadow-[var(--shadow-card)] dark:shadow-[var(--shadow-card-dark)] p-6 mb-8 text-left text-sm">
          <div className="space-y-2">
            {servicio && (
              <p><span className="text-zinc-400">Servicio:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{servicio.nombre}</span></p>
            )}
            <p><span className="text-zinc-400">Barbero:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{barberoSeleccionado.nombre}</span></p>
          </div>
          <div className="my-4 border-t border-dashed border-zinc-200 dark:border-zinc-700" />
          <div className="space-y-2">
            <p><span className="text-zinc-400">Fecha:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{dia}/{mes}/{anio}</span></p>
            <p><span className="text-zinc-400">Hora:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{formatHora(slotSeleccionado)}</span></p>
            <p><span className="text-zinc-400">Nombre:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{nombre}</span></p>
            <p><span className="text-zinc-400">Celular:</span> <span className="font-semibold text-zinc-900 dark:text-zinc-100">{telefono}</span></p>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
        >
          Ir al inicio ahora
        </button>
        <div className="h-0.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mt-4">
          <div
            key={paso}
            className="h-full bg-amber-500/40 origin-left animate-redirect-drain"
            style={{ animationDuration: `${REDIRECCION_MS}ms` }}
          />
        </div>
      </div>
    );
  }

  const indiceActual = PASOS.findIndex((p) => p.paso === paso);

  return (
    <div className="max-w-md mx-auto">
      {/* Barra de progreso + volver */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1.5">
          <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            {indiceActual > 0 && (
              <button
                type="button"
                onClick={volver}
                aria-label="Volver"
                className="-ml-1 p-1 text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3 h-3">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            {PASOS[indiceActual].etiqueta}
          </span>
          <span className="text-[11px] text-zinc-400">
            Paso {indiceActual + 1} de {PASOS.length}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-300"
            style={{ width: `${((indiceActual + 1) / PASOS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={paso} className="animate-step-in">
        {/* PASO: Elegir barbero */}
        {paso === "barbero" && (
          <div>
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-1">Elige tu barbero</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5">Con quién quieres tu próxima cita</p>
            <div className="space-y-3">
              {barberos.filter((b) => b.activo).map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => elegirBarbero(b)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 hover:border-amber-400 active:scale-[0.99] transition-all text-left"
                >
                  <AvatarBarbero barbero={b} tamano={56} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-zinc-900 dark:text-zinc-100">{b.nombre}</p>
                    {b.descripcion && (
                      <p className="text-xs text-zinc-400 dark:text-zinc-500 line-clamp-1 mt-0.5">{b.descripcion}</p>
                    )}
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-5 h-5 text-amber-500 flex-shrink-0">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* PASO: Perfil del barbero */}
        {paso === "perfil" && barberoSeleccionado && (
          <PerfilBarbero
            barbero={barberoSeleccionado}
            onContinuar={() => setPaso("fecha")}
          />
        )}

        {/* PASO: Elegir fecha */}
        {paso === "fecha" && barberoSeleccionado && (
          <div>
            <MiniBarbero barbero={barberoSeleccionado} onCambiar={cambiarBarbero} />
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-4">Elige el día</h2>
            <CalendarioBarbero
              horario={barberoSeleccionado.horario}
              fechaSeleccionada={fechaSeleccionada}
              onSeleccionar={(d) => {
                setFechaSeleccionada(d);
                setPaso("hora");
              }}
              onPrefetch={(d) => {
                reservasApi
                  .disponibilidad(fechaISO(d), barberoSeleccionado.id, servicio?.id)
                  .catch(() => {});
              }}
            />
          </div>
        )}

        {/* PASO: Elegir hora */}
        {paso === "hora" && fechaSeleccionada && barberoSeleccionado && (
          <div>
            <MiniBarbero barbero={barberoSeleccionado} onCambiar={cambiarBarbero} />
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-1">Elige la hora</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              {DIAS[fechaSeleccionada.getDay()]} {fechaSeleccionada.getDate()} de {MESES[fechaSeleccionada.getMonth()]}
            </p>
            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">{error}</p>
            )}
            {cargandoSlots ? (
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : slots.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500 text-center py-6">
                Sin horarios disponibles ese día.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {slots.map((slot) => {
                  const lleno = slot.disponibles === 0;
                  const sel = slotSeleccionado === slot.hora;
                  return (
                    <button
                      key={slot.hora}
                      type="button"
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

        {/* PASO: Datos de contacto + confirmar */}
        {paso === "nombre" && slotSeleccionado && fechaSeleccionada && barberoSeleccionado && (
          <div>
            <MiniBarbero barbero={barberoSeleccionado} onCambiar={cambiarBarbero} />
            <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100 mb-4">Tus datos</h2>

            <div className="bg-zinc-50 dark:bg-zinc-800 rounded-2xl p-4 mb-4 text-sm space-y-1">
              <p className="text-zinc-500">Barbero: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{barberoSeleccionado.nombre}</span></p>
              <p className="text-zinc-500">Fecha: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{DIAS[fechaSeleccionada.getDay()]} {fechaSeleccionada.getDate()} {MESES[fechaSeleccionada.getMonth()]}</span></p>
              <p className="text-zinc-500">Hora: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{formatHora(slotSeleccionado)}</span></p>
            </div>

            <div className="space-y-3 mb-4">
              <input
                type="text"
                placeholder="¿Cómo te llamas?"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
              <input
                type="tel"
                placeholder="Número de celular"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 dark:bg-red-900/20 rounded-xl p-3">{error}</p>
            )}

            <button
              type="button"
              onClick={confirmar}
              disabled={!nombre.trim() || !telefono.trim() || cargando}
              className="w-full py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white font-bold text-base transition-colors disabled:cursor-not-allowed"
            >
              {cargando ? "Reservando..." : "Confirmar cita"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function MiniBarbero({ barbero, onCambiar }: { barbero: Barbero; onCambiar: () => void }) {
  return (
    <button
      type="button"
      onClick={onCambiar}
      className="w-full flex items-center gap-3 p-3 mb-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-left"
    >
      <AvatarBarbero barbero={barbero} tamano={40} />
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-zinc-400">Tu barbero</p>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">{barbero.nombre}</p>
      </div>
      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex-shrink-0">Cambiar</span>
    </button>
  );
}
