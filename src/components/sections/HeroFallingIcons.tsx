"use client";

import React, { useMemo } from "react";
import { HeroFallingIconsConfig, HeroIconPackKey, ThemePalette } from "@/types";
import {
  getNewYearTargetYear,
  getParticlesForDensity,
  HeroParticle,
  resolveHeroIconPack,
} from "@/lib/theme-engine";

export { getParticlesForDensity };

interface HeroFallingIconsProps {
  config?: HeroFallingIconsConfig;
  themeName?: string;
  themePalette?: ThemePalette;
}

// ----------------------------------------------------
// Iconos SVG Minimalistas (Solo Contorno / Modern Outline)
// ----------------------------------------------------
type IconRenderer = (props: React.SVGProps<SVGSVGElement>) => React.ReactElement;

const commonSvgProps: React.SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

// 1. Navidad
const ChristmasTree: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2L6 8h3l-4 6h4l-5 6h16l-5-6h4l-4-6h3L12 2z" />
    <path d="M10 20v2h4v-2" />
  </svg>
);
const Snowflake: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M12 5l-2-2m4 0l-2 2M12 19l-2 2m4 0l-2-2M5 12l-2-2m0 4l2-2M19 12l2-2m0 4l-2-2" />
  </svg>
);
const GiftBox: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="3" y="8" width="18" height="13" rx="2" />
    <path d="M12 8v13M3 13h18M7.5 8a2.5 2.5 0 0 1 0-5A3 3 0 0 1 12 8a3 3 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
  </svg>
);
const ChristmasBell: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const CandyCane: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M15 4a4 4 0 0 0-8 0v16a2 2 0 0 0 4 0V9a2 2 0 0 1 4 0" />
  </svg>
);

// 2. Halloween
const Pumpkin: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <ellipse cx="12" cy="13" rx="9" ry="8" />
    <path d="M12 2v3M8 11l1 2 1-2M14 11l1 2 1-2M8 17s1 1.5 4 1.5 4-1.5 4-1.5" />
  </svg>
);
const Ghost: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2a7 7 0 0 0-7 7v10c0 .6.4 1 1 1 .5 0 1-.3 1.3-.7L9 17.5l1.7 1.8c.4.4.9.7 1.3.7s1-.3 1.3-.7l1.7-1.8 1.7 1.8c.3.4.8.7 1.3.7.6 0 1-.4 1-1V9a7 7 0 0 0-7-7z" />
    <circle cx="9.5" cy="8.5" r=".75" fill="currentColor" />
    <circle cx="14.5" cy="8.5" r=".75" fill="currentColor" />
  </svg>
);
const Bat: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 12c-2-4-6-4-9-2 1 4 3 6 5 6-1 2 0 4 2 4s2-2 2-2 0 2 2 2 3-2 2-4c2 0 4-2 5-6-3-2-7-2-9 2z" />
    <path d="M10 9l2-3 2 3" />
  </svg>
);
const Skull: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M6 10a6 6 0 1 1 12 0c0 3-1 5-2 6v3a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-3c-1-1-2-3-2-6z" />
    <circle cx="9.5" cy="10" r="1.5" />
    <circle cx="14.5" cy="10" r="1.5" />
    <path d="M10 18v2M14 18v2" />
  </svg>
);

// 3. Espacio / Chavonauta
const Rocket: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <circle cx="15.5" cy="8.5" r="1.5" />
  </svg>
);
const Planet: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <circle cx="12" cy="12" r="6" />
    <path d="M2.5 14.5c2-2 6-4 11-4s8 1 8 3.5-3 4-8 4-8-1.5-11-3.5z" />
  </svg>
);
const Satellite: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M13 7 9 3 5 7l4 4M17 11l4 4-4 4-4-4M8 12l8 8M14 6l4 4" />
  </svg>
);
const SparkleStar: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4L12 2z" />
  </svg>
);
const Ufo: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <ellipse cx="12" cy="14" rx="9" ry="3.5" />
    <path d="M8 13c0-3 1.8-5 4-5s4 2 4 5" />
    <path d="M9 17.5 7 21M15 17.5 17 21M12 17.5v3.5" />
  </svg>
);

// 4. Tech & Cómputo
const Laptop: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M3 6h18v10H3zM1 18h22l-2 2H3z" />
  </svg>
);
const MonitorIcon: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const CpuChip: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="5" y="5" width="14" height="14" rx="2" />
    <rect x="8.5" y="8.5" width="7" height="7" rx="1" />
    <path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" />
  </svg>
);
const WifiIcon: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 20h.01M8.5 16.429a5 5 0 0 1 7 0M5 12.857a10 10 0 0 1 14 0M1.5 9.286a15 15 0 0 1 21 0" />
  </svg>
);
const Bolt: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);

// 5. Gaming & Arcade
const Gamepad: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M6 12h4m-2-2v4M15 11h.01M17 13h.01" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" />
  </svg>
);
const Joystick: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="3" y="14" width="18" height="7" rx="2" />
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v6M7 17.5h.01M17 17.5h.01" />
  </svg>
);
const Trophy: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2M6 3h12v7a6 6 0 0 1-12 0V3zM12 16v5M8 21h8" />
  </svg>
);
const Cartridge: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 3v4h8V3M8 12h8M10 16h4" />
  </svg>
);

