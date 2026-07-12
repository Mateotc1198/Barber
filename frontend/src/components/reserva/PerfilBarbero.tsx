"use client";

import { useState, useEffect } from "react";
import { Barbero } from "@/types/barbero";
import { PerfilBarbero as PerfilBarberoInfo } from "@/types/resena";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { resenasApi } from "@/infrastructure/api/resenasApi";
import { EstrellasRating } from "./EstrellasRating";

interface Props {
  barbero: Barbero;
  onContinuar: () => void;
  onCambiar: () => void;
}

export function PerfilBarbero({ barbero, onContinuar, onCambiar }: Props) {
  const [perfil, setPerfil] = useState<PerfilBarberoInfo | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      setPerfil(await barberosApi.obtenerPerfil(barbero.id));
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void cargar();
  }, [barbero.id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function enviarResena() {
    if (!nombreCliente.trim() || calificacion === 0) return;
    setEnviando(true);
    try {
      await resenasApi.crear({
        barberoId: barbero.id,
        nombreCliente: nombreCliente.trim(),
        calificacion,
        comentario: comentario.trim() || undefined,
      });
      setNombreCliente("");
      setCalificacion(0);
      setComentario("");
      setMostrarForm(false);
      await cargar();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onCambiar}
        className="text-xs font-semibold text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 mb-4 transition-colors"
      >
        ‹ Elegir otro barbero
      </button>

      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 ring-4 ring-amber-100 dark:ring-amber-900/30 mb-3">
          {barbero.fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={barbero.fotoUrl} alt={barbero.nombre} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-amber-600">
              {barbero.nombre.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <p className="text-xl font-black text-zinc-900 dark:text-zinc-100">{barbero.nombre}</p>
        {barbero.descripcion && (
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 max-w-xs">{barbero.descripcion}</p>
        )}

        {cargando ? (
          <div className="h-5 w-40 rounded bg-zinc-100 dark:bg-zinc-800 animate-pulse mt-3" />
        ) : (
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 mt-3">
            <div className="flex items-center gap-1.5">
              <EstrellasRating valor={perfil?.promedioCalificacion ?? 0} />
              <span>
                {perfil && perfil.totalResenas > 0
                  ? `${perfil.promedioCalificacion.toFixed(1)} (${perfil.totalResenas})`
                  : "Sin reseñas aún"}
              </span>
            </div>
            <span>·</span>
            <span>{perfil?.totalServicios ?? 0} servicios</span>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-5 mb-4">
        {!cargando && perfil && perfil.resenas.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto mb-4 pr-1">
            {perfil.resenas.map((r) => (
              <div key={r.id} className="text-xs bg-zinc-50 dark:bg-zinc-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{r.nombreCliente}</span>
                  <EstrellasRating valor={r.calificacion} />
                </div>
                {r.comentario && <p className="text-zinc-500 dark:text-zinc-400">{r.comentario}</p>}
              </div>
            ))}
          </div>
        )}

        {!mostrarForm ? (
          <button
            type="button"
            onClick={() => setMostrarForm(true)}
            className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
          >
            + Dejar una reseña
          </button>
        ) : (
          <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <input
              type="text"
              placeholder="Tu nombre"
              value={nombreCliente}
              onChange={(e) => setNombreCliente(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
            />
            <EstrellasRating valor={calificacion} onChange={setCalificacion} tamano="md" />
            <textarea
              placeholder="Comentario (opcional)"
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={enviarResena}
                disabled={!nombreCliente.trim() || calificacion === 0 || enviando}
                className="px-4 py-2 rounded-full bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white text-xs font-semibold transition-colors"
              >
                {enviando ? "Enviando..." : "Publicar reseña"}
              </button>
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onContinuar}
        className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-white font-bold text-sm transition-colors"
      >
        Continuar
      </button>
    </div>
  );
}
