"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/analisis-bia", label: "Mostrar Análisis BIA" },
    { href: "/estrategias-bia", label: "Mostrar Estrategias de Continuidad" },
    { href: "/proceso-critico", label: "Insertar Proceso Crítico" },
    { href: "/continuidad", label: "Insertar Estrategias de Continuidad" },
  ];

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-gray-900 text-white flex flex-col p-4 shadow-xl">
      <h1 className="text-xl font-bold mb-6">Panel BIA</h1>

      <nav className="flex flex-col gap-2">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-md hover:bg-gray-700 transition-colors ${
                active ? "bg-gray-700 font-semibold" : ""
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
