import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chavonauta | Catálogo",
  description:
    "Escaparate digital y catálogo de servicios, impresiones, trámites, accesorios y zona gamer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="min-h-screen antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
