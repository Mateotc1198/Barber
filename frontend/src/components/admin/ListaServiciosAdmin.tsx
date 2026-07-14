"use client";

import { useState } from "react";
import Image from "next/image";
import { Servicio } from "@/types/servicio";
import { serviciosApi } from "@/infrastructure/api/serviciosApi";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion";
import { useToast } from "@/components/ui/ToastProvider";
import { FormularioServicio } from "./FormularioServicio";

interface Props {
  servicios: Servicio[];
  categorias: string[];
  onActualizar: () => Promise<void>;
}

export function ListaServiciosAdmin({ servicios, categorias, onActualizar }: Props) {
  const { mostrar } = useToast();
  const [editando, setEditando] = useState<Servicio | null>(null);
  const [creando, setCreando] = useState(false);
  const [confirmando, setConfirmando] = useState<string | null>(null);
  const [cuposEdicion, setCuposEdicion] = useState<Record<string, string>>({});
  const [reiniciando, setReiniciando] = useState(false);

  async function eliminar(id: string) {
    await serviciosApi.eliminar(id);
    setConfirmando(null);
    await onActualizar();
    mostrar("Servicio eliminado");
  }

  async function actualizarCupos(id: string) {
    const val = cuposEdicion[id];
    if (val === undefined) return;
    await serviciosApi.actualizarCupos(id, Number(val));
    setCuposEdicion((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    await onActualizar();
    mostrar("Cupos actualizados");
  }

  async function resetear() {
    setReiniciando(true);
    try {
      await serviciosApi.reset();
      await onActualizar();
      mostrar("Catálogo restaurado");
    } finally {
      setReiniciando(false);
    }
  }

  async function guardarNuevo(data: Omit<Servicio, "id" | "disponible">) {
    await serviciosApi.crear(data);
    setCreando(false);
    await onActualizar();
    mostrar("Servicio creado");
  }

  async function guardarEdicion(data: Omit<Servicio, "id" | "disponible">) {
    if (!editando) return;
    await serviciosApi.actualizar(editando.id, data);
    setEditando(null);
    await onActualizar();
    mostrar("Servicio actualizado");
  }

  if (creando) {
    return (
      <div className="py-4">
        <FormularioServicio categorias={categorias} onGuardar={guardarNuevo} onCancelar={() => setCreando(false)} />
      </div>
    );
  }

  if (editando) {
    return (
      <div className="py-4">
        <FormularioServicio inicial={editando} categorias={categorias} onGuardar={guardarEdicion} onCancelar={() => setEditando(null)} />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-zinc-500">{servicios.length} servicios</p>
        <div className="flex gap-2">
          <button onClick={resetear} disabled={reiniciando} className="px-3 py-1.5 text-xs rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 transition-colors cursor-pointer disabled:opacity-50">
            {reiniciando ? "Restaurando..." : "Restaurar demo"}
          </button>
          <button onClick={() => setCreando(true)} className="px-3 py-1.5 text-xs rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer">
            + Nuevo servicio
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-zinc-100 dark:border-zinc-800">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-900 text-left text-xs text-zinc-500 uppercase tracking-widest">
              <th className="px-4 py-3">Servicio</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Duración</th>
              <th className="px-4 py-3">Cupos</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {servicios.map((s) => (
              <tr key={s.id} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {s.imagenes[0] && (
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image src={s.imagenes[0]} alt={s.nombre} fill className="object-cover" />
                      </div>
                    )}
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">{s.nombre}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-500">{s.categoria}</td>
                <td className="px-4 py-3 font-medium text-amber-600">${s.precio.toLocaleString("es-CO")}</td>
                <td className="px-4 py-3 text-zinc-500">{s.duracionMinutos} min</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={cuposEdicion[s.id] ?? s.cupos}
                      onChange={(e) => setCuposEdicion((prev) => ({ ...prev, [s.id]: e.target.value }))}
                      onBlur={() => { if (cuposEdicion[s.id] !== undefined) void actualizarCupos(s.id); }}
                      className="w-16 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-center"
                    />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditando(s)} className="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer">Editar</button>
                    <button onClick={() => setConfirmando(s.id)} className="text-xs px-2 py-1 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 transition-colors cursor-pointer">Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {servicios.map((s) => (
          <div key={s.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-zinc-100 dark:border-zinc-800">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{s.nombre}</p>
                <p className="text-xs text-zinc-500">{s.categoria} · {s.duracionMinutos} min</p>
              </div>
              <span className="text-amber-600 font-bold text-sm">${s.precio.toLocaleString("es-CO")}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Cupos:</span>
                <input
                  type="number"
                  min="0"
                  value={cuposEdicion[s.id] ?? s.cupos}
                  onChange={(e) => setCuposEdicion((prev) => ({ ...prev, [s.id]: e.target.value }))}
                  onBlur={() => { if (cuposEdicion[s.id] !== undefined) void actualizarCupos(s.id); }}
                  className="w-16 px-2 py-1 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-center"
                />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditando(s)} className="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 cursor-pointer">Editar</button>
                <button onClick={() => setConfirmando(s.id)} className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-600 cursor-pointer">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {confirmando && (
        <ModalConfirmacion
          titulo="Eliminar servicio"
          mensaje="¿Seguro que quieres eliminar este servicio? Esta acción no se puede deshacer."
          labelConfirmar="Eliminar"
          variante="danger"
          onConfirmar={() => void eliminar(confirmando)}
          onCancelar={() => setConfirmando(null)}
        />
      )}
    </div>
  );
}
