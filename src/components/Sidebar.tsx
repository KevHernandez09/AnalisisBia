"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  PlusCircle,
  Workflow,
  FolderPlus,
  LifeBuoy,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      href: "/analisis-bia",
      label: "Mostrar Análisis BIA",
      icon: <FileText size={18} />,
    },
    {
      href: "/estrategias-bia",
      label: "Mostrar Estrategias de Continuidad",
      icon: <Workflow size={18} />,
    },
    {
      href: "/proceso-critico",
      label: "Insertar Proceso Crítico",
      icon: <ClipboardCheck size={18} />,
    },
    {
      href: "/continuidad",
      label: "Insertar Estrategias de Continuidad",
      icon: <PlusCircle size={18} />,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0073a4] text-gray-200 border-r border-gray-800 flex flex-col select-none">
      {/* HEADER */}
      <div className="px-6 py-5 border-b border-white-800">
        <h1 className="text-sm font-semibold uppercase tracking-wide text-white-400">
          Menú - BIA
        </h1>
      </div>

      {/* NAV LINKS */}
      <nav className="flex flex-col py-4 gap-1 flex-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;

          return (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-3 px-6 py-2 text-sm rounded-r-full
                hover:bg-[#1a2530] transition-colors
                ${active ? "bg-[#1f2e3a] text-white font-medium" : "text-white-300"}
              `}
            >
              {icon}
              {label}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto border-t border-gray-800 px-6 py-4 flex flex-col gap-3 text-sm">
        <Link
          href="/soporte"
          className="flex items-center gap-3 text-gray-300 hover:text-white transition"
        >
          <LifeBuoy size={18} />
          <span>Soporte Técnico</span>
        </Link>

        <Link
          href="/guia-usuario"
          className="flex items-center gap-3 text-gray-300 hover:text-white transition"
        >
          <BookOpen size={18} />
          <span>Guía del Usuario</span>
        </Link>
      </div>
    </aside>
  );
}
