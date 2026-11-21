import { ShowcaseCard } from "@/types";

const HERO_RENT_IMAGE =
  "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80";
const HERO_PRINT_IMAGE =
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&w=300&q=80";
const HERO_PHOTO_IMAGE =
  "https://images.unsplash.com/photo-1568667256549-094345857637?auto=format&fit=crop&w=300&q=80";
const HERO_SCAN_IMAGE =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=300&q=80";
const HERO_LAMINATE_IMAGE =
  "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=300&q=80";
const HERO_KEYBOARD_IMAGE =
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=300&q=80";
const HERO_CABLE_IMAGE =
  "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=300&q=80";
const HERO_USB_IMAGE =
  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=300&q=80";
const HERO_HEADPHONES_IMAGE =
  "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=300&q=80";
const HERO_REPAIR_IMAGE =
  "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80";
const HERO_SIDE_IMAGE =
  "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_HERO_CARDS: ShowcaseCard[] = [
  {
    title: "Renta de PC e Internet",
    description:
      "Fibra óptica simétrica, paquetería Office e impresión directa desde tu estación de trabajo.",
    imageUrl: HERO_RENT_IMAGE,
    showRentRates: true,
    linkLabel: "Ver tarifas de computadoras",
    linkHref: "/#tarifas",
  },
  {
    title: "Centro de Impresiones",
    imageLayout: "grid",
    gridItems: [
      { label: "Impresión B/N", imageUrl: HERO_PRINT_IMAGE },
      { label: "Color & Fotos", imageUrl: HERO_PHOTO_IMAGE },
      { label: "Escaneo a PDF", imageUrl: HERO_SCAN_IMAGE },
      { label: "Enmicado térmico", imageUrl: HERO_LAMINATE_IMAGE },
    ],
    linkLabel: "Enviar archivos por WhatsApp",
    linkWhatsappMessage:
      "Hola Chavonauta, deseo enviar archivos para imprimir o cotizar copias.",
  },
  {
    title: "Accesorios Tecnológicos",
    imageLayout: "grid",
    gridItems: [
      {
        label: "Teclados y Mouse",
        imageUrl: HERO_KEYBOARD_IMAGE,
        href: "/catalogo?categoria=teclados-y-mouse",
      },
      {
        label: "Cables y Carga",
        imageUrl: HERO_CABLE_IMAGE,
        href: "/catalogo?categoria=cables-y-cargadores",
      },
      {
        label: "Memorias USB",
        imageUrl: HERO_USB_IMAGE,
        href: "/catalogo?categoria=memorias",
      },
      {
        label: "Audífonos",
        imageUrl: HERO_HEADPHONES_IMAGE,
        href: "/catalogo?categoria=audifonos-y-diademas",
      },
    ],
    linkLabel: "Explorar departamentos",
    linkHref: "/catalogo",
  },
  {
    title: "Reparación de Equipos",
    description:
      "Mantenimiento preventivo, formateo, cambio de piezas y diagnóstico para PC, laptops, celulares y consolas.",
    imageUrl: HERO_REPAIR_IMAGE,
    badge: "Diagnóstico en sucursal",
    linkLabel: "Consultar diagnóstico por WhatsApp",
    linkWhatsappMessage:
      "Hola Chavonauta, tengo un equipo que requiere revisión técnica o reparación.",
  },
];

export const DEFAULT_HERO_CONTENT: Record<string, unknown> = {
  badgeText: "Catálogo Oficial y Servicios en Sucursal",
  primaryCtaText: "Ver Todo el Catálogo",
  primaryCtaHref: "/catalogo",
  secondaryCtaText: "Contactar por WhatsApp",
  secondaryCtaHref: "",
  sideImageUrl: HERO_SIDE_IMAGE,
  sideImageBadge: "",
  sideImageUseRate: true,
  cards: DEFAULT_HERO_CARDS,
};

const SERVICE_TRAMITES_IMAGE =
  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80";
const SERVICE_RECHARGE_IMAGE =
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80";
const SERVICE_DESIGN_IMAGE =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80";
const SERVICE_STATIONERY_IMAGE =
  "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=600&q=80";

export const DEFAULT_SERVICES_CARDS: ShowcaseCard[] = [
  {
    title: "Trámites Digitales",
    description:
      "Consulta e impresión de CURP certificada, actas de nacimiento, recibos CFE y citas. (No RFC 1ra vez).",
    imageUrl: SERVICE_TRAMITES_IMAGE,
    linkLabel: "Consultar trámite por WhatsApp",
    linkWhatsappMessage:
      "Hola Chavonauta, necesito asesoría con un trámite digital.",
  },
  {
    title: "Recargas Telefónicas",
    description:
      "Saldo y paquetes de datos para Telcel, Movistar, AT&T, Bait y más compañías. En mostrador.",
    imageUrl: SERVICE_RECHARGE_IMAGE,
    linkLabel: "Ver horarios y sucursal",
    linkHref: "/#ubicacion",
  },
  {
    title: "Diseño & Programación",
    description:
      "Diseño de lonas, invitaciones, publicidad comercial y desarrollo de páginas web y aplicaciones a la medida.",
    imageUrl: SERVICE_DESIGN_IMAGE,
    linkLabel: "Cotizar proyecto por WhatsApp",
    linkWhatsappMessage:
      "Hola Chavonauta, deseo cotizar un proyecto de diseño o programación.",
  },
  {
    title: "Trabajos de Papelería",
    description:
      "Forrado de libretas y libros, engargolados con arillo y pastas, preparación de carpetas escolares y de oficina.",
    imageUrl: SERVICE_STATIONERY_IMAGE,
    linkLabel: "Ver artículos de papelería",
    linkHref: "/catalogo?categoria=papeleria",
  },
];

export const DEFAULT_SERVICES_CONTENT: Record<string, unknown> = {
  cards: DEFAULT_SERVICES_CARDS,
};
