import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Sistema BIA",
  description: "Gestión de Análisis BIA y Procesos Críticos",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 ml-64">
          {children}
        </main>
      </body>
    </html>
  );
}
