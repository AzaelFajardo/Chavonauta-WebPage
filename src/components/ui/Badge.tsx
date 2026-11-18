import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "muted";
  className?: string;
  style?: React.CSSProperties;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
  style = {},
}: BadgeProps) {
  const variantStyles: Record<
    string,
    { backgroundColor: string; color: string; borderColor: string }
  > = {
    primary: {
      backgroundColor: "color-mix(in srgb, var(--primary) 15%, transparent)",
      color: "var(--primary)",
      borderColor: "color-mix(in srgb, var(--primary) 35%, transparent)",
    },
    secondary: {
      backgroundColor: "var(--secondary)",
      color: "var(--secondary-foreground)",
      borderColor: "var(--border)",
    },
    accent: {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
      borderColor: "color-mix(in srgb, var(--accent) 50%, black 20%)",
    },
    muted: {
      backgroundColor: "var(--muted)",
      color: "var(--muted-foreground)",
      borderColor: "var(--border)",
    },
  };

  const current = variantStyles[variant] || variantStyles.primary;

  return (
    <span
      style={{
        backgroundColor: current.backgroundColor,
        color: current.color,
        borderColor: current.borderColor,
        borderRadius: "var(--radius)",
        ...style,
      }}
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold border shadow-2xs transition-colors ${className}`}
    >
      {children}
    </span>
  );
}