// 6. Romance
const Heart: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const LoveLetter: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    <path d="M12 13.5l1.5-1.5a1.2 1.2 0 0 1 1.7 0c.5.5.5 1.2 0 1.7L12 16.5l-3.2-2.8a1.2 1.2 0 0 1 0-1.7 1.2 1.2 0 0 1 1.7 0L12 13.5z" />
  </svg>
);
const Rose: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M12 12v10M12 15c-2 0-4-1-4-3 0-1 2-2 4 1M12 17c2 0 4-1 4-3 0-1-2-2-4 1" />
  </svg>
);

// 7. Otoño
const MapleLeaf: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2l2 4 4-2-1 4 4 2-3 3 2 4-5-1-1 4-1-4-5 1 2-4-3-3 4-2-1-4 4 2 2-4zM12 19v4" />
  </svg>
);
const Acorn: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M7 9a5 5 0 0 0 10 0H7zM12 2v3M9 9c0 4 3 6 3 6s3-2 3-6" />
  </svg>
);
const Wind: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M17.7 7.7A2.5 2.5 0 1 1 19 12H2M14.7 17.7A2.5 2.5 0 1 0 16 13H5" />
  </svg>
);

// 8. Primavera
const Blossom: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <circle cx="12" cy="12" r="2.5" />
    <path d="M12 5.5a2.5 2.5 0 0 1 0-4 2.5 2.5 0 0 1 0 4zm6.18 4.49a2.5 2.5 0 0 1 3.8 1.24 2.5 2.5 0 0 1-3.8-1.24zm-2.36 7.25a2.5 2.5 0 0 1 2.36 3.24 2.5 2.5 0 0 1-2.36-3.24zm-7.64 0a2.5 2.5 0 0 1-2.36 3.24 2.5 2.5 0 0 1 2.36-3.24zm-2.36-7.25a2.5 2.5 0 0 1-3.8-1.24 2.5 2.5 0 0 1 3.8 1.24z" />
  </svg>
);
const Butterfly: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 7v10M12 7c-2-3-6-3-8 0s0 7 4 7l4-4M12 7c2-3 6-3 8 0s0 7-4 7l-4-4M12 17c-2 2-5 2-6 0s2-4 6-2M12 17c2 2 5 2 6 0s-2-4-6-2" />
  </svg>
);
const Sprout: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
  </svg>
);

// 9. Invierno
const IceCrystal: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <polygon points="12 2 19 9 12 22 5 9 12 2" />
    <path d="M5 9h14M12 2v20" />
  </svg>
);

// 10. Océano
const OceanWave: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M2 12c2.5-4 5.5-4 8 0s5.5 4 8 0 4-4 4-4M2 18c2.5-4 5.5-4 8 0s5.5 4 8 0 4-4 4-4" />
  </svg>
);
const WaterDrop: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
  </svg>
);
const Anchor: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <circle cx="12" cy="5" r="3" />
    <path d="M12 8v13M5 12H2a10 10 0 0 0 20 0h-3M9 12h6" />
  </svg>
);

// 11. Café
const CoffeeCup: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
    <path d="M6 2v2M10 2v2M14 2v2" />
  </svg>
);
const CoffeeBean: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <ellipse cx="12" cy="12" rx="6" ry="8" transform="rotate(30 12 12)" />
    <path d="M12 6c2 3-2 9 0 12" />
  </svg>
);

// 12. Destellos
const DiamondSparkle: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M6 3h12l4 6-10 12L2 9z" />
    <path d="M2 9h20M10 3l-2 6 4 12 4-12-2-6" />
  </svg>
);
const MagicTwinkle: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

// 13. Patrio
const Sombrero: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M2 17c3-2 7-3 10-3s7 1 10 3M6 15c0-4 2.5-8 6-8s6 4 6 8M10 7c0-2 1-3 2-3s2 1 2 3" />
  </svg>
);
const Firework: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
  </svg>
);

// 14. Año Nuevo (Brindis, Reloj de Medianoche e Insignia del Año Dinámico)
const ChampagneToast: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <path d="M8 22h8M12 15v7M7 3h10l-1.5 7.5a3.5 3.5 0 0 1-7 0L7 3z" />
    <path d="M6.5 7h11M10 2v1M14 1.5v1.5" />
  </svg>
);
const MidnightClock: IconRenderer = (p) => (
  <svg {...commonSvgProps} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l2.5-1.5M12 3v1M21 12h-1M12 21v-1M4 12H3" />
  </svg>
);
function createYearBadgeIcon(year: number): IconRenderer {
  const YearBadge: IconRenderer = (p) => (
    <svg {...commonSvgProps} viewBox="0 0 36 24" {...p}>
      <rect x="2" y="5" width="32" height="14" rx="4" strokeWidth={1.6} />
      <path d="M6 2l1 2M30 2l-1 2M6 22l1-2M30 22l-1-2" strokeWidth={1.5} />
      <text
        x="18"
        y="15"
        textAnchor="middle"
        fill="currentColor"
        stroke="none"
        fontSize="8.5"
        fontWeight="800"
        fontFamily="sans-serif"
      >
        {year}
      </text>
    </svg>
  );
  return YearBadge;
}

