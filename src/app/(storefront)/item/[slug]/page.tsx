import Link from "next/link";
import { notFound } from "next/navigation";
import { MessageCircle, MapPin, ShieldCheck, Check } from "lucide-react";
import { repository } from "@/lib/data/repository";

export default async function ItemDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, theme] = await Promise.all([
    repository.getCatalogItemBySlug(slug),
    repository.getThemeConfig(),
  ]);

  if (!item || !item.active) {
    notFound();
  }

  const isService = item.type === "service";

  const whatsappMessage = encodeURIComponent(
    `Hola ${theme.business.name}, me interesa información sobre "${item.name}" que vi en su catálogo web.`
  );
  const whatsappHref = `https://wa.me/${theme.business.whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6">
      {/* Migas de pan */}
      <div className="text-xs opacity-80 mb-4 flex items-center gap-1.5 transition-colors">
        <Link
          href="/"
          style={{ color: "var(--primary)" }}
          className="hover:underline font-semibold"
        >
          Inicio
        </Link>
        <span>›</span>
        <Link
          href="/catalogo"
          style={{ color: "var(--primary)" }}
          className="hover:underline font-semibold"
        >
          Catálogo
        </Link>
        <span>›</span>
        <Link
          href={`/catalogo?categoria=${item.categorySlug}`}
          style={{ color: "var(--primary)" }}
          className="hover:underline font-semibold"
        >
          {item.categorySlug.replace(/-/g, " ")}
        </Link>
        <span>›</span>
        <span
          style={{ color: "var(--foreground)" }}
          className="font-bold truncate max-w-xs"
        >
          {item.name}
        </span>
      </div>

      {/* Contenedor Principal (3 columnas en desktop) */}
      <div
        style={{
          backgroundColor: "var(--card)",
          color: "var(--card-foreground)",
          borderColor: "var(--border)",
          borderRadius: "var(--radius)",
        }}
        className="p-6 sm:p-8 border shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 transition-colors"
      >
        {/* Columna Izquierda: Imagen Grande del Producto */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            style={{
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="w-full aspect-square max-w-[480px] bg-muted/30 border flex items-center justify-center p-4 overflow-hidden"
          >
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <span className="text-[11px] opacity-60 mt-3 text-center">
            Pasa el cursor sobre la imagen para ampliar
          </span>
        </div>

        {/* Columna Central: Información y Descripción */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div>
            <div
              style={{ color: "var(--primary)" }}
              className="text-xs font-bold mb-1 uppercase tracking-wider"
            >
              Marca / Sucursal: {theme.business.name}
            </div>

            <h1
              style={{ color: "var(--card-foreground)" }}
              className="font-heading font-bold text-xl sm:text-2xl leading-snug"
            >
              {item.name}
            </h1>

            <div
              style={{ borderColor: "var(--border)" }}
              className="mt-3 pb-3 border-b"
            >
              <span className="text-xs opacity-70 block font-medium">
                {isService ? "Modalidad de cobro:" : "Precio en mostrador:"}
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span
                  style={{ color: "var(--card-foreground)" }}
                  className="text-2xl sm:text-3xl font-black"
                >
                  {item.priceLabel}
                </span>
              </div>
            </div>

            <div className="mt-4">
              <h2
                style={{ color: "var(--card-foreground)" }}
                className="font-bold text-sm mb-2"
              >
                Acerca de este artículo
              </h2>
              <p className="text-xs sm:text-sm opacity-85 leading-relaxed">
                {item.description}
              </p>
            </div>

            {/* Tabla de especificaciones */}
            {item.specs && item.specs.length > 0 && (
              <div
                style={{ borderColor: "var(--border)" }}
                className="mt-6 border-t pt-4"
              >
                <h3
                  style={{ color: "var(--card-foreground)" }}
                  className="font-bold text-xs mb-2 uppercase tracking-wider"
                >
                  Detalles técnicos
                </h3>
                <dl className="space-y-1.5 text-xs">
                  {item.specs.map((spec) => (
                    <div
                      key={spec.label}
                      style={{ borderColor: "var(--border)" }}
                      className="grid grid-cols-3 gap-2 py-1.5 border-b"
                    >
                      <dt className="opacity-70 font-semibold">{spec.label}</dt>
                      <dd
                        style={{ color: "var(--card-foreground)" }}
                        className="col-span-2 font-medium"
                      >
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Columna Derecha: Caja de Contacto */}
        <div className="lg:col-span-3">
          <div
            style={{
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
              borderColor: "var(--border)",
              borderRadius: "var(--radius)",
            }}
            className="border p-5 shadow-xs transition-colors"
          >
            <div
              style={{ color: "var(--card-foreground)" }}
              className="text-xl font-bold mb-2"
            >
              {item.priceLabel}
            </div>

            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 mb-3">
              <Check className="w-4 h-4" />
              <span>Disponible en mostrador</span>
            </div>

            <div className="text-xs space-y-1.5 mb-4">
              <div>
                <span className="opacity-70">Atención:</span>{" "}
                <span
                  style={{ color: "var(--card-foreground)" }}
                  className="font-semibold"
                >
                  Directa en sucursal
                </span>
              </div>
              <div>
                <span className="opacity-70">Vendido por:</span>{" "}
                <span
                  style={{ color: "var(--primary)" }}
                  className="font-semibold"
                >
                  {theme.business.name}
                </span>
              </div>
            </div>

            {/* Botón WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: "var(--radius)",
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 font-bold text-xs shadow-2xs transition-opacity hover:opacity-90 mb-2 text-center"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Consultar por WhatsApp</span>
            </a>

            <div
              style={{ borderColor: "var(--border)" }}
              className="border-t pt-3 mt-3 text-[11px] opacity-75 space-y-1.5"
            >
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span>Atención en horario de sucursal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 opacity-70 shrink-0" />
                <span className="truncate">{theme.business.address}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
