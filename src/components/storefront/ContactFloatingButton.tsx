import { MessageCircle } from "lucide-react";
import { BusinessInfo } from "@/types";

interface ContactFloatingButtonProps {
  business: BusinessInfo;
}

export function ContactFloatingButton({ business }: ContactFloatingButtonProps) {
  const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, vi su página web y me gustaría consultar disponibilidad o cotizar un servicio/producto.`
  )}`;

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-5 right-5 z-40">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs sm:text-sm shadow-xl shadow-emerald-950/20 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-100" />
        </span>
        <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
        <span className="hidden sm:inline">¿Dudas o archivos? Escríbenos</span>
        <span className="sm:hidden font-semibold">WhatsApp</span>
      </a>
    </aside>
  );
}
