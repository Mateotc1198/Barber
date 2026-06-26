"use client";

import { useEffect } from "react";

interface Props {
  titulo: string;
  mensaje: string;
  labelConfirmar?: string;
  labelCancelar?: string;
  variante?: "danger" | "default";
  onConfirmar: () => void;
  onCancelar: () => void;
}

export function ModalConfirmacion({
  titulo,
  mensaje,
  labelConfirmar = "Confirmar",
  labelCancelar = "Cancelar",
  variante = "default",
  onConfirmar,
  onCancelar,
}: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancelar();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onCancelar]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-backdrop-in"
      onClick={(e) => { if (e.target === e.currentTarget) onCancelar(); }}
    >
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-modal-in">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{titulo}</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">{mensaje}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-xl text-sm font-medium bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
          >
            {labelCancelar}
          </button>
          <button
            onClick={onConfirmar}
            className={`px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors cursor-pointer ${
              variante === "danger"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            {labelConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
