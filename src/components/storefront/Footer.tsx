import Link from "next/link";
import {
  Rocket,
  MapPin,
  Clock,
  MessageCircle,
  ShieldCheck,
  Phone,
} from "lucide-react";
import { BusinessInfo, Category } from "@/types";

interface FooterProps {
  business: BusinessInfo;
  categories: Category[];
}

export function Footer({ business, categories }: FooterProps) {
  const whatsappHref = `https://wa.me/${business.whatsappNumber}`;

  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300 mt-20">
      {/* Barra de Confianza / Beneficios tipo e-commerce */}
      <div className="border-b border-slate-800 bg-navy-950/70 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-amber-300 shrink-0">
              ⚡
            </span>
            <div>
              <p className="font-bold text-white text-sm">Impresión Inmediata</p>
              <p className="text-slate-400">Envía tus PDFs por WhatsApp</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-emerald-400 shrink-0">
              💻
            </span>
            <div>
              <p className="font-bold text-white text-sm">Renta de PC $7/hr</p>
              <p className="text-slate-400">Media hora: $4.00 MXN</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-sky-400 shrink-0">
              🔧
            </span>
            <div>
              <p className="font-bold text-white text-sm">Reparación Especializada</p>
              <p className="text-slate-400">Todo tipo de equipos digitales</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center text-purple-400 shrink-0">
              📱
            </span>
            <div>
              <p className="font-bold text-white text-sm">Recargas Electrónicas</p>
              <p className="text-slate-400">Todas las compañías móviles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal del Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs">
        {/* Identidad */}
        <div>
          <div className="flex items-center gap-2 font-heading font-extrabold text-lg text-white mb-3">
            <span className="w-8 h-8 rounded-lg bg-navy-700 border border-navy-600 flex items-center justify-center text-white">
              <Rocket className="w-4 h-4" />
            </span>
            <span>{business.name}</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">{business.slogan}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-navy-900 border border-navy-800 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Escaparate Digital & Catálogo Oficial</span>
          </div>
        </div>

        {/* Departamentos y Categorías */}
        <div>
          <h4 className="font-heading font-bold text-sm text-white mb-3 uppercase tracking-wider">
            Departamentos
          </h4>
          <ul className="space-y-2 text-slate-400">
            {categories.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/catalogo?categoria=${c.slug}`}
                  className="hover:text-amber-300 transition-colors"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ubicación y Horarios */}
        <div>
          <h4 className="font-heading font-bold text-sm text-white mb-3 uppercase tracking-wider">
            Sucursal y Horarios
          </h4>
          <div className="space-y-3 text-slate-400">
            <p className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{business.address}</span>
            </p>
            <p className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{business.schedule}</span>
            </p>
            <p className="flex items-start gap-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>+{business.whatsappNumber}</span>
            </p>
          </div>
        </div>

        {/* Atención Directa */}
        <div>
          <h4 className="font-heading font-bold text-sm text-white mb-3 uppercase tracking-wider">
            Atención Inmediata
          </h4>
          <p className="text-slate-400 mb-4 leading-relaxed">
            ¿Requieres cotizar un trabajo de diseño, programación, reparación o enviar archivos para imprimir?
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Escríbenos por WhatsApp</span>
          </a>
          <div className="mt-3 text-[11px] text-slate-500 text-center">
            Respuesta en horario de servicio
          </div>
        </div>
      </div>

      {/* Pie de página final */}
      <div className="border-t border-slate-800 py-4 px-4 text-center text-[11px] text-slate-500">
        © {new Date().getFullYear()} {business.name}. Todos los derechos reservados. Plataforma de catálogo y muestra de servicios.
      </div>
    </footer>
  );
}
