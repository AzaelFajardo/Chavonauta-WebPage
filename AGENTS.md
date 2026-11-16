# AGENTS.md — Guía de Contexto y Reglas para Agentes IA (LLMs)

Este documento define el contexto de negocio, la arquitectura técnica y las reglas de flujo de trabajo en Git/GitHub que cualquier agente de IA (LLM) o colaborador debe seguir al trabajar en **Chavonauta-WebPage**.

---

## 1. Contexto del Proyecto

**Chavonauta-WebPage** es una plataforma web de escaparate (*showcase*) y catálogo digital para el **Cybercafé Chavonauta**, inspirada en la experiencia visual y de autogestión de **Tiendanube**.

### Reglas de Negocio Clave
- **Página de Muestra (Sin Carrito ni Cotizador)**:
  - El sitio funciona exclusivamente como **escaparate digital y catálogo interactivo** de productos y servicios.
  - **NO se debe implementar** carrito de compras (`cart`), pasarela de pagos (`checkout`), gestión de órdenes/pedidos ni sistema de cotización.
  - Los llamados a la acción (CTA) deben ser informativos o de contacto directo (ej. ver detalles del producto/servicio, consultar disponibilidad por WhatsApp, ver ubicación u horarios).
- **Autogestión y Personalización para el Cliente (Modelo Tiendanube)**:
  - El dueño del cybercafé debe poder personalizar su página desde un panel `/admin` sin tocar código ni depender de desarrolladores.
  - **Qué puede personalizar**:
    1. **Identidad y Tema**: Logotipo, nombre/eslogan, paleta de colores (primario, secundario, acento, fondo claro/oscuro), tipografías y estilo de bordes.
    2. **Secciones Modulares del Inicio**: Activar, ocultar, editar contenido y reordenar bloques de la página principal (*Hero Banner*, *Servicios del Cyber*, *Productos Destacados*, *Tarifas de Equipos/Consolas*, *Promociones*, *Ubicación y Horarios*, *Preguntas Frecuentes*).
    3. **Catálogo de Productos y Servicios**: Crear, editar, pausar o eliminar productos (accesorios, papelería, snacks) y servicios (impresiones, escaneo, renta de PC/consolas, recargas), incluyendo imágenes, precios informativos, etiquetas (*"Nuevo"*, *"Oferta"*, *"Popular"*) y categorías.

---

## 2. Stack Tecnológico

- **Framework**: Next.js (App Router) con TypeScript.
- **Estilos y Motor de Temas**: Tailwind CSS + CSS Variables dinámicas (`--primary`, `--secondary`, `--background`, `--foreground`, `--radius`) + componentes accesibles estilo `shadcn/ui`.
- **Persistencia y Backend**: Supabase (PostgreSQL, Auth, Storage) con capa de abstracción que incluye respaldo en JSON/almacenamiento local para desarrollo y pruebas sin fricción.
- **Reordenamiento en el Personalizador**: `@dnd-kit` para arrastrar y soltar secciones en el panel de diseño.
- **Iconografía**: `lucide-react`.

---

## 3. Estructura de Carpetas del Proyecto

