import Link from "next/link";
import { MessageCircle, MapPin, Clock } from "lucide-react";
import { BusinessInfo, Category } from "@/types";

interface FooterProps {
  business: BusinessInfo;
  categories: Category[];
}

export function Footer({ business, categories }: FooterProps) {
  const whatsappHref = `https://wa.me/${business.whatsappNumber}`;

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Identidad */}
        <div>
          <div className="flex items-center gap-2 font-heading font-black text-lg text-slate-900 mb-2">
            <span className="w-6 h-6 rounded bg-navy-900 text-white flex items-center justify-center text-xs font-bold">
              C
            </span>
            <span>{business.name}</span>
          </div>
          <p className="text-slate-500 leading-relaxed mb-4">
            {business.slogan}
          </p>
          <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium text-[11px]">
            Catálogo Digital
          </span>
        </div>

        {/* Departamentos */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Departamentos
          </h4>
          <ul className="space-y-2 text-slate-500">
            {categories.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="hover:text-slate-900 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ubicación y Horarios */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Atención en Tienda
          </h4>
          <div className="space-y-2.5 text-slate-500">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{business.address}</span>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{business.schedule}</span>
            </p>
          </div>
        </div>

        {/* Contacto Directo */}
        <div>
          <h4 className="font-semibold text-slate-900 text-sm mb-3">
            Contacto
          </h4>
          <p className="text-slate-500 mb-3 leading-relaxed">
            Consulta disponibilidad de artículos o envía tus archivos para imprimir.
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Directo</span>
          </a>
        </div>
      </div>

      {/* Barra de copyright y acceso a personalizador para el dueño */}
      <div className="border-t border-slate-100 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400 text-[11px]">
          <span>
            © {new Date().getFullYear()} {business.name}. Catálogo digital informativo.
          </span>
          <Link
            href="/admin/personalizador"
            className="hover:text-slate-600 transition-colors"
          >
            Acceso a Administración
          </Link>
        </div>
      </div>
    </footer>
  );
}
