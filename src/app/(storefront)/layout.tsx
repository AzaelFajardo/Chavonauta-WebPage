import React from "react";
import type { Metadata } from "next";
import { repository } from "@/lib/data/repository";
import { resolveEffectiveTheme, themeToCssVars } from "@/lib/theme-engine";
import { getSiteUrl } from "@/lib/site-url";
import { Navbar } from "@/components/storefront/Navbar";
import { Footer } from "@/components/storefront/Footer";
import { ContactFloatingButton } from "@/components/storefront/ContactFloatingButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  const theme = await repository.getThemeConfig();
  const business = theme.business;
  const siteUrl = getSiteUrl();
  const title = `${business.name} | ${business.slogan}`;
  const description =
    `${business.slogan}. Catálogo de productos, servicios, impresiones y renta de equipos en ${business.address}.`.slice(
      0,
      160
    );
  const image = business.logoUrl || "/android-chrome-512x512.png";

  return {
    metadataBase: siteUrl,
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: business.name,
      locale: "es_MX",
      type: "website",
      images: [{ url: image, alt: business.name }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [rawTheme, categories, items] = await Promise.all([
    repository.getThemeConfig(),
    repository.getCategories(),
    repository.getCatalogItems(),
  ]);
  const theme = resolveEffectiveTheme(rawTheme);
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
      <Navbar
        business={theme.business}
        categories={categories}
        items={items}
      />
      <main className="flex-1">{children}</main>
      <Footer business={theme.business} categories={categories} />
      <ContactFloatingButton business={theme.business} />
    </div>
  );
}
