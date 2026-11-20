"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error de aplicación:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-5xl font-black text-slate-300">!</div>
        <h1 className="text-xl font-bold text-slate-900">
          No pudimos cargar esta página
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ocurrió un problema temporal. Puedes reintentar o volver al inicio del
          catálogo. Si el problema continúa, contacta a la sucursal.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
