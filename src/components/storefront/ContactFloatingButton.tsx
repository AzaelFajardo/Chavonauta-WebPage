import { MessageCircle } from "lucide-react";
import { BusinessInfo } from "@/types";

interface ContactFloatingButtonProps {
  business: BusinessInfo;
}

export function ContactFloatingButton({ business }: ContactFloatingButtonProps) {
  const whatsappHref = `https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(
    `Hola ${business.name}, me gustaría consultar sobre la disponibilidad de un producto.`
  )}`;

  return (
    <aside aria-label="Contacto por WhatsApp" className="fixed bottom-6 right-6 z-40">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm shadow-md transition-all hover:shadow-lg focus:outline-none"
      >
        <MessageCircle className="w-4 h-4 fill-white" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </aside>
  );
}
