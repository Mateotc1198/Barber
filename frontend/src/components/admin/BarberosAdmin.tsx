"use client";

import { useState } from "react";
import { Barbero, DiaHorario } from "@/types/barbero";
import { Resena } from "@/types/resena";
import { barberosApi } from "@/infrastructure/api/barberosApi";
import { resenasApi } from "@/infrastructure/api/resenasApi";
import { EstrellasRating } from "@/components/reserva/EstrellasRating";
import { ModalConfirmacion } from "@/components/ui/ModalConfirmacion";
import { useToast } from "@/components/ui/ToastProvider";

const NOMBRES_DIAS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const HORARIO_DEFECTO: DiaHorario[] = [0, 1, 2, 3, 4, 5, 6].map((diaSemana) => ({
  diaSemana,
  activo: diaSemana !== 0,
  horaInicio: "09:00",
  horaFin: "20:00",
}));

interface Props {
  barberos: Barbero[];
  onActualizar: () => Promise<void>;
}

export function BarberosAdmin({ barberos, onActualizar }: Props) {
  const { mostrar } = useToast();
  const [editando, setEditando] = useState<Barbero | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    fotoUrl: "",
    activo: true,
    horario: HORARIO_DEFECTO,
  });
  const [cargando, setCargando] = useState(false);

  const [resenasAbiertasDe, setResenasAbiertasDe] = useState<string | null>(null);
  const [resenas, setResenas] = useState<Resena[]>([]);

  const [confirmandoBarbero, setConfirmandoBarbero] = useState<string | null>(null);
  const [confirmandoResena, setConfirmandoResena] = useState<{ id: string; barberoId: string } | null>(null);

  function abrirCrear() {
    setForm({ nombre: "", descripcion: "", fotoUrl: "", activo: true, horario: HORARIO_DEFECTO });
    setEditando(null);
    setCreando(true);
  }

  function abrirEditar(b: Barbero) {
    setForm({
      nombre: b.nombre,
      descripcion: b.descripcion,
      fotoUrl: b.fotoUrl,
      activo: b.activo,
      horario: b.horario.length > 0 ? b.horario : HORARIO_DEFECTO,
    });
    setCreando(false);
    setEditando(b);
  }

  function actualizarDia(diaSemana: number, cambios: Partial<DiaHorario>) {
    setForm({
      ...form,
      horario: form.horario.map((d) => (d.diaSemana === diaSemana ? { ...d, ...cambios } : d)),
    });
  }

  async function guardar() {
    setCargando(true);
    try {
      const eraEdicion = !!editando;
      if (editando) {
        await barberosApi.actualizar(editando.id, { ...form, orden: editando.orden });
      } else {
        await barberosApi.crear({ ...form, orden: barberos.length + 1 });
      }
      setEditando(null);
      setCreando(false);
      await onActualizar();
      mostrar(eraEdicion ? "Barbero actualizado" : "Barbero creado");
    } finally {
      setCargando(false);
    }
  }

  async function eliminar(id: string) {
    await barberosApi.eliminar(id);
    setConfirmandoBarbero(null);
    await onActualizar();
    mostrar("Barbero eliminado");
  }

  async function toggleResenas(b: Barbero) {
    if (resenasAbiertasDe === b.id) {
      setResenasAbiertasDe(null);
      return;
    }
    setResenasAbiertasDe(b.id);
    setResenas(await resenasApi.listarPorBarbero(b.id));
  }

  async function eliminarResena(id: string, barberoId: string) {
    await resenasApi.eliminar(id);
    setConfirmandoResena(null);
    setResenas(await resenasApi.listarPorBarbero(barberoId));
    mostrar("Reseña eliminada");
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

          <div>
            <label className="text-xs text-zinc-500 mb-2 block">Horario de trabajo</label>
            <div className="space-y-2">
              {form.horario.map((d) => (
                <div key={d.diaSemana} className="flex flex-col sm:flex-row sm:items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800 last:border-0 sm:border-0 sm:pb-0">
                  <label className="flex items-center gap-2 sm:w-28 sm:flex-shrink-0 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={d.activo}
                      onChange={(e) => actualizarDia(d.diaSemana, { activo: e.target.checked })}
                      className="accent-amber-500"
                    />
                    <span className="text-xs text-zinc-700 dark:text-zinc-300">{NOMBRES_DIAS[d.diaSemana]}</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={d.horaInicio}
                      disabled={!d.activo}
                      onChange={(e) => actualizarDia(d.diaSemana, { horaInicio: e.target.value })}
                      className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs disabled:opacity-40 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-xs text-zinc-400 flex-shrink-0">a</span>
                    <input
                      type="time"
                      value={d.horaFin}
                      disabled={!d.activo}
                      onChange={(e) => actualizarDia(d.diaSemana, { horaFin: e.target.value })}
                      className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-xs disabled:opacity-40 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

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
            className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                  {b.fotoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={b.fotoUrl} alt={b.nombre} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <span className="text-sm font-bold text-amber-600">{b.nombre.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">{b.nombre}</p>
                  <p className="text-xs text-zinc-400 truncate">{b.descripcion || "Sin descripción"}</p>
                </div>
                <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full ${
                  b.activo
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"
                }`}>
                  {b.activo ? "Activo" : "Inactivo"}
                </span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 pl-[3.25rem] sm:pl-0">
                <button onClick={() => void toggleResenas(b)} className="text-xs text-zinc-500 hover:text-amber-600 font-semibold cursor-pointer">
                  {resenasAbiertasDe === b.id ? "Ocultar reseñas" : "Ver reseñas"}
                </button>
                <button onClick={() => abrirEditar(b)} className="text-xs text-amber-600 hover:text-amber-500 font-semibold cursor-pointer">Editar</button>
                <button onClick={() => setConfirmandoBarbero(b.id)} className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer">Eliminar</button>
              </div>
            </div>

            {resenasAbiertasDe === b.id && (
              <div className="border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 px-5 py-4 space-y-2">
                {resenas.length === 0 ? (
                  <p className="text-xs text-zinc-400">Sin reseñas todavía.</p>
                ) : (
                  resenas.map((r) => (
                    <div key={r.id} className="flex items-start justify-between gap-3 bg-white dark:bg-zinc-900 rounded-xl p-3 text-xs">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300">{r.nombreCliente}</span>
                          <EstrellasRating valor={r.calificacion} />
                        </div>
                        {r.comentario && <p className="text-zinc-500 dark:text-zinc-400">{r.comentario}</p>}
                      </div>
                      <button
                        onClick={() => setConfirmandoResena({ id: r.id, barberoId: b.id })}
                        className="text-red-500 hover:text-red-700 font-semibold flex-shrink-0 cursor-pointer"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {confirmandoBarbero && (
        <ModalConfirmacion
          titulo="Eliminar barbero"
          mensaje="¿Eliminar barbero? Esto no afecta reservas existentes."
          labelConfirmar="Eliminar"
          variante="danger"
          onConfirmar={() => void eliminar(confirmandoBarbero)}
          onCancelar={() => setConfirmandoBarbero(null)}
        />
      )}

      {confirmandoResena && (
        <ModalConfirmacion
          titulo="Eliminar reseña"
          mensaje="¿Eliminar esta reseña? Esta acción no se puede deshacer."
          labelConfirmar="Eliminar"
          variante="danger"
          onConfirmar={() => void eliminarResena(confirmandoResena.id, confirmandoResena.barberoId)}
          onCancelar={() => setConfirmandoResena(null)}
        />
      )}
    </div>
  );
}
