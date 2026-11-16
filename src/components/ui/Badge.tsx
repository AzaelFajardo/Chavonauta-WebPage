import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "accent" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const styles: Record<string, string> = {
    primary: "bg-navy-50 text-navy-800 border border-navy-200/70",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    accent: "bg-navy-900 text-white",
    muted: "bg-slate-50 text-slate-500 border border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded ${
        styles[variant] || styles.primary
      } ${className}`}
    >
      {children}
    </span>
  );
}