// ----------------------------------------------------
// Diccionario de Paquetes de Iconos
// ----------------------------------------------------
const ICON_PACK_COMPONENTS: Record<string, IconRenderer[]> = {
  christmas: [ChristmasTree, Snowflake, GiftBox, ChristmasBell, CandyCane],
  new_year: [Firework, ChampagneToast, MidnightClock, SparkleStar, MagicTwinkle],
  halloween: [Pumpkin, Ghost, Bat, Skull],
  space: [Rocket, Planet, Satellite, SparkleStar, Ufo],
  tech: [Laptop, MonitorIcon, CpuChip, WifiIcon, Bolt],
  gaming: [Gamepad, Joystick, Trophy, Cartridge, SparkleStar],
  romance: [Heart, LoveLetter, Rose, SparkleStar],
  autumn: [MapleLeaf, Acorn, Wind, SparkleStar],
  spring: [Blossom, Butterfly, Sprout, SparkleStar],
  winter: [Snowflake, IceCrystal, SparkleStar],
  ocean: [OceanWave, WaterDrop, Anchor, SparkleStar],
  coffee: [CoffeeCup, CoffeeBean, SparkleStar],
  sparkles: [SparkleStar, DiamondSparkle, MagicTwinkle],
  patrio: [Sombrero, ChristmasBell, Firework, SparkleStar],
};

// ----------------------------------------------------
// Partículas Distribuidas en Todo el Ancho (de 3% a 97%)
// ----------------------------------------------------

export function HeroFallingIcons({
  config,
  themeName,
  themePalette,
}: HeroFallingIconsProps) {
  // La cascada es opcional: solo se renderiza si está explícitamente habilitada (enabled: true)
  const isEnabled = config?.enabled === true;

  // Resolver el paquete de iconos activo
  const resolvedPackKey: HeroIconPackKey = useMemo(() => {
    return resolveHeroIconPack(config?.pack, themePalette, themeName);
  }, [config?.pack, themePalette, themeName]);

  const targetYear = useMemo(() => {
    return config?.targetYear || getNewYearTargetYear();
  }, [config?.targetYear]);

  const icons = useMemo(() => {
    if (resolvedPackKey === "new_year") {
      return [
        Firework,
        ChampagneToast,
        createYearBadgeIcon(targetYear),
        MidnightClock,
        SparkleStar,
        MagicTwinkle,
      ];
    }
    return ICON_PACK_COMPONENTS[resolvedPackKey] || ICON_PACK_COMPONENTS.tech;
  }, [resolvedPackKey, targetYear]);

  // Generar partículas distribuidas en todo el ancho según densidad
  const density = config?.density || "balanced";
  const activeParticles = useMemo(() => {
    return getParticlesForDensity(density);
  }, [density]);

  // Multiplicador de velocidad
  const speed = config?.speed || "normal";
  const speedMultiplier = speed === "slow" ? 1.4 : speed === "fast" ? 0.7 : 1.0;

  if (!isEnabled || icons.length === 0) {
    return null;
  }

  return (
    <>
      {/* Definición de Keyframes CSS embebidos para soporte directo e iframe */}
      <style>{`
        @keyframes heroWaterfallFall {
          0% {
            top: -55px;
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity, 0.55);
          }
          85% {
            opacity: var(--particle-opacity, 0.55);
          }
          100% {
            top: calc(100% + 55px);
            opacity: 0;
          }
        }
        @keyframes heroWaterfallSway {
          0% {
            transform: translateX(0px) rotate(0deg);
          }
          50% {
            transform: translateX(var(--sway-x, 14px)) rotate(15deg);
          }
          100% {
            transform: translateX(calc(var(--sway-x, 14px) * -1)) rotate(-15deg);
          }
        }
      `}</style>

      {/* Contenedor Absoluto Estricto del Hero (Overflow Hidden asegura desaparición limpia al salir) */}
      <div
        className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
        aria-hidden="true"
        data-testid="hero-falling-icons-container"
        data-pack={resolvedPackKey}
      >
        {activeParticles.map((p, idx) => {
          const IconComponent = icons[idx % icons.length];
          const duration = (p.duration * speedMultiplier).toFixed(2);
          const swayDuration = p.swayDuration.toFixed(2);

          return (
            <div
              key={p.id}
              className="absolute pointer-events-none will-change-transform flex items-center justify-center"
              style={
                {
                  left: p.left,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  color: "var(--primary-foreground, #ffffff)",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))",
                  animation: `heroWaterfallFall ${duration}s linear ${p.delay}s infinite, heroWaterfallSway ${swayDuration}s ease-in-out ${p.delay}s infinite alternate`,
                  "--particle-opacity": p.opacity,
                  "--sway-x": `${p.swayX}px`,
                } as React.CSSProperties
              }
            >
              <IconComponent className="w-full h-full" />
            </div>
          );
        })}
      </div>
    </>
  );
}
