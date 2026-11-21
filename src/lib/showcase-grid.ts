export interface ShowcaseGridConfig {
  containerClass: string;
  gridClass: string;
}

/**
 * Calcula la configuración de contenedor y grid para las tarjetas del hero y servicios
 * de forma que:
 * - 1 tarjeta: ancho contenido (~448px) y centrado sin estirarse desproporcionadamente
 * - 2 tarjetas: 2 columnas equilibradas (~384px c/u) sin dejar huecos vacíos
 * - 3 tarjetas: 3 columnas equilibradas (~340px c/u) sin dejar hueco en la 4ta columna
 * - 4 tarjetas: 4 columnas completas
 * - 5+ tarjetas: se acumulan por debajo con máximo 4 por fila
 */
export function getShowcaseGridConfig(count: number): ShowcaseGridConfig {
  if (count <= 1) {
    return {
      containerClass: "max-w-md mx-auto",
      gridClass: "grid grid-cols-1 gap-4 sm:gap-5",
    };
  }
  if (count === 2) {
    return {
      containerClass: "max-w-3xl mx-auto",
      gridClass: "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5",
    };
  }
  if (count === 3) {
    return {
      containerClass: "max-w-5xl mx-auto",
      gridClass: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5",
    };
  }
  // 4 o más tarjetas: máximo 4 por fila, acumulándose por debajo
  return {
    containerClass: "max-w-[1440px] mx-auto",
    gridClass: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5",
  };
}
