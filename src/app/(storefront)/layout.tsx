import React from "react";
import { repository } from "@/lib/data/repository";
import { themeToCssVars } from "@/lib/theme-engine";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ContactFloatingButton } from "@/components/storefront/ContactFloatingButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, categories] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCategories(),
  ]);
  const cssVars = themeToCssVars(theme);

  return (
    <div
      style={{
        ...cssVars,
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        fontFamily: cssVars["--font-body"] || "var(--font-body)",
      } as React.CSSProperties}
      className="min-h-screen flex flex-col bg-background text-foreground antialiased transition-colors duration-200"
    >
      <Navbar business={theme.business} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer business={theme.business} categories={categories} />
      <ContactFloatingButton business={theme.business} />
    </div>
  );
}
