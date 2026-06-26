"use client";

import { useState } from "react";
import { Servicio, OpcionPersonalizada } from "@/types/servicio";
import { UploadImagenes } from "./UploadImagenes";

interface Props {
  inicial?: Partial<Servicio>;
  categorias: string[];
  onGuardar: (data: Omit<Servicio, "id" | "disponible">) => Promise<void>;
  onCancelar: () => void;
}

const PASO_DETALLES = 0;
const PASO_IMAGENES = 1;
const PASO_OPCIONES = 2;

export function FormularioServicio({ inicial, categorias, onGuardar, onCancelar }: Props) {
  const [paso, setPaso] = useState(PASO_DETALLES);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [precio, setPrecio] = useState(String(inicial?.precio ?? ""));
  const [categoria, setCategoria] = useState(inicial?.categoria ?? categorias[0] ?? "");
  const [cupos, setCupos] = useState(String(inicial?.cupos ?? "5"));
  const [duracion, setDuracion] = useState(String(inicial?.duracionMinutos ?? "30"));
  const [imagenes, setImagenes] = useState<string[]>(inicial?.imagenes ?? []);
  const [opciones, setOpciones] = useState<OpcionPersonalizada[]>(
    inicial?.opcionesPersonalizadas ?? []
  );

  function agregarOpcion() {
    setOpciones([...opciones, { nombre: "", valores: [""] }]);
  }

  function actualizarNombreOpcion(i: number, valor: string) {
    setOpciones(opciones.map((op, idx) => (idx === i ? { ...op, nombre: valor } : op)));
  }

  function actualizarValoresOpcion(i: number, valores: string) {
    setOpciones(
      opciones.map((op, idx) =>
        idx === i ? { ...op, valores: valores.split(",").map((v) => v.trim()).filter(Boolean) } : op
      )
    );
  }

  function eliminarOpcion(i: number) {
    setOpciones(opciones.filter((_, idx) => idx !== i));
  }

  async function enviar() {
    setError(null);
    if (!nombre.trim()) { setError("El nombre es requerido"); setPaso(PASO_DETALLES); return; }
    if (!precio || isNaN(Number(precio)) || Number(precio) <= 0) { setError("Precio inválido"); setPaso(PASO_DETALLES); return; }
    if (imagenes.length === 0) { setError("Agrega al menos una imagen"); setPaso(PASO_IMAGENES); return; }

    setGuardando(true);
    try {
      await onGuardar({
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precio: Number(precio),
        categoria,
        cupos: Number(cupos),
        duracionMinutos: Number(duracion),
        imagenes,
        opcionesPersonalizadas: opciones.length > 0 ? opciones : undefined,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setGuardando(false);
    }
  }

  const pasos = ["Detalles", "Imágenes", "Opciones"];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-6 max-w-xl w-full mx-auto">
      {/* Steps */}
      <div className="flex gap-2 mb-6">
        {pasos.map((label, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPaso(i)}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              i === paso
                ? "bg-amber-600 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Paso 0: Detalles */}
      {paso === PASO_DETALLES && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Nombre *</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Precio ($) *</label>
              <input type="number" min="0" step="0.01" value={precio} onChange={(e) => setPrecio(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Cupos</label>
              <input type="number" min="0" value={cupos} onChange={(e) => setCupos(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Duración (min)</label>
              <input type="number" min="1" value={duracion} onChange={(e) => setDuracion(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1 block">Categoría</label>
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Paso 1: Imágenes */}
      {paso === PASO_IMAGENES && (
        <UploadImagenes urls={imagenes} onChange={setImagenes} />
      )}

      {/* Paso 2: Opciones personalizadas */}
      {paso === PASO_OPCIONES && (
        <div className="space-y-4">
          {opciones.map((op, i) => (
            <div key={i} className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500">Opción {i + 1}</span>
                <button type="button" onClick={() => eliminarOpcion(i)} className="text-xs text-red-500 hover:text-red-600 cursor-pointer">Eliminar</button>
              </div>
              <input placeholder="Nombre (ej: Color de tinte)" value={op.nombre} onChange={(e) => actualizarNombreOpcion(i, e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
              <input placeholder="Valores separados por coma (ej: Negro, Castaño, Rubio)" value={op.valores.join(", ")} onChange={(e) => actualizarValoresOpcion(i, e.target.value)} className="w-full px-3 py-2 rounded-xl text-sm bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          ))}
          <button type="button" onClick={agregarOpcion} className="w-full py-3 rounded-xl border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-sm text-zinc-500 hover:border-amber-500 hover:text-amber-600 transition-colors cursor-pointer">
            + Agregar opción personalizada
          </button>
        </div>
      )}

      {/* Botones */}
      <div className="flex justify-between mt-6">
        <button type="button" onClick={onCancelar} className="px-4 py-2 rounded-xl text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer">
          Cancelar
        </button>
        <div className="flex gap-2">
          {paso > 0 && (
            <button type="button" onClick={() => setPaso(paso - 1)} className="px-4 py-2 rounded-xl text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 transition-colors cursor-pointer">
              Anterior
            </button>
          )}
          {paso < pasos.length - 1 ? (
            <button type="button" onClick={() => setPaso(paso + 1)} className="px-4 py-2 rounded-xl text-sm bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors cursor-pointer">
              Siguiente
            </button>
          ) : (
            <button type="button" onClick={enviar} disabled={guardando} className="px-5 py-2 rounded-xl text-sm bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-400 text-white font-semibold transition-colors cursor-pointer disabled:cursor-not-allowed">
              {guardando ? "Guardando..." : "Guardar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
