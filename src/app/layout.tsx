// src/app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Sistema BIA",
  description: "Gestión de Análisis BIA y Procesos Críticos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      {/* El fondo y el layout los controla cada página */}
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
