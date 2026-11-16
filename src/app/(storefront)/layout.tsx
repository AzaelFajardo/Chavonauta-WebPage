import React from "react";
import { repository } from "@/lib/data/repository";
import { themeToCssVars } from "@/lib/theme-engine";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await repository.getThemeConfig();
  const cssVars = themeToCssVars(theme);

  return (
    <div style={cssVars as React.CSSProperties} className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar business={theme.business} />
      <main className="flex-1">{children}</main>
      <Footer business={theme.business} />
    </div>
  );
}
