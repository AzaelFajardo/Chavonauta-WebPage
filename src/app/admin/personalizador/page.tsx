import Link from "next/link";

export default function AdminCustomizerPage() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-heading font-bold">
              Personalizador Visual (Estilo Tiendanube)
            </h1>
            <p className="text-sm text-muted-foreground">
              Estructura base lista para conectar el editor de paleta, fuentes y secciones.
            </p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 text-sm rounded-theme bg-primary text-primary-foreground"
          >
            Ver Escaparate
          </Link>
        </div>
      </div>
    </div>
  );
}
