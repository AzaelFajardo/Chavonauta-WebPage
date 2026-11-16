import Link from "next/link";
import { BusinessInfo } from "@/types";

interface NavbarProps {
  business: BusinessInfo;
}

export function Navbar({ business }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      {business.announcementEnabled && business.announcementText && (
        <div className="bg-primary text-primary-foreground text-xs sm:text-sm py-2 px-4 text-center font-medium">
          {business.announcementText}
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-heading font-bold text-xl">
          <span className="text-primary">🚀</span>
          <span>{business.name}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <Link href="/catalogo" className="hover:text-primary transition-colors">
            Catálogo y Servicios
          </Link>
          <Link href="/#tarifas" className="hover:text-primary transition-colors">
            Tarifas
          </Link>
          <Link href="/#ubicacion" className="hover:text-primary transition-colors">
            Ubicación y Horarios
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/personalizador"
            className="text-xs px-3 py-1.5 rounded-theme border border-border bg-secondary text-secondary-foreground hover:border-primary transition-colors"
          >
            Panel / Personalizador
          </Link>
        </div>
      </div>
    </header>
  );
}
