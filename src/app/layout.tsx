import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chavonauta | Catálogo",
  description:
    "Escaparate digital y catálogo de servicios de cybercafé, impresiones, trámites, accesorios y zona gamer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
