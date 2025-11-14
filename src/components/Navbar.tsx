"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/analisis-bia", label: "Mostrar Análisis BIA" },
    { href: "/estrategias-bia", label: "Mostrar Estrategias de Continuidad" },
    { href: "/proceso-critico", label: "Insertar Proceso Crítico" },
    { href: "/continuidad", label: "Insertar Estrategias de Continuidad" },
  ];

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="container mx-auto flex gap-6 p-4">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "hover:text-blue-300 transition-colors",
                active && "text-blue-400 font-semibold"
              )}
              aria-current={active ? "page" : undefined}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
