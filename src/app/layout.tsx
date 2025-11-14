import "./globals.css";
import type { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Sistema BIA",
  description: "Gestión de Análisis BIA y Procesos Críticos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#c5d0e4] flex">
        <Sidebar />

        <main className="flex-1 p-6 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
