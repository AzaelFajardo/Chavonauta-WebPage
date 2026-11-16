import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "primary"
    | "accent"
    | "secondary"
    | "success"
    | "warning"
    | "danger"
    | "purple";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const styles: Record<string, string> = {
    primary: "bg-navy-100 text-navy-900 border border-navy-200",
    accent: "bg-navy-800 text-white",
    secondary: "bg-slate-100 text-slate-700 border border-slate-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-700 border border-red-200 font-bold",
    purple: "bg-purple-100 text-purple-700 border border-purple-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded ${
        styles[variant] || styles.primary
      } ${className}`}
    >
      {children}
    </span>
  );
}
