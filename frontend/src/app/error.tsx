"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      <div>
        <p className="text-5xl mb-4">✂</p>
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">Algo salió mal</h2>
        <p className="text-sm text-zinc-500 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