```text
Chavonauta-WebPage/
├── public/                        # Activos estáticos base (logos por defecto, placeholders)
├── src/
│   ├── app/
│   │   ├── (storefront)/          # Escaparate público (visible para los visitantes)
│   │   │   ├── page.tsx           # Inicio dinámico (renderiza las secciones activas del tema)
│   │   │   ├── catalogo/          # Catálogo con filtros por categoría, etiquetas y búsqueda
│   │   │   ├── item/[slug]/       # Vista de detalle de producto o servicio
│   │   │   └── layout.tsx         # Inyecta las CSS Variables del tema personalizado
│   │   ├── admin/                 # Panel de autogestión del cliente
│   │   │   ├── personalizador/    # Editor visual tipo Tiendanube (Sidebar de ajustes + Vista previa en vivo)
│   │   │   ├── catalogo/          # CRUD de productos, servicios, categorías e imágenes
│   │   │   └── configuracion/     # Datos del cybercafé, horarios, redes sociales, WhatsApp y mapa
│   │   └── api/                   # Endpoints para guardar configuración de tema y catálogo
│   ├── components/
│   │   ├── sections/              # Secciones modulares (HeroSection, ServicesSection, FeaturedCatalog, PromoBanner, RatesSection, LocationSection)
│   │   ├── storefront/            # Navbar, Footer, ItemCard, CategoryFilter, ContactFloatingButton
│   │   ├── customizer/            # Controles del editor (ColorPaletteEditor, SectionManager, ImageField)
│   │   └── ui/                    # Componentes base reutilizables (Button, Input, Modal, Badge, Tabs)
│   ├── lib/
│   │   ├── data/                  # Repositorio de datos (adaptador Supabase / JSON local con datos semilla de Chavonauta)
│   │   └── theme-engine/          # Esquema por defecto del tema y generador de variables CSS
│   └── types/                     # Contratos TypeScript (ThemeConfig, SectionBlock, CatalogItem, Category)
├── AGENTS.md                      # Este archivo de contexto y reglas para LLMs
├── README.md                      # Documentación general del repositorio
└── .gitignore
```

---

## 4. Flujo de Trabajo en Git y GitHub (Obligatorio)

Todo agente de IA o desarrollador debe respetar estrictamente las siguientes reglas de control de versiones:

### A. Una Rama por Implementación (`Branch per Implementation`)
1. **No desarrollar directamente en `main`**: La rama `main` representa la versión estable e integrada.
2. **Crear una rama dedicada antes de escribir código**: Cada nueva funcionalidad, módulo o corrección debe tener su propia rama creada a partir de `main`.
3. **Convención de nombres de ramas**:
   - `feat/<nombre-corto>` — Nuevas características o secciones (ej. `feat/theme-engine`, `feat/catalog-showcase`, `feat/admin-customizer`).
   - `fix/<nombre-corto>` — Corrección de errores (ej. `fix/mobile-navbar`).
   - `chore/<nombre-corto>` — Configuración de proyecto, dependencias o estructura base (ej. `chore/project-scaffold`).
   - `docs/<nombre-corto>` — Cambios en documentación (ej. `docs/agents-guidelines`).
   - `style/<nombre-corto>` — Ajustes puramente visuales o de estilos CSS.

### B. Commits Cortos y Descriptivos
1. **Atomicidad**: Cada commit debe abarcar un cambio lógico concreto y funcional (no acumular toda una implementación gigante en un solo commit).
2. **Formato**: Usar prefijos tipo *Conventional Commits* seguidos de una descripción breve, clara y al grano (máximo ~60-72 caracteres en la primera línea):
   - `<tipo>: <descripción corta y descriptiva>`
3. **Ejemplos válidos**:
   - `docs: agrega AGENTS.md y actualiza alcance en README`
   - `chore: inicializa proyecto Next.js con Tailwind y TypeScript`
   - `feat: implementa motor de variables CSS para temas dinamicos`
   - `feat: agrega seccion Hero personalizable al escaparate`
   - `feat: crea vista de catalogo con filtros por categoria`
   - `feat: agrega panel personalizador con vista previa en vivo`

---

## 5. Lineamientos de Diseño y UX (Estilo Chavonauta + Tiendanube)

- **Identidad Chavonauta**: Estética moderna, tecnológica y amigable (inspiración espacial/gamer sutil adaptable a través del personalizador, con excelente legibilidad tanto en modo claro como oscuro).
- **Edición sin Fricción**: Todo texto, color, imagen o sección visible en la página pública debe provenir de la configuración del tema (`ThemeConfig`) o del catálogo (`CatalogItem[]`), nunca quedar rígidamente quemado (*hardcoded*) sin posibilidad de edición desde `/admin`.
- **Diseño Responsivo**: Tanto el escaparate público como el catálogo deben verse impecables en celulares, tablets y monitores de escritorio.
