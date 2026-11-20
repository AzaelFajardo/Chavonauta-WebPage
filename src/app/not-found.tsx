import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-4">
        <div className="text-5xl font-black text-slate-300">404</div>
        <h1 className="text-xl font-bold text-slate-900">
          No encontramos esta página
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          El enlace puede haber cambiado o el artículo ya no está disponible.
          Consulta el catálogo para ver los productos y servicios actuales.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
          >
            Ir al inicio
          </Link>
          <Link
            href="/catalogo"
            className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
