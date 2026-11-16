import { BusinessInfo } from "@/types";

interface FooterProps {
  business: BusinessInfo;
}

export function Footer({ business }: FooterProps) {
  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <h3 className="font-heading font-bold text-lg mb-2">{business.name}</h3>
          <p className="text-muted-foreground">{business.slogan}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Dirección y Horarios</h4>
          <p className="text-muted-foreground">{business.address}</p>
          <p className="text-muted-foreground mt-1">{business.schedule}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-2">Contacto Directo</h4>
          <p className="text-muted-foreground">
            WhatsApp: +{business.whatsappNumber}
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Página de muestra y catálogo digital — {new Date().getFullYear()} {business.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
