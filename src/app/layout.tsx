import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Sistema BIA",
  description: "Gestión de Análisis BIA y Procesos Críticos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#c5d0e4] flex">
        <Sidebar />

        {/* Contenido principal */}
        <main className="flex-1 p-10 overflow-x-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
