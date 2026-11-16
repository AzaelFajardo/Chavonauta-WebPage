import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "secondary";
}

export function Badge({ children, variant = "primary" }: BadgeProps) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    accent: "bg-accent text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground border border-border",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-theme ${styles[variant]}`}
    >
      {children}
    </span>
  );
}
