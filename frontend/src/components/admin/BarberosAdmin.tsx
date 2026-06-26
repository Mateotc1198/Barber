"use client";

import { useState, useEffect } from "react";
import { Barbero } from "@/types/barbero";
import { barberosApi } from "@/infrastructure/api/barberosApi";

export function BarberosAdmin() {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [editando, setEditando] = useState<Barbero | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", fotoUrl: "", activo: true });
  const [cargando, setCargando] = useState(false);

  async function cargar() {
    setBarberos(await barberosApi.listar());
  }

  useEffect(() => { void cargar(); }, []);

  function abrirCrear() {
    setForm({ nombre: "", descripcion: "", fotoUrl: "", activo: true });
    setEditando(null);
    setCreando(true);
  }

  function abrirEditar(b: Barbero) {
    setForm({ nombre: b.nombre, descripcion: b.descripcion, fotoUrl: b.fotoUrl, activo: b.activo });
    setCreando(false);
    setEditando(b);
  }

  async function guardar() {
    setCargando(true);
    try {
      if (editando) {
        await barberosApi.actualizar(editando.id, { ...form, orden: editando.orden });
      } else {
        await barberosApi.crear({ ...form, orden: barberos.length + 1 });
      }
      setEditando(null);
      setCreando(false);
      await cargar();
    } finally {
      setCargando(false);
    }
  }

  async function eliminar(id: string) {
    if (!confirm("¿Eliminar barbero? Esto no afecta reservas existentes.")) return;
    await barberosApi.eliminar(id);
    await cargar();
  }

  const mostrarForm = creando || !!editando;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Barberos</h2>
        <button
          onClick={abrirCrear}
          className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer"
        >
          + Agregar
        </button>
      </div>

      {mostrarForm && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100">
            {editando ? "Editar barbero" : "Nuevo barbero"}
          </h3>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Descripción</label>
            <input
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">URL de foto</label>
            <input
              value={form.fotoUrl}
              onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })}
              placeholder="https://... o /uploads/..."
              className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:border-amber-500"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(e) => setForm({ ...form, activo: e.target.checked })}
              className="accent-amber-500"
            />
            <span className="text-sm text-zinc-700 dark:text-zinc-300">Activo (visible para clientes)</span>
          </label>
          <div className="flex gap-2">
            <button
              onClick={guardar}
              disabled={!form.nombre.trim() || cargando}
              className="px-5 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-zinc-300 text-white text-sm font-semibold rounded-full transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {cargando ? "Guardando..." : "Guardar"}
            </button>
            <button
              onClick={() => { setEditando(null); setCreando(false); }}
              className="px-5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-sm font-semibold rounded-full transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {barberos.map((b) => (
          <div
            key={b.id}
            className="flex items-center gap-4 bg-white dark:bg-zinc-900 rounded-2xl px-5 py-4 border border-zinc-100 dark:border-zinc-800"
          >
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
              {b.fotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.fotoUrl} alt={b.nombre} className="w-full h-full object-cover rounded-full" />
              ) : "✂"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{b.nombre}</p>
              <p className="text-xs text-zinc-400 truncate">{b.descripcion || "Sin descripción"}</p>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              b.activo
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
            }`}>
              {b.activo ? "Activo" : "Inactivo"}
            </span>
            <button onClick={() => abrirEditar(b)} className="text-xs text-amber-600 hover:text-amber-500 font-semibold cursor-pointer">Editar</button>
            <button onClick={() => void eliminar(b.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}
